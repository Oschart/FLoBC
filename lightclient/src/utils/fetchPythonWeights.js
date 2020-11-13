import parsePythonList from './parsePythonList';

const MODELS_DIR_PATH = './models/';
const MODEL_NAME = 'test_model';

let runPy = new Promise(function(success, nosuccess) {

    const { spawn } = require('child_process');
    const pyprog = spawn('python', [
        MODELS_DIR_PATH + MODEL_NAME + '/training_script.py',
        MODELS_DIR_PATH + MODEL_NAME + '/data.csv'
    ]);

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
