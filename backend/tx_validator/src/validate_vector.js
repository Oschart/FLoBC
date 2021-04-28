export default function validate_vector(newModel_flag, base_model, gradients, validation_path, min_score, onSuccess){
    run_python(newModel_flag, validation_path, base_model, gradients, min_score)
    .then((res) => {
        let results = parsePythonVerdict(res.toString());
        onSuccess(results);
    })
    .catch((err) => {
        console.error(err)
    })
}

function run_python(newModel_flag, validation_path, base_model, gradients, min_score){
    let runPy = new Promise(function(success, nosuccess) {

        const { PythonShell } = require('python-shell');

        const options = {
            mode: 'text',
            scriptPath: '../src/',
            args: [newModel_flag, validation_path, base_model, gradients, min_score, process.argv[5]]
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
    let st1 = trimmed.search("VERDICT");
    let end1 = trimmed.search("ENDVERDICT");
    let st2 = trimmed.search("SCORE");
    let end2 = trimmed.search("ENDSCORE");
    let verdict = trimmed.substring(st1 + "VERDICT".length, end1);
    let score = trimmed.substring(st2 + "SCORE".length, end2);
    return [verdict, score]
}
