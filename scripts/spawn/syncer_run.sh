sleep 5
path=$1
period=$2
cur_path=$(pwd)
cd "${cur_path%FDMMLS*}/FDMMLS"
if [[ $path != "./" ]]
then 
    cp -R -v ./backend/syncBarrier $path/backend/syncBarrier
fi 
source ./scripts/utils/newTab.sh
cd $path/backend/syncBarrier
npm install
npm start -- $period
