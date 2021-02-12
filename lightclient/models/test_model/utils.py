# %%
import sys
import pandas as pd
import numpy as np

# %%
################################
# Formatted print back to node
################################
def send_to_node(initial_model, update_vector):
  if len(update_vector) == 0:
      print("VECTOR[]ENDVECTOR")
  else:
      print(len(update_vector))
      print(len(initial_model))
      print("VECTOR[", flush=True, end="")
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
    # df = pd.read_csv("resized_train.csv")
    if len(df) == 0:
        raise Exception('Empty dataset')
    return df

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
  model.fit(data_train, label_train, epochs=1, verbose=0)
  return model