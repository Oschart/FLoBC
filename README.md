# FDMMLS
Fully Decentralized Multi-Agent Machine Learning System

## Prerequisites
- git clone https://github.com/Oschart/FDMMLS.git
- npm 
- node https://nodejs.org/en/download/
- babel 
``` shell
$ npm install -g babel-cli
```

## To Run the Tool

### Using GUI
#### Install the prerequisites
``` shell
$ npm install express
$ npm install 
````

#### To run the web service
``` shell
$ cd frontend/src/components
$ node service.js
$ cd ../..
````

``` shell
$ cd frontend
$ npm start
````

##### Initialization Form
To configure the system
![Initialization Page](./pictures/form.png "System Configuration Page")

##### Progress Monitoring
![Progress Monitoring](./pictures/monitor.png "Progress Monitoring")

#### Demo Video
<a href="https://drive.google.com/file/d/1indstlHqPbDn9WctNczFZVVRBCU-5qbf/view?usp=sharing"><img src="https://github.com/Oschart/FDMMLS/blob/main/pictures/thumbnail.png" 
alt="demo video" width="360" height="240" border="10" /></a>

### Using Scripts

### Manually

### To install babel (needed to build node.js validator)

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
$ sh run_node <node number> <sync scheme> <scoring flag>
$ cd ..
````
### To build the lightclient 
``` shell
$ cd lightclient
$ npm install
$ npm start -- <validator port number> path/to/data.csv 0
```
For the npm start command, use 0 as the impostor status if honest, 1 if impostor. 

## To use the provided models, you need:
- python >= 3
- tensorflow
- keras
- numpy
- pandas

## To use the provided MNIST 28x28 models, download MNIST data
https://www.kaggle.com/oddrationale/mnist-in-csv

## To use the provided MNIST 20x20 models:
resize the downloaded data using [this script](./ML_models/resize_MNIST)

- N.B. Place training data in ./lightclient/models/MODEL_NAME/
- N.B. Place test data in ./backend/tx_validator/src/models/MODEL_NAME/data.csv
