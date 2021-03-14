sleep 10
path=$1
cur_path=$(pwd)
cd "${cur_path%FDMMLS*}/FDMMLS"
if [[ $path != "./" ]]
then 
    cp -R -v ./backend/syncBarrier $path/backend/syncBarrier
fi 
source ./scripts/utils/newTab.sh
cd $path/backend/syncBarrier
npm install
npm start -- 20
