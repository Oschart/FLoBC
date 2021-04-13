command_start="sh "
agent_max=10
start_agent=1

command="./scripts/spawn/spawn.sh "
# while getopts "n:t:cbjl" arg; do
while getopts "n:s:e:blr" arg; do
    case $arg in
    b) 
        command+="-b "
        ;;
    l) 
        command_start="bash "
        command+="-l "
        ;;
    n) 
        agent_max="$OPTARG"
        ;;
    s) 
        start_agent="$OPTARG"
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
for ((i=start_agent;i<agent_max;i++));
do        
    j=$((agent_max-i))
    echo "Trainers =  $i, Validators = $j"
    command=$command_string
    # openTab $command_start "$command_start $command -n $j -t $i -p ./exp_n${j}_t${i} -w $start_public_port -q $start_peer_port"
    echo $command_start $command -c -j -n $j -t $i -g "./exp2/n${j}_t${i}_" -s "BSP" -d 240
    $command_start $command -c -j -n $j -t $i -g "./exp2/n${j}_t${i}_" -s "BSP" -d 240
    
    sleep 10
    # start_public_port=$((start_public_port+1))
    # start_peer_port=$((start_peer_port+1))
done

