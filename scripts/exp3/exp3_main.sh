#first part
syncSchemes=("BSP" "SSP" "BAP")
for i in ${!syncSchemes[@]};
do
    logName="./exp3_${syncSchemes[$i]}_30_"
    fullLogName="${logName}log.csv"
    echo ${logName}
    bash scripts/spawn/spawn.sh -n 3 -t 6 -b -j -c -l -e 30 -r -s ${syncSchemes[$i]} -d 40 -g ${logName}
    until [ -f "$fullLogName" ]
    do
    echo "Current test is still running.."
    sleep 30
    done
done
#second part
for i in ${!syncSchemes[@]};
do
    logName="./exp3_${syncSchemes[$i]}_10_"
    fullLogName="${logName}log.csv"
    echo ${logName}
    bash scripts/spawn/spawn.sh -n 3 -t 6 -b -j -c -l -e -10 -r -s ${syncSchemes[$i]} -d 40 -g ${logName}
    until [ -f "$fullLogName" ]
    do
    echo "Current test is still running.."
    sleep 30
    done
done