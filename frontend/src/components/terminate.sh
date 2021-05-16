
terminalsN=$(($1))
terminalsN=$((terminalsN+1))
i=2
echo "will terminate from 2 to $terminalsN"
while [ $i -le $terminalsN ]
do
    echo "will kill $i"
    pkill -9 -t pts/$i
    i=$((i+1))
done