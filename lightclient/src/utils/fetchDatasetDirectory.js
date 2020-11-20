export default function fetchDatasetDirectory(){
    if (process.argv.length < 3){
        console.log("Error: No dataset provided");
        process.exit();
    }
    return process.argv[2].trim();
}
