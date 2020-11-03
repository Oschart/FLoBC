

node_count=4
start_peer_port=7091
start_public_port=9000

cargo install --path .

ret=$?

if [ "$ret" != "0" ]
then
    exit 1
fi

if [ -d ./example ]
then 
    echo "example dir exists"
else
    mkdir example
fi

cd example
exonum-ML generate-template common.toml --validators-count ${node_count}
for i in $(seq 0 $((node_count - 1)))
do
    peer_port=$((start_peer_port + i))
    exonum-ML generate-config common.toml $((i + 1)) --peer-address 127.0.0.1:${peer_port} -n
done

for i in $(seq 0 $((node_count - 1)))
do
    public_port=$((start_public_port + i))
    private_port=$((public_port + node_count))
    exonum-ML finalize --public-api-address 0.0.0.0:${public_port} --private-api-address 0.0.0.0:${private_port} $((i + 1))/sec.toml $((i + 1))/node.toml --public-configs {1,2,3,4}/pub.toml
done

