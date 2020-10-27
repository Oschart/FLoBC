
use exonum::{
    crypto::Hash,
    runtime::{CallerAddress as Address, CommonError, ExecutionContext, ExecutionError},
};
use exonum_derive::{exonum_interface, interface_method, BinaryValue, ExecutionFail, ObjectHash};
use exonum_proto::ProtobufConvert;

use crate::{proto, schema::SchemaImpl, CryptocurrencyService};


/// Transfer `amount` of the currency from one wallet to another.
#[derive(Clone, Debug)]
#[#[derive(Serialize, Deserialize)]]
#[derive(ProtobufConvert, BinaryValue, ObjectHash)]
#[protobuf_convert(source = "proto::TxShareUpdates", serde_pb_convert)]
pub struct ShareUpdates {
    
    pub gradients: Vec<f32>,
    /// Auxiliary number to guarantee [non-idempotence][idempotence] of transactions.
    ///
    /// [idempotence]: https://en.wikipedia.org/wiki/Idempotence
    pub seed: u64,
}