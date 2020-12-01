
#In[1]
import sys
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import tensorflow as tf
import json

# %%
################################
# Formatted print back to node
################################
def send_to_node(update_vector):
    if len(update_vector) == 0:
        print("VECTOR[]ENDVECTOR")
    else:
        print("VECTOR[", end='')
        for i in range(len(update_vector) - 1):
            print(update_vector[i], end=',')
        print(update_vector[-1], end='')
        print("]ENDVECTOR")
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

    weights_list = sys.argv[index]
    if len(weights_list) == 0:
        raise Exception('Empty weights list')
    return weights_list

# %%
################################
# Reshaping input
################################
def reshapeData(index):
  df = read_input(index)
  df = df.head(int(len(df) * 0.9))
  df = df.sample(int(0.5*len(df)))
  label = df.iloc[:, 0]
  label = label.to_numpy()
  df = df.drop(df.columns[0], axis = 1)
  df = df.values.reshape(df.shape[0], 20, 20)

  #df = df.reshape(df.shape[0], 20, 20, 1)
  # Making sure that the values are float so that we can get decimal points after division
  df = df.astype('float32')
  # Normalizing the RGB codes by dividing it to the max RGB value.
  df /= 255
  return df, label

# %%
def createModel():
  model = tf.keras.models.Sequential([
    tf.keras.layers.Flatten(input_shape=(20, 20)),
    # tf.keras.layers.Dense(10, activation='relu'),
    # tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(10)
  ])
  loss_fn = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
  model.compile(optimizer='adam',
                loss=loss_fn,
                metrics=['accuracy'])
  return model

# %%
def trainModel(model, data_train, label_train):
  model.fit(data_train, label_train, epochs=10, verbose=0)
  return model

# %%
def flattenWeights(model):
  arr = np.array(model.get_weights())
  for i in range (0, len(arr)):
          arr[i] = arr[i].flatten()

  arr = np.concatenate(arr)
  list = arr.tolist()
  return list

# %%
def rebuildModel(list):
  new_model = createModel()
  start = 0
  for i in range (0, len(new_model.layers)):
      bound = np.array(new_model.layers[i].get_weights()).size
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
# %%

################################
# 1) Training
################################
data_train, label_train = reshapeData(1)
list_string = read_weights(2)
list = list_string.split(",")
list = [float(i) for i in list] 
model = rebuildModel(list)
model = trainModel(model, data_train, label_train)

# ################################
# # 2) Flattening
# ################################
list = flattenWeights(model)
send_to_node(list)
# import validate
# validate.validate(list)
# %%
