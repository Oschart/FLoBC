NUM_CLIENTS=10

def read_weights(file):
    weights_list = open(file, "r").readline().split("|")
    if len(weights_list) == 0:
        raise Exception('Empty weights list')
    weights_list = [float(i) for i in weights_list] 
    return weights_list

def federated_averaging(weight_lists):
    averaged_weights = []
    num_lists = len(weight_lists)

    for i in range(len(weight_lists[0])):
        total_weight = 0.0

        for weights in weight_lists:
            total_weight += weights[i]

        average_weight = total_weight / num_lists
        averaged_weights.append(average_weight)

    return averaged_weights

all_weights = []


for i in range(0,NUM_CLIENTS-1):
    print("i: ", i)
    filename = './weights/'+f'weights_{i}.txt'
    l = read_weights(filename)
    all_weights.append(l)

averaged_weights = federated_averaging(all_weights)

delimiter = "|"

with open('./weights/'+f'weights_fed_avg.txt',"w") as f:
    weights_str = delimiter.join(str(w) for w in averaged_weights)
    f.write(weights_str)