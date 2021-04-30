import * as exonum from 'exonum-client'
import * as proto from './proto'
import { get_slack_ratio } from './utils'

require("regenerator-runtime/runtime");

// default period is one minute
const DEFAULT_PERIOD = 60;

//Iteration period in seconds
let base_period;
if (process.argv.length < 3) {
  base_period = DEFAULT_PERIOD;
}
else {
  base_period = parseInt(process.argv[2]);
}

const explorerPath = 'http://127.0.0.1:9000/api/explorer/v1/transactions'

// Numeric identifier of the machinelearning service
const SERVICE_ID = 3

// Numeric ID of the `TxSyncBarrier` transaction within the service
const SYNCBARRIER_ID = 1

const SyncBarrier = new exonum.Transaction({
  schema: proto.TxSyncBarrier,
  serviceId: SERVICE_ID,
  methodId: SYNCBARRIER_ID,
})

function sleep(time) { return new Promise(res => setTimeout(res, time * 1000)); }

let current_period;
async function main() {

  await sleep(base_period);
  while (true) {
    const syncBarrierPayload = {
      seed: exonum.randomUint64(),
    }

    const transaction = SyncBarrier.create(syncBarrierPayload, exonum.keyPair());
    const serialized = transaction.serialize();
    console.log(serialized)

    exonum.send(explorerPath, serialized, 1000, 3000)
    .then((obj) => console.log(obj))
    .catch((obj) => console.log(obj))

    let extension_ratio = await get_slack_ratio().catch((err) => console.log(err));

    console.log(`extension_ratio = ${extension_ratio}`);
    if (extension_ratio > 0.0) {
      current_period = Math.round(base_period * extension_ratio);
    } else {
      current_period = base_period;
    }
    await sleep(current_period);
  }
}

main();