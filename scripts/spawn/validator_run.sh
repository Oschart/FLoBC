command_start=$1
i=$2
path=$3
if [[ $path != "./" ]]
then 
    mkdir $path
    mkdir $path/backend
    cp -v ./backend/run_node.sh $path/backend
    cp -R -v ./backend/tx_validator $path/backend/tx_validator
    cp -R -v ./backend/example $path/backend/example
fi 
cd $path/backend
$command_start "./run_node.sh" $i "BSP"