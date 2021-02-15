command_start=$1
i=$1
echo $i

cd /Users/habibabassem/Desktop/Spring\ 2021/Thesis\ II/FDMMLS/

if [ $i != 0 ]
then
    cp -R -v ./lightclient ./lightclient$i
    cd ./lightclient$i
else 
    cd ./lightclient
fi 
rm ModelMetadata
npm start -- ./models/test_model/data.csv 0