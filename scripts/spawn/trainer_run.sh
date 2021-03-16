i=$1
path=$2
echo $i

# cd /Users/habibabassem/Desktop/Spring\ 2021/Thesis\ II/FDMMLS/

if [[ $path != "./" ]]
then 
    mkdir $path/
    cp -R -v ./lightclient $path/lightclient$i
    cd $path/lightclient$i
else 
    cd lightclient
fi
# if [ $i != 0 ]
# then
#     cp -R -v ./lightclient $path/lightclient$i
#     cd $path/lightclient$i
# else 
#     cd ./lightclient
# fi 
rm ModelMetadata
npm start -- 9000 ./models/test_model/data.csv 0