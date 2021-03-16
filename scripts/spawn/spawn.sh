cd ./backend/

command_start="sh "
command="./build_finalize.sh "
path="./"
endS=0
willTerminate=0
start_public_port=9000
start_peer_port=7091
while getopts "n:t:p:w:q:e:cbjlr" arg; do
    case $arg in
    n) 
        node_count=$(($OPTARG)) 
        command+="-n "
        command+="$node_count "
        ;;
    c) 
        command+="-c "
        ;;
    b) 
        command+="-b "
        ;;
    j) 
        command+="-j "
        ;;
    l) 
        command_start="bash "
        ;;
    t) 
        trainers="$OPTARG"
        ;;
    p) 
        path="$OPTARG"
        ;;
    w) 
        start_public_port="$OPTARG" 
        command+="-w $start_public_port "
        ;;
    q)  
        start_peer_port="$OPTARG" 
        command+="-q $start_peer_port "
        ;;
    e)
        endS=$(($OPTARG)) 
        command+="-e "
        command+="$endS "
        ;;
    r) 
        command+="-r "
        willTerminate=1
        ;;
    esac
done
printf "%0.s*" {1..70} 
printf "\n"
echo "Running: "$command_start$command
printf "%0.s*" {1..70} 
printf "\n"
$command_start$command
cd ..

printf "%0.s*" {1..70} 
printf "\n"
for ((i=0;i<node_count;i++));
do
    echo "Staring validator #$i"
    source ./scripts/utils/newTab.sh
    openTab $command_start "$command_start ./scripts/spawn/validator_run.sh $command_start $i $path $node_count"
    sleep 10

done
printf "%0.s*" {1..70} 
printf "\n"

cd ./lightclient
rm ModelMetadata
rm encoded_vector
npm install
cd ..
###############################
## Copying lightclient folder
###############################
for ((i=0;i<trainers;i++))
do
    source ./scripts/utils/newTab.sh
    $command_start ./scripts/spawn/trainer_run.sh $i $path $command_start
done

###############################
## Running light client
###############################
for ((i=0;i<trainers;i++))
do
    source ./scripts/utils/newTab.sh
    if [[ $i != 0 ]]
    then
        lightclient="lightclient$i"
    else 
        lightclient="lightclient"
    fi
    start_public_port=$(($((start_public_port))+$(($((i))%$((node_count))))))
    echo $start_public_port
    openTab $command_start "npm start --prefix $lightclient -- $start_public_port models/test_model/data.csv 0"
    sleep 10
done

sleep 10
if [ $endS -ne 0 ]
then
    currentT=0
    if [ $willTerminate -ne 1 ]
    then
        currentT=-1
    else
        tmp=$(tty)
        if [[ "$str" == *"pts"* ]] 
        then
            currentT=${tmp##*/}
        else
            tmp=${str:L-3}
            currentT=$((tmp+0))
        fi
        currentT=${tmp##*/}
    fi
    openTab $command_start "$command_start ./scripts/track_plot/track.sh $endS $currentT"
fi

