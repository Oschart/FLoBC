const http = require('http');

function fetchPortNumber(){
    return 9000+parseInt(process.argv[4].trim());
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

const latest_model_index_fmt = () => {
    let port_number = fetchPortNumber();
    return `http://127.0.0.1:${port_number}/api/services/ml_service/v1/models/latestmodel`
}
const get_model_by_index_fmt = () => {
    let port_number = fetchPortNumber();
    return `http://127.0.0.1:${port_number}/api/services/ml_service/v1/models/getmodel`
}

function getLatestModelIndex(){
    return new Promise((resolve, reject) => {
        HTTPGet(latest_model_index_fmt())
        .then(res => resolve(parseInt(res)))
        .catch(err => reject(err))
    })
}

function getModelByIndex(index){
    let option = '?version=' + index;
    return new Promise((resolve, reject) => {
        HTTPGet(get_model_by_index_fmt(), option)
        .then(res => resolve(JSON.parse(res).weights))
        .catch(err => reject(err))
    })
}

function getMinScoreByIndex(index){
    let option = '?version=' + index;
    return new Promise((resolve, reject) => {
        HTTPGet(get_model_by_index_fmt(), option)
        .then(res => resolve(JSON.parse(res).min_score))
        .catch(err => reject(err))
    })
}

export function fetchLatestModel(){
    return new Promise((resolve, reject) => {
        getLatestModelIndex()   //retrieve the index of the latest model from the BC
        .then(latestIndex => {
            if([0, -1].includes(latestIndex)){  //new model 
                // let zerosArr = new Array(WEIGHTS_LENGTH).fill(0);
                // resolve(zerosArr);
                resolve(0);
            }
            else{
                getModelByIndex(latestIndex)    //fetch latest model weights
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
        getLatestModelIndex()   //retrieve the index of the latest model from the BC
        .then(latestIndex => {
            if([0, -1].includes(latestIndex)){  //new model 
                let min_score = 0;
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