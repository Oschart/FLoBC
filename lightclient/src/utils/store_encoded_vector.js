const fs = require('fs');
const FILENAME = 'encoded_vector';
const ENCODING_SEPARATOR = "|";

export function store_encoded_vector(gradients, targetFile=FILENAME){
    return new Promise(function(resolve){
        let encoded = gradients.join(ENCODING_SEPARATOR); 
        fs.writeFileSync(targetFile, encoded);
        resolve(targetFile);
    });
}

export function remove_file_if_exists(targetFile){
    return new Promise(function(){
        if (fs.existsSync(targetFile)) {
            fs.unlinkSync(targetFile, ()=>{});
            resolve();
        }
    });
}

export function read_encoded_vector(targetFile){
    let encodedArray = fs.readFileSync(targetFile, "utf8");
    let array = encodedArray.split(ENCODING_SEPARATOR);
    return array;
}

export function clear_encoded_vector(targetFile=FILENAME){
    fs.unlink(targetFile, ()=>{});
}