command_start=$1
i=$2
path=$3
nodes=$4
sync=$5
period=$6
scoring_flag=$7
model_name=$8
if [[ $path != "./" ]]
then 
    mkdir $path
    mkdir $path/backend
    cp -v ./backend/run_node.sh $path/backend
    cp -R -v ./backend/tx_validator $path/backend/tx_validator
    cp -R -v ./backend/example $path/backend/example
fi 

# if [[ $i == "0" ]]
# then 
#     source ./scripts/utils/newTab.sh
#     openTab $command_start "$command_start ./scripts/spawn/syncer_run.sh $path"
# fi
source ./scripts/utils/newTab.sh
cd $path/backend
$command_start "./run_node.sh" $i $sync $nodes $scoring_flag $model_name
