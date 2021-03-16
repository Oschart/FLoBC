cd ./backend/

command_start="sh "
command="./build_finalize.sh "
path="./"
endV = -1
while getopts "n:t:p:w:q:e:cbjl" arg; do
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
        endV=$(($OPTARG)) 
        command+="-e "
        command+="$endV "
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
    openTab $command_start "$command_start ./scripts/spawn/validator_run.sh $command_start $i $path"
    # newtab $command_start"./scripts/spawn/validator_run.sh" $command_start $i $path
    #sleep 5
done
cd ./backend/syncBarrier
openTab $command_start "npm start"
printf "%0.s*" {1..70} 
printf "\n"

cd ../../lightclient
rm ModelMetadata
rm encoded_vector
npm install
cd ..
for ((i=0;i<trainers;i++))
do
    source ./scripts/utils/newTab.sh
    openTab $command_start "$command_start ./scripts/spawn/trainer_run.sh $i $path"
    # newtab $command_start"./scripts/spawn/trainer_run.sh" $i $path
done

if (( endV > -1 ))
then
    tmp=$(tty)
    currentT=${tmp##*/}
    openTab $command_start "$command_start ./scripts/track_plot/track.sh $endV $currentT"
fi