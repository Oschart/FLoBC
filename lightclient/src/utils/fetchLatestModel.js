const http = require('http');
const fs = require('fs');

const METADATA_FILE_NAME = 'ModelMetadata';
const WEIGHTS_LENGTH = 4010;
import {fetchPortNumber} from './fetchDatasetDirectory';

const latest_model_index_fmt = (isVal=false) => {
    let port_number = fetchPortNumber(isVal);
    return `http://127.0.0.1:${port_number}/api/services/ml_service/v1/models/latestmodel`
}
const get_model_by_index_fmt = (isVal=false) => {
    let port_number = fetchPortNumber(isVal);
    return `http://127.0.0.1:${port_number}/api/services/ml_service/v1/models/getmodel`
}

function HTTPGet(endpointURL, options = ''){
    let getURL = endpointURL + options;
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
        .catch(err => reject(err))
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

export function fetchLatestModelTrainer(){
    return new Promise((resolve, reject) => {
        getLatestModelIndex()   //retrieve the index of the latest model from the BC
        .then(latestIndex => {
            readMetadataFile() 
            .then(fileContent => {
                if(latestIndex > fileContent){          //if there is a new model (relative to the latest model this LC trained on )
                    if([0, -1].includes(latestIndex)){  //new model 
                        let zerosArr = new Array(WEIGHTS_LENGTH).fill(0);
                        writeToMetadataFile(0)          //update metadata file to indicate working on an empty model 
                        .then(() => {
                            resolve(zerosArr);
                        })
                        .catch(err => reject(err))
                    }
                    else{
                        getModelByIndex(latestIndex)    //fetch latest model weights
                        .then(latestModelWeights => {
                            writeToMetadataFile(latestIndex)    //update metadata file
                            .then(() => {
                                resolve(latestModelWeights)
                            })
                            .catch(err => reject(err))
                            
                        })
                    }
                }
                else resolve(-1); //the LC doesn't need to train (already trained this model)
            })
        })
        .catch(err => reject(err))
    })
}

export function fetchLatestModelValidator(){
    return new Promise((resolve, reject) => {
        getLatestModelIndex(true)   //retrieve the index of the latest model from the BC
        .then(latestIndex => {
            if([0, -1].includes(latestIndex)){  //new model 
                // let zerosArr = new Array(WEIGHTS_LENGTH).fill(0);
                // resolve(zerosArr);
                resolve(0);
            }
            else{
                getModelByIndex(latestIndex, true)    //fetch latest model weights
                .then(latestModelWeights => {
                    resolve(latestModelWeights)
                })
                .catch(err => reject(err))
            }
        })
        .catch(err => reject(err))
    })
}

export function fetchMinScore(){
    return new Promise((resolve, reject) => {
        getLatestModelIndex(true)   //retrieve the index of the latest model from the BC
        .then(latestIndex => {
            if([0, -1].includes(latestIndex)){  //new model 
                let min_score = 0.5;
                resolve(min_score);
            }
            else{
                getMinScoreByIndex(latestIndex)    //fetch latest model weights
                .then(latestMinScore => {
                    resolve(latestMinScore)
                })
                .catch(err => reject(err))
            }
        })
        .catch(err => reject(err))
    })
}