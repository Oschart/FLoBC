#![allow(bare_trait_objects)]

pub use self::service::*;

include!(concat!(env!("OUT_DIR"), "/protobuf_mod.rs"));
use exonum::crypto::proto::*;