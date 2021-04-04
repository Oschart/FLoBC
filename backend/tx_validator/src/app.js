import * as exonum from 'exonum-client'
import * as proto from './proto'
import validate_vector from './validate_vector'
import store_encoded_vector, { clear_encoded_vector } from './store_encoded_vector'
import { fetchLatestModel, fetchMinScore } from './utils';

function validation() {
  let transaction = proto.TxShareUpdates.decode(exonum.hexadecimalToUint8Array(process.argv[3]));
  let min_score = transaction.min_score;
  store_encoded_vector(transaction.gradients).then((encoded_vector_path) => {
    validate_vector(encoded_vector_path, process.argv[2], 0, (valid) => {
      clear_encoded_vector();

      if (valid) {
        console.log("VALID");
      }
      else {
        console.log("INVALID");
      }
    });
  });
}

fetchLatestModel()
  .then((base_model) => {
    fetchMinScore()
      .then((min_score) => {
        let transaction = proto.TxShareUpdates.decode(exonum.hexadecimalToUint8Array(process.argv[3]));
        let val_id = process.argv[4];
        store_encoded_vector(transaction.gradients, "gradients"+val_id).then((encoded_vector_path) => {
          if (base_model == 0) {
            validate_vector(true, "", encoded_vector_path, process.argv[2], min_score, (results) => {
              clear_encoded_vector("gradients"+val_id);
              clear_encoded_vector("basemodel"+val_id);

              let verdict = results[0]
              let score = results[1]
              console.log(`${verdict.toUpperCase()}:${score}`);


            });
          } else {
            store_encoded_vector(base_model, "basemodel"+val_id).then((encoded_basemodel_path) => {
              validate_vector(false, encoded_basemodel_path, encoded_vector_path, process.argv[2], min_score, (results) => {
                clear_encoded_vector("gradients"+val_id);
                clear_encoded_vector("basemodel"+val_id);

                let verdict = results[0]
                let score = results[1]
                console.log(`${verdict.toUpperCase()}:${score}`);


              });
            });
          }
        });
      });
  });
