

use exonum::{crypto::Hash, runtime::CallerAddress as Address};
use exonum_derive::{BinaryValue, ObjectHash};
use exonum_proto::ProtobufConvert;

use crate::proto;

/// Model information stored in the database.
#[derive(Clone, Debug, ProtobufConvert, BinaryValue, ObjectHash)]
#[protobuf_convert(source = "proto::Model", serde_pb_convert)]
pub struct Model {
    pub version: u32,
    pub size: u32,
    pub weights: Vec<f32>,
}

impl Model {
    /// Creates a new model.
    pub fn new<Clone>(
        version: u32,
        size: u32,
        weights: &Vec<f32>,
    ) -> Self {
        Self {
            version,
            size,
            weights,
        }
    } 

    pub fn aggregate(self, gradients: Vec<f32>) {
        for i in 0..self.size as usize {
            self.weights[i] += gradients[i]
        }
    }

}
