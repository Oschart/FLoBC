const fs = require('fs');

export default function store_encoded_vector(gradients, filename){
    return new Promise(function(resolve){
        let encoded = gradients.join("|"); 
        fs.writeFileSync(filename, encoded);
        resolve(filename);
    });
}

export function clear_encoded_vector(filename){
    fs.unlink(filename, ()=>{});
}