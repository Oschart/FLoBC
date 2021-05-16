import * as exonum from 'exonum-client'
import * as proto from './proto'
import fetchPythonWeights from './utils/fetchPythonWeights';
import fetchDatasetDirectory, { fetchImposterState, fetchPortNumber } from './utils/fetchDatasetDirectory';
import fetchClientKeys from './utils/fetchClientKeys';
// import getModelLength from './utils/getModelLength';
import { fetchLatestModelTrainer, clearMetadataFile } from './utils/fetchLatestModel';
import { store_encoded_vector,  clear_encoded_vector, read_encoded_vector } from './utils/store_encoded_vector'
import generateNormalNoise from './utils/generateNormalNoise';
require("regenerator-runtime/runtime");

let intervalDuration = 15
const MODEL_NAME=process.argv[5]
const fs = require("fs");

let model_metadata = fs.readFileSync("./models/"+MODEL_NAME+"/metadata", {encoding:"utf8"});
let MODEL_LENGTH = model_metadata.substring(model_metadata.indexOf('WEIGHTS_LENGTH=') + 1).split("=")[1].split("\n")[0]
MODEL_LENGTH = parseInt(MODEL_LENGTH)

const BASE_URL = "http://127.0.0.1";
const TRANSACTIONS_SERVICE = "/api/explorer/v1/transactions";
const MODELS_CACHE = "cached_model";

let can_train = true

let TRAINER_KEY

async function trainNewModel(newModel_flag, modelWeightsPath, modelWeights, fromLocalCache){

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
    let update_gradients = await fetchPythonWeights(newModel_flag, dataset_directory, modelWeightsPath, MODEL_NAME, MODEL_LENGTH)
    
    clear_encoded_vector();
        
    if (noise_scale){
        let noise = generateNormalNoise(MODEL_LENGTH, noise_scale);
        for (let i = 0 ; i < MODEL_LENGTH ; i++) update_gradients[i] += noise[i];
    }
    
    //caching weights before adding them to a BC transaction
    let newModel = update_gradients;
    if(!newModel_flag){
        newModel = update_gradients.map((val, idx) => {
            return val + modelWeights[idx];
        });
    }
    store_encoded_vector(newModel, 'retrain');

    if(fromLocalCache){ //accumalating gradients in the case of a retrain
        let latestValidatorModel = read_encoded_vector('validator')
        update_gradients = update_gradients.map((val, idx) => {
            return val + (modelWeights[idx] - latestValidatorModel[idx]);
        });
    }
    
    const shareUpdatesPayload = {
    gradients: update_gradients,
    seed: exonum.randomUint64(),
    }

    const transaction = ShareUpdates.create(shareUpdatesPayload, TRAINER_KEY)
    const serialized = transaction.serialize()
    console.log(serialized)

    await exonum.send(explorerPath, serialized, 1000, 3000)
    .then((obj) => {console.log(obj); })
    .catch((obj) => { console.log(obj); clearMetadataFile()})
    .finally(() => { can_train = true; })
    // }
}

function timeout(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

function randomizeDuration(){
    let secs = Math.round(Math.random() * 6) ; //from 0 to 60 in a steps of 10
    intervalDuration = secs;
}

async function main(){

    await fetchClientKeys()
    .then((client_keys) => {
        TRAINER_KEY = client_keys
    });

    while(1){
        randomizeDuration();
        console.log("Will pause for " + intervalDuration + " secs")
        await timeout(intervalDuration);        

        if(!can_train){
            console.log("training is in progress")
        }
        else{
            await fetchLatestModelTrainer(TRAINER_KEY.publicKey, MODEL_LENGTH)
            .then(async fetcherResult => {
                let newModel = fetcherResult[0];
                let isLocallyCached = fetcherResult[1];
                let firstIteration = fetcherResult[2];
                if (newModel !== -1){
                    if (can_train){
                        can_train = false;
                        let newModel_path = store_encoded_vector(newModel);
                        await trainNewModel(firstIteration, newModel_path, newModel, isLocallyCached)
                    }
                }
                else{
                    console.log("No retrain quota at the moment, will retry in a bit")
                } 
            })
        }
        

        
    }
}

main()
