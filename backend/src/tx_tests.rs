use exonum::{
    crypto::{KeyPair, PublicKey},
    runtime::SnapshotExt,
};
use exonum_merkledb::{access::Access, Snapshot};
use exonum_testkit::TestKit;

// Import data types used in tests from the crate where the service is defined.
use crate::{
    contracts::{CryptocurrencyInterface, CryptocurrencyService},
    schema::{CurrencySchema, Wallet},
    transactions::{CreateWallet, TxTransfer},
};

// Alice's wallets name.
const ALICE_NAME: &str = "Alice";
// Bob's wallet name.
const BOB_NAME: &str = "Bob";
// Service instance id.
const INSTANCE_ID: u32 = 1010;
// Service instance name.
const INSTANCE_NAME: &str = "nnm-token";

fn init_testkit() -> TestKit {
    TestKit::for_rust_service(
        CryptocurrencyService, // service instance
        INSTANCE_NAME, // name of the instance
        INSTANCE_ID, // numerical ID of the instance
        (), // Initialization arguments (none)
    )
}

fn get_schema<'a>(
    snapshot: &'a dyn Snapshot,
) -> CurrencySchema<impl Access + 'a> {
    CurrencySchema::new(snapshot.for_service(INSTANCE_NAME).unwrap())
}

/// Returns the wallet identified by the given public key
/// or `None` if such a wallet doesn't exist.
fn try_get_wallet(
    testkit: &TestKit,
    pubkey: &PublicKey,
) -> Option<Wallet> {
    let snapshot = testkit.snapshot();
    let schema = get_schema(&snapshot);
    schema.wallets.get(pubkey)
}

/// Returns the wallet identified by the given public key.
fn get_wallet(testkit: &TestKit, pubkey: &PublicKey) -> Wallet {
    try_get_wallet(testkit, pubkey).expect("No wallet persisted")
}

#[test]
fn test_create_wallet() {
    let mut testkit = init_testkit();
    let keypair = KeyPair::random();
    let tx = keypair.create_wallet(INSTANCE_ID, CreateWallet::new(ALICE_NAME));
    testkit.create_block_with_transaction(tx.clone());

    // Check that the user indeed is persisted by the service
    let wallet = get_wallet(&testkit, &tx.author());
    assert_eq!(wallet.pub_key, tx.author());
    assert_eq!(wallet.name, ALICE_NAME);
    assert_eq!(wallet.balance, 100);
}

#[test]
fn test_transfer() {
    let mut testkit = init_testkit();
    let alice = KeyPair::random();
    let bob = KeyPair::random();
    testkit.create_block_with_transactions(vec![
        alice.create_wallet(INSTANCE_ID, CreateWallet::new(ALICE_NAME)),
        bob.create_wallet(INSTANCE_ID, CreateWallet::new(BOB_NAME)),
        alice.transfer(
            INSTANCE_ID,
            TxTransfer {
                amount: 10,
                seed: 0,
                to: bob.public_key(),
            },
        ),
    ]);
    let alice_wallet = get_wallet(&testkit, &alice.public_key());
    assert_eq!(alice_wallet.balance, 90);
    let bob_wallet = get_wallet(&testkit, &bob.public_key());
    assert_eq!(bob_wallet.balance, 110);
}

#[test]
fn test_transfer_to_nonexisting_wallet(){
    let mut testkit = init_testkit();
    let alice = KeyPair::random();
    let bob = KeyPair::random();
    testkit.create_block_with_transactions(vec![
        alice.create_wallet(INSTANCE_ID, CreateWallet::new(ALICE_NAME)),
        alice.transfer(
            INSTANCE_ID,
            TxTransfer {
                amount: 10,
                seed: 0,
                to: bob.public_key(),
            },
        ),
        bob.create_wallet(INSTANCE_ID, CreateWallet::new(BOB_NAME)),
    ]);
    let alice_wallet = get_wallet(&testkit, &alice.public_key());
    assert_eq!(alice_wallet.balance, 100);
    let bob_wallet = get_wallet(&testkit, &bob.public_key());
    assert_eq!(bob_wallet.balance, 100);
}

