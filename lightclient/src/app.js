import * as exonum from 'exonum-client'
import * as proto from './proto'

const explorerPath = 'http://127.0.0.1:9000/api/explorer/v1/transactions'

require("regenerator-runtime/runtime");

// Numeric identifier of the machinelearning service
const SERVICE_ID = 3

// Numeric ID of the `TxShareUpdates` transaction within the service
const SHAREUPDATES_ID = 0

const ShareUpdates = new exonum.Transaction({
   schema: proto.TxShareUpdates,
   serviceId: SERVICE_ID,
   methodId: SHAREUPDATES_ID,
})

// Assume key for the owner:
const alice = exonum.keyPair()

const shareUpdatesPayload = {
  gradients: [0.4, 0.2, 0.3, 0.5, 0.6, 0.4, 0.2, 0.3, 0.5, 0.6],
  seed: exonum.randomUint64(),
}

const transaction = ShareUpdates.create(shareUpdatesPayload, alice)
const serialized = transaction.serialize()
console.log(serialized)

exonum.send(explorerPath, serialized)
.then((obj) => console.log(obj))
.catch((obj) => console.log(obj))
