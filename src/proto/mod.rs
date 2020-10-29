// For protobuf generated files.
#![allow(bare_trait_objects)]

pub use self::service::{Model, TxShareUpdates};

include!(concat!(env!("OUT_DIR"), "/protobuf_mod.rs"));

use exonum::crypto::proto::*;
