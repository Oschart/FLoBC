use exonum::{
    crypto::{Hash, KeyPair, PublicKey},
    messages::{AnyTx, Verified},
};
use exonum_explorer_service::ExplorerFactory;
use exonum_merkledb::ObjectHash;
use exonum_rust_runtime::api;
use exonum_testkit::{
    explorer::api::TransactionQuery, ApiKind, Spec, TestKit, TestKitApi, TestKitBuilder,
};
// Import data types used in tests from the crate where the service is defined.
use cryptocurrency::{
    api::WalletQuery,
    contracts::{CryptocurrencyInterface, CryptocurrencyService},
    schema::Wallet,
    transactions::{CreateWallet, TxTransfer},
};
use pretty_assertions::assert_eq;
use serde_json::json;
use futures::executor::block_on;


/// Alice's wallets name.
const ALICE_NAME: &str = "Alice";
/// Bob's wallet name.
const BOB_NAME: &str = "Bob";
/// Service instance id.
const INSTANCE_ID: u32 = 1010;
/// Service instance name.
const INSTANCE_NAME: &str = "nnm-token";

fn create_testkit() -> (TestKit, CryptocurrencyApi){
    // let artifact = CryptocurrencyService.artifact_id();
    let mut testkit = TestKitBuilder::validator()
        .with(Spec::new(ExplorerFactory).with_default_instance())
        .with(Spec::new(CryptocurrencyService).with_instance(INSTANCE_ID, INSTANCE_NAME, ()))
        .build();

    let api = CryptocurrencyApi {
        inner: testkit.api(),
    };
    (testkit, api)

}


struct CryptocurrencyApi {
    pub inner: TestKitApi,
}

impl CryptocurrencyApi {
    async fn create_wallet(&self, name: &str) -> (Verified<AnyTx>, KeyPair) {
        let keypair = KeyPair::random();
        // Create a pre-signed transaction
        let tx = keypair.create_wallet(INSTANCE_ID, CreateWallet::new(name));
        let tx_info: serde_json::Value = self
            .inner
            .public(ApiKind::Explorer)
            .query(&json!({ "tx_body": tx }))
            .post("v1/transactions")
            .await
            .unwrap();
        assert_eq!(tx_info, json!({ "tx_hash": tx.object_hash() }));
        (tx, keypair)
    }

    async fn transfer(&self, tx: &Verified<AnyTx>) {
        let tx_info: serde_json::Value = self
            .inner
            .public(ApiKind::Explorer) // Not `ApiKind::Service(_)`!
            .query(&json!({ "tx_body": tx }))
            .post("v1/transactions")
            .await
            .unwrap();
        assert_eq!(tx_info, json!({ "tx_hash": tx.object_hash() }));
    }

    async fn get_wallet(&self, pub_key: PublicKey) -> Wallet {
        self.inner
            .public(ApiKind::Service(INSTANCE_NAME))
            .query(&WalletQuery { pub_key })
            .get("v1/wallet")
            .await
            .unwrap()
    }

    async fn assert_no_wallet(&self, pub_key: PublicKey) {
        let err = self
            .inner
            .public(ApiKind::Service(INSTANCE_NAME))
            .query(&WalletQuery { pub_key })
            .get::<Wallet>("v1/wallet")
            .await
            .unwrap_err();
    
        assert_eq!(err.http_code, api::HttpStatusCode::NOT_FOUND);
        assert_eq!(err.body.title, "Wallet not found");
        assert_eq!(
            err.body.source,
            format!("{}:{}", INSTANCE_ID, INSTANCE_NAME)
        );
    }

    /// Asserts that the transaction with the given hash has a specified status.
    async fn assert_tx_status(&self, tx_hash: Hash, expected_status: &serde_json::Value) {
        let info: serde_json::Value = self
            .inner
            .public(ApiKind::Explorer)
            .query(&TransactionQuery::new(tx_hash))
            .get("v1/transactions")
            .await
            .unwrap();

        if let serde_json::Value::Object(mut info) = info {
            let tx_status = info.remove("status").unwrap();
            assert_eq!(tx_status, *expected_status);
        } else {
            panic!("Invalid transaction info format, object expected");
        }
    }
}

/// Check that the wallet creation transaction works when invoked via API.
#[tokio::test]
async fn test_create_wallet() {
    let (mut testkit, api) = create_testkit();
    // Create and send a transaction via API
    let (tx, _) = api.create_wallet(ALICE_NAME).await;
    testkit.create_block();
    api.assert_tx_status(tx.object_hash(), &json!({ "type": "success" }))
        .await;

    // Check that the user indeed is persisted by the service.
    let wallet = api.get_wallet(tx.author()).await;
    assert_eq!(wallet.pub_key, tx.author());
    assert_eq!(wallet.name, ALICE_NAME);
    assert_eq!(wallet.balance, 100);
}

#[tokio::test]
async fn test_transfer_from_nonexisting_wallet(){
    let (mut testkit, api) = create_testkit();
    let (tx_alice, alice) = api.create_wallet(ALICE_NAME).await;
    let (tx_bob, _) = api.create_wallet(BOB_NAME).await;
    // Do not commit Alice's transaction, so Alice's wallet does not exist
    // when a transfer occurs.
    testkit.create_block_with_tx_hashes(&[tx_bob.object_hash()]);
    api.assert_no_wallet(tx_alice.author()).await;
    let tx = alice.transfer(
        INSTANCE_ID,
        TxTransfer {
            to: tx_bob.author(),
            amount: 10,
            seed: 0,
        },
    );

    api.transfer(&tx).await;
    testkit.create_block_with_tx_hashes(&[tx.object_hash()]);
    api.assert_tx_status(
        tx.object_hash(),
        &json!({
            "type": "service_error",
            "code": 1,
            // Description shortened for readability
            "description": "Sender doesn\'t exist.",
            "runtime_id": 0,
            "call_site": {
                "call_type": "method",
                "instance_id": INSTANCE_ID,
                "method_id": 1,
            },
        }),
    ).await;
}
