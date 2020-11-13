import parsePythonList from './parsePythonList';

const MODELS_DIR_PATH = './models/';
const MODEL_NAME = 'test_model';

let runPy = new Promise(function(success, nosuccess) {

    const { PythonShell } = require('python-shell');

    const options = {
        mode: 'text',
        scriptPath: MODELS_DIR_PATH + MODEL_NAME,
        args: [MODELS_DIR_PATH + MODEL_NAME + '/data.csv']
    };

    PythonShell.run('training_script.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        success(results);
    });
});

//onSuccess: callback function taking one parameter: the vector from python
//onFailure prints the python error and terminates by default
export default function fetchPythonWeights(onSuccess){
    runPy
    .then((res) => {
        let model_weights = parsePythonList(res.toString());
        onSuccess(model_weights);
    })
}
