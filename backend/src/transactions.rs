use exonum::{
    crypto::Hash,
    runtime::{CallerAddress as Address, CommonError, ExecutionContext, ExecutionError},
};
use exonum_derive::{exonum_interface, interface_method, BinaryValue, ExecutionFail, ObjectHash};
use exonum_proto::ProtobufConvert;

use crate::{proto, schema::SchemaImpl, MachineLearningService};

use exonum_node::VALIDATOR_ID;
use std::fs;

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
    fn shareUpdates(&self, ctx: Ctx, arg: ShareUpdates) -> Self::Output;
}

impl MachineLearningInterface<ExecutionContext<'_>> for MachineLearningService {
    type Output = Result<(), ExecutionError>;

    fn shareUpdates(&self, context: ExecutionContext<'_>, arg: ShareUpdates) -> Self::Output {
        let (from, tx_hash) = extract_info(&context)?;
        let mut schema = SchemaImpl::new(context.service_data());

        schema.register_trainer(&from);

        // Checking if a majority has been achieved
        let ready = schema.check_pending(&from, &arg.gradients);
        if ready {
            // Update trainer scores
            schema.update_scores();
            //Updating the most recent model using schema
            schema.update_weights();
            // Remove the scores file when you're done
            clear_scores_file();
        }
        Ok(())
    }
}

fn clear_scores_file() {
    let val_id: u16;
    unsafe {
        val_id = VALIDATOR_ID.load(Ordering::SeqCst);
    }
    let score_filename: String = format!("v{}_scores.txt", val_id);
    fs::remove_file(&score_filename).expect("Unable to delete scores file");
}

fn extract_info(context: &ExecutionContext<'_>) -> Result<(Address, Hash), ExecutionError> {
    let tx_hash = context
        .transaction_hash()
        .ok_or(CommonError::UnauthorizedCaller)?;
    let from = context.caller().address();
    Ok((from, tx_hash))
}
