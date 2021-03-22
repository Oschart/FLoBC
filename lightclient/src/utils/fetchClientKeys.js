import { execSync } from 'child_process';
import * as exonum from 'exonum-client'
const fs = require('fs');

export default function fetchDefaultKeys(){
    return new Promise(function(resolve){
        if (process.argv.length < 6){
            let keys = exonum.keyPair();
            fs.writeFileSync("keys.json", JSON.stringify(keys));
            resolve(keys);
        }
        else {
            fs.readFile(process.argv[5], (err, data) => {
                if (err) throw err;
                let keys = JSON.parse(data);
                resolve(keys);
            });
        }
    })
}