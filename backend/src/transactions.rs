use exonum::{
    crypto::Hash,
    runtime::{CallerAddress as Address, CommonError, ExecutionContext, ExecutionError},
};
use exonum_derive::{exonum_interface, interface_method, BinaryValue, ExecutionFail, ObjectHash};
use exonum_proto::ProtobufConvert;

use crate::{proto, schema::SchemaImpl, MachineLearningService};

/// Synchronization policy:
/// 0 -> BSP
/// 1 -> SSP
use exonum_node::SYNC_POLICY;
use exonum_node::VALIDATOR_ID;
use std::fs;

use crate::get_static;
use crate::MAJORITY_RATIO;
use std::{path, sync::atomic::Ordering};

/// Transfer `amount` of the currency from one wallet to another.
#[derive(Clone, Debug, ProtobufConvert, BinaryValue, ObjectHash)]
#[protobuf_convert(source = "proto::TxShareUpdates", serde_pb_convert)]
pub struct ShareUpdates {
    /// gradients to update the model with
    pub gradients: Vec<f32>,
    /// Auxiliary number to guarantee [non-idempotence][idempotence] of transactions.
    ///
    /// [idempotence]: https://en.wikipedia.org/wiki/Idempotence
    pub seed: u64,
}

/// Signal a synchronization barrier
#[derive(Clone, Debug, ProtobufConvert, BinaryValue, ObjectHash)]
#[protobuf_convert(source = "proto::TxSyncBarrier", serde_pb_convert)]
pub struct SyncBarrier {
    /// Auxiliary number to guarantee [non-idempotence][idempotence] of transactions.
    ///
    /// [idempotence]: https://en.wikipedia.org/wiki/Idempotence
    pub seed: u64,
}

/// Error codes emitted by model transactions during execution.
#[derive(Debug, ExecutionFail)]
pub enum Error {
    /// Model fails passing score
    BadModel = 0,
}

/// Cryptocurrency service transactions.
#[exonum_interface]
pub trait MachineLearningInterface<Ctx> {
    /// Output returned by the interface methods.
    type Output;

    /// Proposes a model update
    #[interface_method(id = 0)]
    fn share_updates(&self, ctx: Ctx, arg: ShareUpdates) -> Self::Output;

    /// Signal a sync barrier
    #[interface_method(id = 1)]
    fn sync_barrier(&self, ctx: Ctx, arg: SyncBarrier) -> Self::Output;
}

impl MachineLearningInterface<ExecutionContext<'_>> for MachineLearningService {
    type Output = Result<(), ExecutionError>;

    fn share_updates(&self, context: ExecutionContext<'_>, arg: ShareUpdates) -> Self::Output {
        let (from, tx_hash) = extract_info(&context)?;
        let mut schema = SchemaImpl::new(context.service_data());

        schema.register_trainer(&from);
        schema.cache_update(&from, &arg.gradients);


        let sp: u16 = get_static!(SYNC_POLICY);
        if sp == 2 {
            // BAP
            let work_ratio = 1.0 - schema.get_slack_ratio();
            if work_ratio >= MAJORITY_RATIO {
                schema.initiate_release();
            } 
        }

        Ok(())
    }

    fn sync_barrier(&self, context: ExecutionContext<'_>, arg: SyncBarrier) -> Self::Output {
        let sp: u16 = get_static!(SYNC_POLICY);
        println!("Sync Barrier signal received! Policy = {}", sp);
        let mut schema = SchemaImpl::new(context.service_data());

        if sp == 0 {
            // BSP
            // STRICT DEADLINE //
            schema.initiate_release();
        } else if sp == 1 {
            // SSP
            // RELAXED DEADLINE //
            let slack_ratio = schema.get_slack_ratio();
            let deadline_status = schema.get_deadline_status();
            match deadline_status {
                0 => {
                    if slack_ratio > 0.0 {
                        schema.set_deadline_status(1);
                    } else {
                        schema.initiate_release();
                    }
                }
                1 => {
                    schema.initiate_release();
                    schema.set_deadline_status(0);
                }
                _ => {
                    println!("Invalid deadline status!");
                    schema.set_deadline_status(0);
                }
            }
        }

        Ok(())
    }
}

fn extract_info(context: &ExecutionContext<'_>) -> Result<(Address, Hash), ExecutionError> {
    let tx_hash = context
        .transaction_hash()
        .ok_or(CommonError::UnauthorizedCaller)?;
    let from = context.caller().address();
    Ok((from, tx_hash))
}
