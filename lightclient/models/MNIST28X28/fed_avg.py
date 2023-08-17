def read_weights_file(file):
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