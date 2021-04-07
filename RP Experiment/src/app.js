const MAP = {
	"94464fc2cc6100134ff1c0530eb4f3f70d272ba8c86bfe2e1b188405164862d6": "Trainer 1", 
	"b1068fae75325052b268a2be056bbd6e9922cc7e7e182ca623bcc284cf615814": "Trainer 2",
	"a2d183088d7560422e2b2e44bf37125ea8bc4f06bdca700dd6fea31c35f45c14": "Trainer 3", 
	"0d3770f381a1549ee9bee461abeb44b1bfd4b2400898427f09242f0d8aea6f5b": "Trainer 4"
};
const TRAINERS_SCORES_ENDPOINT = "http://127.0.0.1:9000/api/services/ml_service/v1/models/trainersscores";
const HTTP = require('http');
console.log("------------------------------------")
console.log("Trainer Scores:");
console.log("---------------")

HTTP.get(TRAINERS_SCORES_ENDPOINT, (resp) => {
	let data = '';
	resp.on('data', (chunk) => {
		data += chunk;
	});

	resp.on('end', () => {
		data = data.replace(/\\/g, '')
		data = data.slice(1, data.length-1)
		let scores = JSON.parse(data);
		let addresses = Object.keys(scores)
		let score_pairs = []
		for (let i = 0 ; i < addresses.length ; i++){
			score_pairs.push({"name": MAP[addresses[i]], "score": scores[addresses[i]]});
		}
		score_pairs.sort((a,b) => {
			if (a.name < b.name) return -1; return 1;
		})
		for (let i = 0 ; i < score_pairs.length ; i ++){
			console.log(score_pairs[i].name, ":", score_pairs[i].score)
		}
	});
});
