// Copyright 2020 The Exonum Team
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//! Cryptocurrency implementation example using [exonum](http://exonum.com/).

// Had to remove restriction on unsafe code to save float transactions
#![deny(bare_trait_objects)]
#![warn(missing_docs, missing_debug_implementations)]

#[macro_use]
extern crate serde_derive; // Required for Protobuf.

pub use crate::{schema::Schema, transactions::MachineLearningInterface};

pub mod api;
//pub mod migrations;
pub mod model;
pub mod proto;
pub mod schema;
pub mod transactions;
pub mod macros;

use exonum::runtime::{ExecutionContext, ExecutionError, InstanceId};
use exonum_derive::{ServiceDispatcher, ServiceFactory};
use exonum_rust_runtime::{api::ServiceApiBuilder, DefaultInstance, Service};

use crate::{api::PublicApi as MLApi, schema::SchemaImpl};
use backtrace::Backtrace;

/// Initial weights of the model.
pub const INIT_WEIGHT: f32 = 0.0;
/// Regularization factor
pub const LAMBDA: f64 = 4.0;
/// Minimum ratio of a majority of clients
pub const MAJORITY_RATIO: f32 = 1.0 ;
/// Maximum allowable ratio of decay from previous model
pub const MAX_SCORE_DECAY: f32 = 0.0 ;
/// Maximum allowable number of retrain rounds
pub const MAX_RETRAIN: u8 = 3;

/// Cryptocurrency service implementation.
#[derive(Debug, ServiceDispatcher, ServiceFactory)]
#[service_dispatcher(implements("MachineLearningInterface"))]
#[service_factory(artifact_name = "exonum-ML", proto_sources = "proto")]
pub struct MachineLearningService;

impl Service for MachineLearningService {
    fn initialize(
        &self,
        context: ExecutionContext<'_>,
        _params: Vec<u8>,
    ) -> Result<(), ExecutionError> {
        /*let bt = Backtrace::new();
        println!("{:?}", bt);*/

        // Initialize indexes. Not doing this may lead to errors in HTTP API, since it relies on
        // `wallets` indexes being initialized for returning corresponding proofs.
        SchemaImpl::new(context.service_data());
        Ok(())
    }

    fn wire_api(&self, builder: &mut ServiceApiBuilder) {
        MLApi::wire(builder);
    }
}

/// Use predefined instance name and id for frontend.
impl DefaultInstance for MachineLearningService {
    const INSTANCE_ID: InstanceId = 3;
    const INSTANCE_NAME: &'static str = "ml_service";
}
