const http = require('http');
const latest_model_index = `http://127.0.0.1:9000/api/services/ml_service/v1/models/latestmodel`;
const model_score = `http://127.0.0.1:9000/api/services/ml_service/v1/models/getmodelaccuracy`;
const trainer_status = `http://127.0.0.1:9000/api/services/ml_service/v1/trainer/trainer_status`;
const score_score = `http://127.0.0.1:9000/api/services/ml_service/v1/models/trainersscores`;


async function HTTPGet(endpointURL, options = ''){
    let getURL = endpointURL + options;
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

async function getScoreByIndex(index){
    let option = '?version=' + index;
    return await new Promise((resolve, reject) => {
        HTTPGet(model_score, option)
        .then(res => resolve(JSON.parse(res)))
        .catch(err => reject(err))
    })
}

export async function retrieveStatusInfo(){
    let currentModel = null;
    let currentModelScore = 0;
    currentModel = await getLatestModelIndex();
    if(currentModel >= 0)currentModelScore = await getScoreByIndex(currentModel);
    return [currentModel, currentModelScore]
}