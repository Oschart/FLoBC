const http = require('http');

const EXPLORER_ADDR = "http://127.0.0.1:9000"
const SERVICE_DIR = "api/services/ml_service/v1"

const GET_SLACK_RATIO_URL = `${EXPLORER_ADDR}/${SERVICE_DIR}/sync/slack_ratio`

function HTTPGet(endpointURL, options = '') {
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

// Wire API returning the remaining participation
export function get_slack_ratio() {
    return new Promise((resolve, reject) => {
        HTTPGet(GET_SLACK_RATIO_URL)
            .then(res => resolve(parseFloat(res)))
            .catch(err => reject(err))
    })
}