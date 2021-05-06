const http = require('http');
const validator_addr = `http://127.0.0.1:9000/api/services/ml_service/v1/`;
const latest_model_index = `models/latestmodel`;
const model_score = `models/getmodelaccuracy`;
const all_triners_status = `trainer/all_trainers_status`;


async function HTTPGet(endpointURL, options = ''){
    let getURL = validator_addr + endpointURL + options;
    return await new Promise((resolve, reject) => {
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

async function getLatestModelIndex(){
    return await new Promise((resolve, reject) => {
        HTTPGet(latest_model_index)
        .then(res => resolve(parseInt(res)))
        .catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

export async function getScoreByIndex(index){
    let option = '?version=' + index;
    return await new Promise((resolve, reject) => {
        HTTPGet(model_score, option)
        .then(res => resolve(JSON.parse(res)))
        .catch(err => reject(err))
    })
}

async function getAllTrainersStatus(){
    return await new Promise((resolve, reject) => {
        HTTPGet(all_triners_status)
        .then(res => resolve(JSON.parse(res)))
        .catch(err => reject(err))
    })
}

export async function retrieveStatusInfo(){
    let currentModel = null;
    let currentModelScore = 0;
    let trainersMap = null;
    currentModel = await getLatestModelIndex();
    if(currentModel >= 0)currentModelScore = await getScoreByIndex(currentModel);
    trainersMap = await getAllTrainersStatus();
    return [currentModel, currentModelScore, trainersMap]
}