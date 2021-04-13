# %%
import sys
import pandas as pd
import numpy as np
# %%
################################
# Formatted print back to node
################################
def send_to_node(newModel_flag, initial_model, update_vector):
    if len(update_vector) == 0:
        print("VECTOR[]ENDVECTOR")
    else:
        print(len(update_vector))
        print(len(initial_model))
        print("VECTOR[", flush=True, end="")
        if newModel_flag:
            for i in range(len(update_vector) - 1):
                print(update_vector[i], flush=True, end=",")
            print(update_vector[-1], flush=True, end="")
        else:
            for i in range(len(update_vector) - 1):
                print(update_vector[i] - initial_model[i], flush=True, end=",")
            print(update_vector[-1] - initial_model[-1], flush=True, end="")
        print("]ENDVECTOR",end="\n",flush=True)
# %%
################################
# Reading dataframe
################################
def read_input(index):
    if len(sys.argv) < (index+1):
        raise Exception('No dataset path found')

    df = pd.read_csv(sys.argv[index])
    # df = pd.read_csv("data.csv")
    if len(df) == 0:
        raise Exception('Empty dataset')
    return df

# %%
def readNewModel_flag(index):
    if len(sys.argv) < (index+1):
        raise Exception('No new model flag found')
    
    return sys.argv[index]

# %%
################################
# Reading weights list
################################
def read_weights(index):
    if len(sys.argv) < (index+1):
        raise Exception('No weights list found')

    weights_list_path = sys.argv[index]
    weights_list = open(weights_list_path, "r").readline().split("|")
    if len(weights_list) == 0:
        raise Exception('Empty weights list')
    weights_list = [float(i) for i in weights_list] 
    return weights_list

# %%
def flattenWeights(model):
  arr = np.array(model.get_weights())
  for i in range (0, len(arr)):
          arr[i] = arr[i].flatten()

  arr = np.concatenate(arr)
  list = arr.tolist()
  return list

# %%
def trainModel(model, data_train, label_train):
    model.fit(data_train, label_train, epochs=1, verbose=1)
    return model

# %%
def rebuildModel(new_model, list):
    # if (newModel_flag):
    #     list = []
    #     np.random.seed(0)
    #     list = np.random.uniform(low = -0.09, high = 0.09, size = new_model.count_params()).tolist()
    start = 0
    for i in range (0, len(new_model.layers)):
        bound = np.array(new_model.layers[i].get_weights(), dtype="object").size
        weights = []
        for j in range (0, bound):
            size = (new_model.layers[i].get_weights()[j]).size
            arr = np.array(list[start:start+size])
            arr = arr.reshape(new_model.layers[i].get_weights()[j].shape)
            weights.append(arr)
            start += size
        if (bound > 0):
            new_model.layers[i].set_weights(weights)
    return new_model