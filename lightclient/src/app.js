import * as exonum from 'exonum-client'
import * as proto from './proto'
import fetchPythonWeights from './utils/fetchPythonWeights';
import fetchDatasetDirectory from './utils/fetchDatasetDirectory';
import fetchClientKeys from './utils/fetchClientKeys';

const explorerPath = 'http://127.0.0.1:9000/api/explorer/v1/transactions'

require("regenerator-runtime/runtime");

// Numeric identifier of the machinelearning service
const SERVICE_ID = 3

// Numeric ID of the `TxShareUpdates` transaction within the service
const SHAREUPDATES_ID = 0

let dataset_directory = fetchDatasetDirectory();
fetchClientKeys()
.then((client_keys) => {
  fetchPythonWeights(dataset_directory, (model_weights) => {
    const ShareUpdates = new exonum.Transaction({
       schema: proto.TxShareUpdates,
       serviceId: SERVICE_ID,
       methodId: SHAREUPDATES_ID,
    })

    const shareUpdatesPayload = {
      gradients: model_weights,
      seed: exonum.randomUint64(),
    }

    const transaction = ShareUpdates.create(shareUpdatesPayload, client_keys)
    const serialized = transaction.serialize()
    console.log(serialized)

    exonum.send(explorerPath, serialized)
    .then((obj) => console.log(obj))
    .catch((obj) => console.log(obj))
  });
});