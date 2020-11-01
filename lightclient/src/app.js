import * as exonum from 'exonum-client'
import * as proto from './proto'

const explorerPath = 'http://127.0.0.1:8200/api/explorer/v1/transactions'

require("regenerator-runtime/runtime");

// Numeric identifier of the cryptocurrency service
const SERVICE_ID = 3

// Numeric ID of the `CreateWallet` transaction within the service
const CREATE_ID = 2

const CreateWallet = new exonum.Transaction({
   schema: proto.exonum.examples.cryptocurrency_advanced.CreateWallet,
   serviceId: SERVICE_ID,
   methodId: CREATE_ID,
})

// Assume key for the owner:
const alice = exonum.keyPair()

const createPayload = {
  name: "Fadi",
}

const transaction = CreateWallet.create(createPayload, alice)
const serialized = transaction.serialize()
console.log(serialized)

exonum.send(explorerPath, serialized)
.then((obj) => console.log(obj))
.catch((obj) => console.log(obj))
