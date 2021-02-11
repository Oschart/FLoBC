import * as exonum from 'exonum-client'
import * as proto from './proto'
import validate_vector from './validate_vector'
import store_encoded_vector, { clear_encoded_vector } from './store_encoded_vector'
import {fetchLatestModelValidator} from '../../../lightclient/dist/utils/fetchLatestModel';
import {fetchMinScore} from '../../../lightclient/dist/utils/fetchLatestModel';

function validation(){
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
}

fetchLatestModelValidator()
.then((base_model) => {
  fetchMinScore()
  .then((min_score) => {
    let transaction = proto.TxShareUpdates.decode(exonum.hexadecimalToUint8Array(process.argv[3]));
    store_encoded_vector(transaction.gradients, "gradients").then((encoded_vector_path) => {
      store_encoded_vector(base_model, "basemodel").then((encoded_basemodel_path) => {
        validate_vector(encoded_basemodel_path, encoded_vector_path, process.argv[2], min_score, (results) => {
          clear_encoded_vector("gradients");
          clear_encoded_vector("basemodel");
          
          let verdict = results[0]
          let score = results[1]
          console.log(`${verdict.toUpperCase()}:${score}`);


        });
      });
    });
  });
});
