node_count=4
start_peer_port=7091
start_public_port=9000

cd example

i=$(($1))

sync_policy=$2

echo "i = $i"

public_port=$((start_public_port + i))
private_port=$((public_port + node_count))

echo "new node with ports: $public_port (public)"
exonum-ML run --node-config $((i + 1))/node.toml --db-path $((i + 1))/db --public-api-address 0.0.0.0:${public_port} --master-key-pass pass \
--sync-policy $sync_policy
