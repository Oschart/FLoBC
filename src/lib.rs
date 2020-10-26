// use exonum::crypto::PublicKey;
// use exonum::merkledb::{
//     access::{Access, FromAccess},
//     MapIndex,
// };
// use exonum::runtime::{ExecutionContext, ExecutionError};
// use exonum_derive::*;
// use exonum_proto::ProtobufConvert;
// use exonum_rust_runtime::{ DefaultInstance, Service};

#[macro_use]
extern crate serde_derive; // Required for Protobuf.
// use serde_derive::{Deserialize, Serialize};

// Starting balance of a newly created Model
#[cfg(test)]
mod tx_tests;
pub mod proto;

pub mod schema {
    use exonum::{
        crypto::PublicKey,
        merkledb::{
            access::{Access, FromAccess},
            MapIndex,
        },
    };
    use exonum::{crypto::Hash, runtime::CallerAddress as Address};
    use exonum_derive::{BinaryValue, FromAccess, ObjectHash};
    use exonum_proto::ProtobufConvert;

    use crate::proto;

    #[derive(Serialize, Deserialize, Clone, Debug)]
    #[derive(ProtobufConvert, BinaryValue, ObjectHash)]
    #[protobuf_convert(source = "proto::Model")]
    pub struct Model {
        pub version: u32,
        pub model_size: u32,
        pub weights: Vec<f32>,
        pub history_len: u64,
        pub history_hash: Hash,
    }

    impl Model {
        pub fn new(version: &u32, model_size: u32, weights: Vec<f32>, history_len: u64, history_hash: Hash) -> Self {
            Self {
                version: version.to_owned(),
                model_size,
                weights,
                history_len,
                history_hash,
            }
        }


        pub fn aggregate(self, gradients: &Vec<f32>) {
            for i in 0..self.model_size as usize {
                self.weights[i] += gradients[i];
            }
        }
    }

    #[derive(Debug, FromAccess)]
    pub struct CurrencySchema<T: Access> {
        /// Correspondence of public keys of users to the account information.
        pub models: MapIndex<T::Base, PublicKey, Model>,
    }

    impl<T: Access> CurrencySchema<T> {
        pub fn new(access: T) -> Self {
            Self::from_root(access).unwrap()
        }
    }
}

pub mod transactions {
    use exonum::crypto::PublicKey;
    use exonum_derive::{BinaryValue};
    use exonum_proto::ProtobufConvert;

    use super::proto;

    #[derive(Serialize, Deserialize, Clone, Debug, ProtobufConvert, BinaryValue)]
    #[protobuf_convert(source = "proto::TxCreateModel")]
    pub struct CreateModel {
        /// UTF-8 string with the owner's name.
        pub name: String,
    }

    impl CreateModel {
        /// Creates a Model with the specified name.
        pub fn new(name: impl Into<String>) -> Self {
            Self { name: name.into() }
        }
    }

    #[derive(Serialize, Deserialize, Clone, Debug, ProtobufConvert, BinaryValue)]
    #[protobuf_convert(source = "proto::TxUpdateModel")]
    pub struct TxUpdateModel {
        pub to: PublicKey,
        pub gradients: Vec<f32>,
        pub seed: u64,
    }
}

pub mod errors {
    use exonum_derive::ExecutionFail;
    /// Error codes emitted by `TxCreateModel` and/or `TxUpdateModel`
    /// transactions during execution.
    #[derive(Debug, ExecutionFail)]
    pub enum Error {
        /// Model already exists.
        ModelAlreadyExists = 0,
        /// Sender doesn't exist.
        SenderNotFound = 1,
        /// Receiver doesn't exist.
        ReceiverNotFound = 2,
        /// Insufficient currency amount.
        InsufficientCurrencyAmount = 3,
        /// Sender same as receiver.
        SenderSameAsReceiver = 4,
    }
}

pub mod contracts {
    use exonum::runtime::{ExecutionContext, ExecutionError};
    use exonum_derive::{exonum_interface, interface_method, ServiceDispatcher, ServiceFactory};
    use exonum_rust_runtime::{api::ServiceApiBuilder, DefaultInstance, Service};

    use crate::{
        api::CryptocurrencyApi,
        errors::Error,
        schema::{CurrencySchema, Model},
        transactions::{CreateModel, TxUpdateModel},
    };

    const INIT_BALANCE: u64 = 100;

    impl DefaultInstance for CryptocurrencyService {
        const INSTANCE_ID: u32 = 101;
        const INSTANCE_NAME: &'static str = "cryptocurrency";
    }


    /// Cryptocurrency service transactions.
    #[exonum_interface]
    pub trait CryptocurrencyInterface<Ctx> {
        /// Output of the methods in this interface.
        type Output;

        /// Creates Model with the given `name`.
        #[interface_method(id = 0)]
        fn create_model(&self, ctx: Ctx, arg: CreateModel) -> Self::Output;
        /// Transfers `amount` of the currency from one Model to another.
        #[interface_method(id = 1)]
        fn update(&self, ctx: Ctx, arg: TxUpdateModel) -> Self::Output;
    }

    /// Cryptocurrency service implementation.
    #[derive(Debug, ServiceFactory, ServiceDispatcher)]
    #[service_dispatcher(implements("CryptocurrencyInterface"))]
    #[service_factory(proto_sources = "crate::proto")]
    pub struct CryptocurrencyService;

    impl Service for CryptocurrencyService {
        fn wire_api(&self, builder: &mut ServiceApiBuilder) {
            CryptocurrencyApi::wire(builder);
        }
    }

    impl CryptocurrencyInterface<ExecutionContext<'_>> for CryptocurrencyService {
        type Output = Result<(), ExecutionError>;

        fn create_model(
            &self,
            context: ExecutionContext<'_>,
            arg: CreateModel,
        ) -> Self::Output {
            let author = context
                .caller()
                .author()
                .expect("Wrong 'TxCreateModel' initiator");

            let mut schema = CurrencySchema::new(context.service_data());
            if schema.models.get(&author).is_none() {
                let model = Model::new(&arg.version, &arg.model_size, &arg.weights, 0, );
                println!("Created Model: {:?}", model);
                schema.models.put(&author, model);
                Ok(())
            } else {
                Err(Error::ModelAlreadyExists.into())
            }
        }  

        fn update(
            &self,
            context: ExecutionContext<'_>,
            arg: TxUpdateModel,
        ) -> Self::Output {
            let author = context
                .caller()
                .author()
                .expect("Wrong 'TxUpdateModel' initiator");
            if author == arg.to {
                return Err(Error::SenderSameAsReceiver.into());
            }

            let mut schema = CurrencySchema::new(context.service_data());
            let sender = schema.models.get(&author).ok_or(Error::SenderNotFound)?;
            let receiver = schema
                .models
                .get(&arg.to)
                .ok_or(Error::ReceiverNotFound)?;

            
            let sender = sender.decrease(amount);
            let receiver = receiver.increase(amount);
            println!("Transfer between models: {:?} => {:?}", sender, receiver);
            schema.models.put(&author, sender);
            schema.models.put(&arg.to, receiver);
            Ok(())
            
    }
}


pub mod api {
    use exonum::crypto::PublicKey;
    use exonum_rust_runtime::api::{self, ServiceApiBuilder, ServiceApiState};

    use crate::schema::{CurrencySchema, Model};


    #[derive(Debug, Clone, Copy)]
    pub struct CryptocurrencyApi;

    /// The structure describes the query parameters for the `get_wallet` endpoint.
    #[derive(Debug, Serialize, Deserialize, Clone, Copy)]
    pub struct WalletQuery {
        /// Public key of the requested Model.
        pub pub_key: PublicKey,
    }

    impl CryptocurrencyApi {
        /// Endpoint for getting a single Model.

        // This function caused an error when doing a read request from the REST API (expecting a string, returned a map)
        // pub async fn get_wallet(
        //     state: ServiceApiState,
        //     pub_key: PublicKey,
        // ) -> api::Result<Model> {
        //     let schema = CurrencySchema::new(state.service_data());
        //     schema
        //         .models
        //         .get(&pub_key)
        //         .ok_or_else(|| api::Error::not_found().title("Model not found"))
        // }

        // Taken from the tutorial on GH
        pub async fn get_wallet(state: ServiceApiState, query: WalletQuery) -> api::Result<Model> {
            let schema = CurrencySchema::new(state.service_data());
            schema
                .models 
                .get(&query.pub_key)
                .ok_or_else(|| api::Error::not_found().title("Model not found"))
        }

        /// Endpoint for dumping all models from the storage.
        pub async fn get_wallets(
            state: ServiceApiState,
            _query: (),
        ) -> api::Result<Vec<Model>> {
            let schema = CurrencySchema::new(state.service_data());
            Ok(schema.models.values().collect())
        }

        /// `ServiceApiBuilder` facilitates conversion between read requests
        /// and REST endpoints.
        pub fn wire(builder: &mut ServiceApiBuilder) {
            // Binds handlers to specific routes.
            builder
                .public_scope()
                .endpoint("v1/Model", Self::get_wallet)
                .endpoint("v1/models", Self::get_wallets);
        }
    }
}
