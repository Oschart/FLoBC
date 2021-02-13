#In[1]
import sys
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import tensorflow as tf
import json
from utils import send_to_node, read_input, read_weights, flattenWeights, trainModel
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

  # df = df.reshape(df.shape[0], 20, 20, 1)
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
# ###############################
# 1) Training
# ###############################
newModel_flag = readNewModel_flag(1)
data_train, label_train = reshapeData(2)
if (not newModel_flag):
    list = read_weights(3)
model = createModel()
model, list = rebuildModel(model, list, newModel_flag)
model = trainModel(model, data_train, label_train)

# ################################
# # 2) Flattening
# ################################
new_list = flattenWeights(model)
send_to_node(list, new_list)

# %%