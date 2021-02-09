# FDMMLS
Fully Decentralized Multi-Agent Machine Learning System

## To Run the Tool
- N.B. Place training data in ./lightclient/models/test_model/
- N.B. Place test data in ./backend/tx_validator/src/models/MODELNAME/data.csv
### To install babel (needed to build node.js validator)
``` shell
$ npm install -g babel-cli
```
### To build the rust code and/or the validating node
``` shell
$ cd backend
$ sh build_finalize.sh -n <number of validating nodes> -b -c -j 
$ cd ..
````
- -b is used to build rust
- -c is used to clear the blockchain
- -j is used to build the node.js validator

### To run the validating node
``` shell
$ cd backend
$ sh run_node -i <node number> --validation_path ./dummy/path/
$ cd ..
````
### To build the lightclient 
``` shell
$ cd lightclient
$ npm install
$ npm start -- path/to/data.csv 0
$ cd ..
```
For the npm start command, use 0 as the impostor status if honest, 1 if impostor. 
