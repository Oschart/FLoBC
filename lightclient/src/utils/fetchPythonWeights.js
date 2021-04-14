import parsePythonList from './parsePythonList';

const MODELS_DIR_PATH = './models/';
// const MODEL_NAME = 'test_model';

function run_python(newModel_flag, dataset_path, modelWeights_path, MODEL_NAME){
    let runPy = new Promise(function(success, nosuccess) {

        const { PythonShell } = require('python-shell');

        const options = {
            mode: 'text',
            scriptPath: MODELS_DIR_PATH + MODEL_NAME,
            args: [newModel_flag, dataset_path, modelWeights_path]
        };

        PythonShell.run('training_script.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            success(results);
        });
    });
    return runPy
}


//onSuccess: callback function taking one parameter: the vector from python
//onFailure prints the python error and terminates by default
export default function fetchPythonWeights(newModel_flag, dataset_path, modelWeights_path, MODEL_NAME, MODEL_LENGTH){
    return run_python(newModel_flag, dataset_path, modelWeights_path, MODEL_NAME)
    .then((res) => {
        let model_weights = parsePythonList(res.toString(), MODEL_LENGTH);
        return model_weights;
    })
}
