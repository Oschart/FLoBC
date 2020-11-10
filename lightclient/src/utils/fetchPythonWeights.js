import parsePythonList from './parsePythonList';

const DATASET_PATH = 'data.csv';

let runPy = new Promise(function(success, nosuccess) {

    const { spawn } = require('child_process');
    const pyprog = spawn('python', ['./script.py', DATASET_PATH]);

    pyprog.stdout.on('data', function(data) {
        success(data);
    });
    pyprog.stderr.on('data', function(data) {
        nosuccess(data);
    });
});

//onSuccess: callback function taking one parameter: the vector from python
//onFailure prints the python error and terminates by default
export default function fetchPythonWeights(onSuccess){
    runPy
    .catch((res) => { console.log("PythonError: ", res.toString()); process.exit() })
    .then((res) => {
        let model_weights = parsePythonList(res.toString());
        onSuccess(model_weights);
    })
}
