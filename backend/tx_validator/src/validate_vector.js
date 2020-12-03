export default function validate_vector(base_model, gradients, validation_path, min_score, onSuccess){
    run_python(validation_path, base_model, gradients, min_score)
    .then((res) => {
        let verdict = parsePythonVerdict(res.toString());
        onSuccess(verdict === 'valid');
    })
    .catch((err) => {
        console.error(err)
    })
}

function run_python(validation_path, base_model, gradients, min_score){
    let runPy = new Promise(function(success, nosuccess) {

        const { PythonShell } = require('python-shell');

        const options = {
            mode: 'text',
            scriptPath: '../src/',
            args: ["../../" + validation_path, base_model, gradients, min_score]
        };
        PythonShell.run('validation_wrapper.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            success(results);
        });
    });
    return runPy
}

function parsePythonVerdict(pythonOutput){
    let trimmed = pythonOutput.trim().replace(/(\r\n|\n|\r)/gm, "");
    let st = trimmed.search("VERDICT");
    let end = trimmed.search("ENDVERDICT");
    return trimmed.substring(st + 7, end);
}
