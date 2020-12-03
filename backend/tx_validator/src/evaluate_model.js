
export default function evaluate_model(base_model, onSuccess){
    run_python(base_model)
    .then((res) => {
        let score = parsePythonOutput(res.toString());
        onSuccess(score);
    })
    .catch((err) => {
        console.error(err)
    })
}

function run_python(base_model){
    let runPy = new Promise(function(success, nosuccess) {

        const { PythonShell } = require('python-shell');

        const options = {
            mode: 'text',
            scriptPath: '../src/',
            args: [base_model]
        };
        PythonShell.run('evaluation_wrapper.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            success(results);
        });
    });
    return runPy
}

function parsePythonOutput(pythonOutput){
    let trimmed = pythonOutput.trim().replace(/(\r\n|\n|\r)/gm, "");
    let st = trimmed.search("RETURN");
    let end = trimmed.search("ENDRETURN");
    return trimmed.substring(st + 6, end);
}
