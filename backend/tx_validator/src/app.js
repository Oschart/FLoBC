import * as exonum from 'exonum-client'
import * as proto from './proto'
import validate_vector from './validate_vector'

let transaction = proto.TxShareUpdates.decode(exonum.hexadecimalToUint8Array(process.argv[3]));
let min_score = transaction.min_score;
validate_vector(transaction.gradients.join("|"), process.argv[2], 0, (valid) => {
  if (valid){
    console.log("VALID");
  }
  else {
    console.log("INVALID");
  }
});
