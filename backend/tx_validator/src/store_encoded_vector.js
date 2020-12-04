const fs = require('fs');
const FILENAME = 'encoded_vector';

export default function store_encoded_vector(gradients){
    return new Promise(function(resolve){
        let encoded = gradients.join("|"); 
        fs.writeFileSync(FILENAME, encoded);
        resolve(FILENAME);
    });
}

export function clear_encoded_vector(){
    fs.unlink(FILENAME, ()=>{});
}