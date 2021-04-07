command_start="sh "
trainers_max=2
validators_max=1
start_t=1
start_v=1
command="./scripts/spawn/spawn.sh "
# while getopts "n:t:cbjl" arg; do
while getopts "n:v:s:t:e:blr" arg; do
    case $arg in
    n) 
        validators_max=$(($OPTARG)) 
        ;;
    # c) 
    #     command+="-c "
    #     ;;
    b) 
        command+="-b "
        ;;
    # j) 
    #     command+="-j "
    #     ;;
    l) 
        command_start="bash "
        command+="-l "
        ;;
    t) 
        trainers_max="$OPTARG"
        ;;
    s) 
        start_t="$OPTARG"
        ;;
    v) 
        start_v="$OPTARG"
        ;;
    e)
        command+="-e "
        endS=$(($OPTARG)) 
        command+="$endS "
        ;;
    r) 
        command+="-r "
        ;;
    esac
done

# start_public_port=1000
# start_peer_port=5000
command_string=$command
mkdir exp2
for ((i=start_t;i<=trainers_max;i++));
do    
    for ((j=start_v;j<=validators_max;j++));
    do
        echo "Trainers =  $i, Validators = $j"
        command=$command_string
        # openTab $command_start "$command_start $command -n $j -t $i -p ./exp_n${j}_t${i} -w $start_public_port -q $start_peer_port"
        echo $command_start $command -c -j -n $j -t $i -g "./exp2/exp_n${j}_t${i}_"
        $command_start $command -c -j -n $j -t $i -g "./exp2/exp_n${j}_t${i}_"
        
        sleep 10
        # start_public_port=$((start_public_port+1))
        # start_peer_port=$((start_peer_port+1))
    done
    $start_v=1
done

