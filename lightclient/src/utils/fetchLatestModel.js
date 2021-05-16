const http = require('http');
const fs = require('fs');

const METADATA_FILE_NAME = 'ModelMetadata';
// const WEIGHTS_LENGTH = 4010;
const MODELS_CACHE = "cached_model";
import {fetchPortNumber} from './fetchDatasetDirectory';
import { store_encoded_vector, read_encoded_vector } from './store_encoded_vector';

const latest_model_index_fmt = () => {
    let port_number = fetchPortNumber();
    return `http://127.0.0.1:${port_number}/api/services/ml_service/v1/models/latestmodel`
}
const get_model_by_index_fmt = () => {
    let port_number = fetchPortNumber();
    return `http://127.0.0.1:${port_number}/api/services/ml_service/v1/models/getmodel`
}
const get_retrain_quote_fmt = () => {
    let port_number = fetchPortNumber();
    return `http://127.0.0.1:${port_number}/api/services/ml_service/v1/trainer/retrain_quota`
}

function HTTPGet(endpointURL, options = ''){
    let getURL = endpointURL + options;
    console.log(getURL)
    return new Promise((resolve, reject) => {
        let request = http.get(getURL, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                resolve(data);
            });
        })
        request.on("error", (err) => {
            reject("Error: " + err.message);
        })
    });
}

function readMetadataFile(){
    return new Promise((resolve, reject) => {
        let metaDataFileExists = fs.existsSync(METADATA_FILE_NAME);
        if(metaDataFileExists){
            fs.readFile(METADATA_FILE_NAME, 'utf8', (err, data) => {
                if(err) reject(err);
                let index = parseInt(data)
                resolve(index)
            });
        }
        else resolve(-2) //for file doesn't exist
    })
}

export function clearMetadataFile(){
    let metaDataFileExists = fs.existsSync(METADATA_FILE_NAME);
    if(metaDataFileExists){
        fs.unlink(METADATA_FILE_NAME, ()=>{});
    }
}

function writeToMetadataFile(index){
    return new Promise((resolve, reject) => {
        index = index.toString();
        fs.writeFile(METADATA_FILE_NAME, index, err => {
            if (err) reject(err);
            resolve()
        });
    })
}

function getLatestModelIndex(isVal=false){
    return new Promise((resolve, reject) => {
        HTTPGet(latest_model_index_fmt(isVal))
        .then(res => resolve(parseInt(res)))
        .catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

function getModelByIndex(index, isVal = false){
    let option = '?version=' + index;
    return new Promise((resolve, reject) => {
        HTTPGet(get_model_by_index_fmt(isVal), option)
        .then(res => resolve(JSON.parse(res).weights))
        .catch(err => reject(err))
    })
}

function getMinScoreByIndex(index){
    let option = '?version=' + index;
    return new Promise((resolve, reject) => {
        HTTPGet(get_model_by_index_fmt(true), option)
        .then(res => resolve(JSON.parse(res).min_score))
        .catch(err => reject(err))
    })
}

function getRetrainQuote(trainerKey){
    let option = '?trainer_addr=' + trainerKey;
    return new Promise((resolve, reject) => {
        HTTPGet(get_retrain_quote_fmt(), option)
        .then(res => {
            resolve(parseInt(res));
        })
        .catch(err => reject(err))
    })
}

export async function fetchLatestModelTrainer(trainerKey, WEIGHTS_LENGTH){
    return new Promise((resolve, reject) => {
        getLatestModelIndex()   //retrieve the index of the latest model from the BC
        .then(latestIndex => {
            readMetadataFile() 
            .then(fileContent => {
                if(latestIndex > fileContent){          //if there is a new model (relative to the latest model this LC trained on )
                    console.log("New model released by the validator!, #" + latestIndex)
                    if([0, -1].includes(latestIndex)){  //new model 
                        let randArr = new Array(WEIGHTS_LENGTH).fill(0);
                        randArr = randArr.map(val => {
                            return Math.random() * 0.2 - 0.1;
                        });
                        store_encoded_vector(randArr, 'validator');
                        writeToMetadataFile(0)          //update metadata file to indicate working on an empty model 
                        .then(() => {
                            resolve([randArr, 0, 1]);
                        })
                        .catch(err => reject(err))
                    }
                    else{
                        getModelByIndex(latestIndex)    //fetch latest model weights
                        .then(latestModelWeights => {
                            store_encoded_vector(latestModelWeights, 'validator');
                            writeToMetadataFile(latestIndex)    //update metadata file
                            .then(() => {
                                resolve([latestModelWeights, 0, 0])
                            })
                            .catch(err => reject(err))
                            
                        })
                    }
                }
                else {
                    getRetrainQuote(trainerKey)
                    .then(retrainQuota => {
                        if(retrainQuota > 0){
                            console.log("Will retrain on the locally cached model")
                            let cachedModel = read_encoded_vector('retrain');
                            let firstIteration = (latestIndex <= 0);
                            resolve([cachedModel, 1, firstIteration])
                        }
                        else resolve([-1, 0, 0]); //the LC doesn't need to train (already trained this model)
                    })
                    
                }
            })
        })
        .catch(err => reject(err))
    })
}
