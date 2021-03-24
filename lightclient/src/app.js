import * as exonum from 'exonum-client'
import * as proto from './proto'
import fetchPythonWeights from './utils/fetchPythonWeights';
import fetchDatasetDirectory, { fetchImposterState, fetchPortNumber } from './utils/fetchDatasetDirectory';
import fetchClientKeys from './utils/fetchClientKeys';
import { fetchLatestModelTrainer, clearMetadataFile } from './utils/fetchLatestModel';
import store_encoded_vector, { clear_encoded_vector } from './utils/store_encoded_vector'
import generateNormalNoise from './utils/generateNormalNoise';

const INTERVAL_DURATION = 5000

const MODEL_LENGTH = 4010

const BASE_URL = "http://127.0.0.1";
const TRANSACTIONS_SERVICE = "/api/explorer/v1/transactions";

let can_train = true

let TRAINER_KEY

fetchClientKeys()
.then((client_keys) => {
  TRAINER_KEY = client_keys
});

let sr = require('seedrandom');
let noise_scale = fetchImposterState();
sr(noise_scale, { global: true });

function trainNewModel(newModel_flag, modelWeights){
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

    let port_number = fetchPortNumber();
    let explorerPath = BASE_URL + ":" + port_number + TRANSACTIONS_SERVICE;

    let dataset_directory = fetchDatasetDirectory();
    let noise_scale = fetchImposterState();
    // if (is_imposter){
    //     clear_encoded_vector();
    //     // Generating random uniformly distributed vector with values 9000 - 11000
    //     const shareUpdatesPayload = {
    //         gradients: Array.from({length: MODEL_LENGTH}, () => 5000 + Math.floor(Math.random() * 10000)),
    //         seed: exonum.randomUint64(),
    //     }
    
    //     const transaction = ShareUpdates.create(shareUpdatesPayload, TRAINER_KEY)
    //     const serialized = transaction.serialize()
    //     console.log(serialized)

    //     exonum.send(explorerPath, serialized, 10, 5000)
    //     .then((obj) => console.log(obj))
    //     .catch((obj) => console.log(obj))

    // } else {
    fetchPythonWeights(newModel_flag, dataset_directory, modelWeights, (model_weights) => {
        clear_encoded_vector();
        
        if (noise_scale){
            let noise = generateNormalNoise(MODEL_LENGTH, noise_scale);
            for (let i = 0 ; i < MODEL_LENGTH ; i++) model_weights[i] += noise[i];
        }
        
        const shareUpdatesPayload = {
        gradients: model_weights,
        seed: exonum.randomUint64(),
        }

        const transaction = ShareUpdates.create(shareUpdatesPayload, TRAINER_KEY)
        const serialized = transaction.serialize()
        console.log(serialized)

        exonum.send(explorerPath, serialized, 10, 5000)
        .then((obj) => console.log(obj))
        .catch((obj) => { console.log(obj); clearMetadataFile()})
        .finally(() => { can_train = true; })
    });
    // }
}

setInterval(() => {
    fetchLatestModelTrainer()
    .then(newModel => {
        if (newModel == 0){
            console.log("First model version");
            trainNewModel(true, "");
        }
        else if(newModel !== -1){
            setTimeout(() => {
                console.log("New model fetched")
                if (can_train){
                    can_train = false;
                    store_encoded_vector(newModel).then((newModel_path) => {
                        trainNewModel(false, newModel_path)
                    });
                }
            }, INTERVAL_DURATION)
        }
        else console.log("No New model to fetch, will retry in a bit")
    })
}, INTERVAL_DURATION)

