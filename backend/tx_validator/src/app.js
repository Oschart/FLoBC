import * as exonum from 'exonum-client'
import * as proto from './proto'
import validate_vector from './validate_vector'
import store_encoded_vector, { clear_encoded_vector } from './store_encoded_vector'

let transaction = proto.TxShareUpdates.decode(exonum.hexadecimalToUint8Array(process.argv[3]));
let min_score = transaction.min_score;
store_encoded_vector(transaction.gradients).then((encoded_vector_path) => {
  validate_vector(encoded_vector_path, process.argv[2], 0, (valid) => {
    clear_encoded_vector();
    
    if (valid){
      console.log("VALID");
    }
    else {
      console.log("INVALID");
    }
  });
});

