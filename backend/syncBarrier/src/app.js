import * as exonum from 'exonum-client'
import * as proto from './proto'

// default period is one minute
const DEFAULT_PERIOD = 60; 

//Iteration period in seconds
let period; 
if (process.argv.length < 3){
  period = DEFAULT_PERIOD; 
}
else {
  period = parseInt(process.argv[2]);
}

const explorerPath = 'http://127.0.0.1:9000/api/explorer/v1/transactions'
require("regenerator-runtime/runtime");

// Numeric identifier of the machinelearning service
const SERVICE_ID = 3

// Numeric ID of the `TxSyncBarrier` transaction within the service
const SYNCBARRIER_ID = 1

const SyncBarrier = new exonum.Transaction({
  schema: proto.TxSyncBarrier,
  serviceId: SERVICE_ID,
  methodId: SYNCBARRIER_ID,
})

setInterval(() => {
  
  const syncBarrierPayload = {
    seed: exonum.randomUint64(),
  }

  const transaction = SyncBarrier.create(syncBarrierPayload, exonum.keyPair());
  const serialized = transaction.serialize();
  console.log(serialized)

  exonum.send(explorerPath, serialized, 10, 5000)
  .then((obj) => console.log(obj))
  .catch((obj) => console.log(obj));

}, period * 1000);