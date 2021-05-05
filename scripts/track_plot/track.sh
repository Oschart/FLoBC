targetS=$(($1))
# mkdir $3
filename=$3"log.csv"
targetV=0
currentV=-1

if ((targetS > 0))
then
    while [ $currentV -lt $targetS ]
    do
        echo "Curren version is $currentV, target is $targetS"
        currentV=$(curl -s http://127.0.0.1:9000/api/services/ml_service/v1/models/latestmodel)
        sleep 10
    done

    echo "Version #$targetS reached. Plotting versions accuracy.."
    targetV=$targetS
    
else
    targetS=${targetS#-}
    echo "Sleeping for $targetS minutes.."
    targetS=$((targetS * 60))
    sleep $targetS
    targetV=$(curl -s http://127.0.0.1:9000/api/services/ml_service/v1/models/latestmodel)
    echo "Dumping accuracy values till version #$targetV"
fi

currentV=0
rm -f $filename

while [ $currentV -le $targetV ]
do
    
    currentA=$(curl -s http://127.0.0.1:9000/api/services/ml_service/v1/models/getmodelaccuracy?version=$currentV)
    echo "$currentV, $currentA" >> $filename
    currentV=$((currentV+1))
done


spawner=$(($2))
if [ $spawner -ne -1 ]
then
    tmp=$(tty)
    endT=0
    if [[ "$tmp" == *"pts"* ]] 
    then
        endT=${tmp##*/}
    else
        endT=${endT:(-3)}
        endT=$((endT+0))
    fi
    i=2
    while [ $i -le $endT ]
    do
        echo "will kill $i"
        pkill -9 -t pts/$i
        i=$((i+1))
    done
fi