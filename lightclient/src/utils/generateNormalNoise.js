const CLT_SIZE = 7; 

export default function generateNormalNoise(update_length, scale){
    let sample = Array.from({length: update_length}, () => Array.from({length: CLT_SIZE}, Math.random ))
    return sample.map(list => {
        let sm = 0;
        for (let i  = 0 ; i < CLT_SIZE ; i++) sm += list[i];
        return 2.0 * scale * (sm / CLT_SIZE - 0.5);
    })
}