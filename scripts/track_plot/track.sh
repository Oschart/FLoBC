targetV=$(($1))
currentV=-1

while [ $currentV -lt $targetV ]
do
    echo "Curren version is $currentV, target is $targetV"
    currentV=$(curl -s http://127.0.0.1:9000/api/services/ml_service/v1/models/latestmodel)
    sleep 10
done

echo "Version #$targetV reached. Plotting versions accuracy.."
currentV=0
rm log.csv
while [ $currentV -le $targetV ]
do
    
    currentA=$(curl -s http://127.0.0.1:9000/api/services/ml_service/v1/models/getmodelaccuracy?version=$currentV)
    echo "$currentV, $currentA" >> log.csv
    currentV=$((currentV+1))
done

