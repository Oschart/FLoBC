export default function fetchDatasetDirectory(){
    if (process.argv.length < 3){
        console.log("Error: No dataset provided");
        process.exit();
    }
    return process.argv[2].trim();
}

export function fetchImposterState(){
    if (process.argv.length < 4){
        console.log("Error: No imposter state provided");
        process.exit();
    }
    return process.argv[3].trim() != "0";
}
