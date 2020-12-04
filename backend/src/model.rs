

use exonum::{crypto::Hash, runtime::CallerAddress as Address};
use exonum_derive::{BinaryValue, ObjectHash};
use exonum_proto::ProtobufConvert;

use crate::proto;

/// Model information stored in the database.
#[derive(Clone, Debug, ProtobufConvert, BinaryValue, ObjectHash)]
#[protobuf_convert(source = "proto::Model", serde_pb_convert)]
pub struct Model {
    /// Model version
    pub version: u32,
    /// Model size
    pub size: u32,
    /// Model weights
    pub weights: Vec<f32>,
    /// Model test accuracy
    pub score: f32,
    /// Minimum target score (used to validate updates)
    pub min_score: f32,
}

impl Model {
    /// Creates a new model.
    pub fn new(
        version: u32,
        size: u32,
        weights: Vec<f32>,
        score: f32,
        min_score: f32,
    ) -> Self {
        Self {
            version,
            size,
            weights,
            score,
            min_score,
        }
    }

    /// Aggregate model updates
    pub fn aggregate(&mut self, gradients: &Vec<f32>, w: f32) {
        for i in 0..self.size as usize {
            self.weights[i] += w*gradients[i];
        }
    }

}
