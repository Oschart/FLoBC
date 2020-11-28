export default function validate_vector(gradients, validation_path, onSuccess){
    run_python(validation_path, gradients)
    .then((res) => {
        let verdict = parsePythonVerdict(res.toString());
        onSuccess(verdict === 'valid');
    })
}

function run_python(validation_path, gradients){
    let runPy = new Promise(function(success, nosuccess) {

        const { PythonShell } = require('python-shell');

        const options = {
            mode: 'text',
            scriptPath: '../src/',
            args: ["../../" + validation_path, gradients]
        };

        PythonShell.run('validation_script.py', options, function (err, results) {
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
