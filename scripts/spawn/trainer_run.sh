i=$1
path=$2
command_start=$3
echo $i

if [[ $path != "./" ]]
then 
    mkdir $path/
    cd_path=$path/lightclient$i
else 
    cd_path="./lightclient"
fi

if [[ $path != "./" ]]
then 
    cp -R -v ./lightclient $path/lightclient$i
else if [[ $i != 0 ]]
then 
    cp -R -v ./lightclient $path/lightclient$i
fi
fi

cd $cd_path
rm ModelMetadata
# cur_path=$(pwd)
# source "${cur_path%FDMMLS*}/FDMMLS/scripts/utils/newTab.sh"
# openTab $command_start "npm start --prefix $path -- 9000 models/test_model/data.csv 0"