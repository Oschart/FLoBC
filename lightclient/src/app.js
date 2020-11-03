import * as exonum from 'exonum-client'
import * as proto from './proto'

const explorerPath = 'http://127.0.0.1:9000/api/explorer/v1/transactions'

require("regenerator-runtime/runtime");

// Numeric identifier of the machinelearning service
const SERVICE_ID = 3

// Numeric ID of the `TxShareUpdates` transaction within the service
const SHAREUPDATES_ID = 0

//Default weights to be sent in a transaction
const DEFAULT_WEIGHTS =  [0.4, 0.2, 0.3, 0.5, 0.6, 0.4, 0.2, 0.3, 0.5, 0.6];

//Default weights length
const WEIGHTS_LENGTH = 10;

// Parsing CLI weights
let model_weights;
if (process.argv.length < 3){
    model_weights = DEFAULT_WEIGHTS;
}
else {
    let in_arr = process.argv[2].trim()
    if (in_arr[0] != '[' || in_arr[in_arr.length-1] != ']') {
        console.log("Syntax Error: Check the array syntax and use square brackets");
        process.exit();
    }
    let weights = in_arr.slice(1, in_arr.length - 1).split(',')
    if (weights.length != WEIGHTS_LENGTH){
        console.log("We only support weights of length ", WEIGHTS_LENGTH);
        process.exit();
    }
    for (let i = 0 ; i < WEIGHTS_LENGTH ; i++){
        if (isNaN(weights[i])){
            console.log("Error: ", weights[i], " is not a number");
            process.exit();
        }
        weights[i] = parseFloat(weights[i]);
    }
    model_weights = weights;
}

const ShareUpdates = new exonum.Transaction({
   schema: proto.TxShareUpdates,
   serviceId: SERVICE_ID,
   methodId: SHAREUPDATES_ID,
})

// Assume key for the owner:
const alice = exonum.keyPair()

const shareUpdatesPayload = {
  gradients: model_weights,
  seed: exonum.randomUint64(),
}

const transaction = ShareUpdates.create(shareUpdatesPayload, alice)
const serialized = transaction.serialize()
console.log(serialized)

exonum.send(explorerPath, serialized)
.then((obj) => console.log(obj))
.catch((obj) => console.log(obj))
