start_peer_port=7091
start_public_port=9000

build=0
build_js=0
while getopts "n:w:q:cbj" arg; do
    case $arg in
    n) node_count=$(($OPTARG)) ;;
    c) rm -r example ;;
    b) build=1 ;;
    j) build_js=1 ;;
    w) start_public_port="$OPTARG" ;;
    q) start_peer_port="$OPTARG" ;;
    esac
done

echo "node count = $node_count"

echo "build = $build"
echo "build_js = $build_js"

if [ "$build" -eq "1" ]; then
    cargo install --path .
    ret=$?
    if [ "$ret" != "0" ]; then
        exit 1
    fi
fi

if [ "$build_js" -eq "1" ]; then
    cd tx_validator
    npm install && babel src -d dist
    ret=$?
    cd ..
    if [ "$ret" != "0" ]; then
        exit 1
    fi
fi

if [ -d ./example ]; then
    echo "example dir exists"
else
    mkdir example
    cd example
    echo "Generating node configs..."
    exonum-ML generate-template common.toml --validators-count ${node_count}
    for i in $(seq 0 $((node_count - 1))); do
        peer_port=$((start_peer_port + i))
        exonum-ML generate-config common.toml $((i + 1)) --peer-address 127.0.0.1:${peer_port} -n
    done
    cd ..
fi

cd example

node_list=($(seq 1 $node_count))

node_list=("${node_list[@]/%//pub.toml}")

echo "Finalizing nodes.."
for i in $(seq 0 $((node_count - 1))); do
    public_port=$((start_public_port + i))
    private_port=$((public_port + node_count))
    exonum-ML finalize --public-api-address 0.0.0.0:${public_port} \
    --private-api-address 0.0.0.0:${private_port} $((i + 1))/sec.toml $((i + 1))/node.toml \
    --public-configs "${node_list[@]}"
done
