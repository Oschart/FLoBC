//Default weights length
// const WEIGHTS_LENGTH = 4010;

export default function parsePythonList(list, WEIGHTS_LENGTH){
    let in_arr = list.trim().replace(/(\r\n|\n|\r)/gm, "");
    let st = in_arr.search("VECTOR");
    let end = in_arr.search("ENDVECTOR");
    in_arr = in_arr.substring(st + 6, end);

    if (in_arr[0] != '[' || in_arr[in_arr.length-1] != ']') {
        console.log("Syntax Error: Python returned a faulty array");
        process.exit();
    }
    let weights = in_arr.slice(1, in_arr.length - 1).split(',').filter((el) => el != "")
    if (weights.length != WEIGHTS_LENGTH){
        console.log("We only support weights of length ", WEIGHTS_LENGTH, "Received ", weights.length);
        process.exit();
    }
    for (let i = 0 ; i < WEIGHTS_LENGTH ; i++){
        if (isNaN(weights[i])){
            console.log("Error: ", weights[i], " is not a number");
            process.exit();
        }
        weights[i] = parseFloat(weights[i]);
    }
    return weights;
}
