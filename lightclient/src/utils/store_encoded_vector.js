const fs = require('fs');
const CACHE_FOLDER = './models_cache/';
const ENCODING_SEPARATOR = "|";

const CACHE_FILE_RESOLVER = {
    'python': 'python_bus',
    'validator': 'last_validator_model',
    'retrain': 'retrained_model'
}

export function store_encoded_vector(gradients, target='python'){
    let targetFile = CACHE_FOLDER + CACHE_FILE_RESOLVER[target];
    let encoded = gradients.join(ENCODING_SEPARATOR); 
    fs.writeFileSync(targetFile, encoded);
    return targetFile;
}

export function remove_file_if_exists(target){
    let targetFile = CACHE_FOLDER + CACHE_FILE_RESOLVER[target];
    if (fs.existsSync(targetFile)) {
        fs.unlinkSync(targetFile, ()=>{});
    }
}

export function read_encoded_vector(target){
    let targetFile = CACHE_FOLDER + CACHE_FILE_RESOLVER[target];
    let encodedArray = fs.readFileSync(targetFile, "utf8");
    let array = encodedArray.split(ENCODING_SEPARATOR);
    array = array.map(val => {
        return parseFloat(val);
    })
    return array;
}

export function clear_encoded_vector(target='python'){
    let targetFile = CACHE_FOLDER + CACHE_FILE_RESOLVER[target];
    fs.unlinkSync(targetFile, ()=>{});
}