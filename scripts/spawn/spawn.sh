cur_path=$(pwd)
cd "${cur_path%FDMMLS*}/FDMMLS"
cd ./backend/

command_start="sh "
command="./build_finalize.sh "
path="./"
path2=""
endS=0
willTerminate=0
start_public_port=9000
start_peer_port=7091
sync="BAP"
accumulated_error_scale=0
scoring_flag=1
duration=60
modelName="MNIST28X28"
while getopts "n:t:p:g:w:q:e:s:d:f:a:m:cbjlr" arg; do
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
    g) 
        path2="$OPTARG"
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
        ;;
    r) 
        willTerminate=1
        ;;
    s)
        sync="$OPTARG" ;;
    d)
        duration="$OPTARG" ;;
    f)
        scoring_flag="$OPTARG" ;;
    a)
        accumulated_error_scale="$OPTARG" ;;
    m) 
        modelName="$OPTARG" ;;
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
    openTab $command_start "$command_start ./scripts/spawn/validator_run.sh $command_start $i $path $node_count $sync $duration $scoring_flag $modelName"
    sleep 10

done
if [[ $sync != "BAP" ]]
then
    openTab $command_start "$command_start ./scripts/spawn/syncer_run.sh $path $duration"
fi
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
    assigned_trainer_port=$(($((start_public_port))+$(($((i))%$((node_count))))))
    echo $start_public_port
    trainer_noise=$(echo "$i * $accumulated_error_scale" | bc)
    rm $lightclient/ModelMetadata
    openTab $command_start "npm start --prefix $lightclient -- 9000 models/MNIST28X28/data.csv $trainer_noise $modelName"
    sleep 10
done

if [ $endS -ne 0 ]
then
    currentT=0
    if [ $willTerminate -ne 1 ]
    then
        currentT=-1
    else
        tmp=$(tty)
        if [[ "$tmp" == *"pts"* ]] 
        then
            currentT=${tmp##*/}
        else
            tmp=${str:L-3}
            currentT=$((tmp+0))
        fi
    fi
    openTab $command_start "$command_start ./scripts/track_plot/track.sh $endS $currentT $path2"
    # $command_start ./scripts/track_plot/track.sh $endS $currentT
fi

# sleep 10
# if [ $endS -ne 0 ]
# then
#     currentT=0
#     if [ $willTerminate -ne 1 ]
#     then
#         currentT=-1
#     else
#         tmp=$(tty)
#         currentT=${tmp##*/}
#     fi
#     openTab $command_start "$command_start ./scripts/track_plot/track.sh $endS $currentT"
# fi
