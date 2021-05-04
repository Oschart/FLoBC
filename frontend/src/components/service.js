const express = require('express')
const { exec } = require('child_process')
const { spawn } = require('child_process')
const { join } = require('path')

const port = process.env.PORT || 24587
const app = express()

app.use(express.static(join(__dirname, '../')))

// app.get('/runSpawn', (req, res) => {
//     console.log("here");
//     let command = req.query.command;
//     console.log(command);
//     exec(command, (error, stdout, stderr) => {
//         if (error) {
//             console.log(`error: ${error.message}`);
//             return res.status(400).json({ output: null, error: error.message });
//         }
//         if (stderr){
//             console.log(`stderr: ${stderr}`);
//             return res.status(400).json({ output: null, error: stderr });;
//         } 
//         console.log(`stdout: ${stdout}`);
//         return res.status(200).json({ output: stdout, error: null });
//     });
// })

app.get('/runSpawn', (req, res) => {
    let trainers = req.query.trainers;
    let validators = req.query.validators;
    let syncScheme = req.query.sync;
    let period = req.query.period;
    let version =  req.query.version;
    let args = ["../../../scripts/spawn/spawn.sh", "-b","-c", "-j", "-l", "-n", validators, "-t", trainers, "-s", syncScheme, "-d", period];
    if (version != undefined){
        args.push("-r");
        args.push("-e");
        args.push(version);
    }
    let child = spawn("bash", args);
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    
    child.stderr.on('data', function (data) {
        console.log(data.toString());
    });
    
    child.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
    });
})

app.listen(port, () => {
  console.log('server listening on port', port)
})