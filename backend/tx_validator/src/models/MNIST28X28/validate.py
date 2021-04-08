#In[1]
import sys
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Dropout, Flatten, MaxPooling2D

# %%
################################
# Reading dataframe
################################
def read_input(data_dir):
    #if len(sys.argv) < 2:
    #    raise Exception('No dataset path found')

    df = pd.read_csv(data_dir)
    # df = pd.read_csv("resized_test.csv")
    if len(df) == 0:
        raise Exception('Empty dataset')
    return df

# %%
################################
# Reshaping input
################################
# %%
def reshapeData(index):
    df = read_input(index)
    label = df.iloc[:, 0]
    label = label.to_numpy()
    df = df.drop(df.columns[0], axis = 1)
    df = df.values.reshape(df.shape[0], 28, 28, 1)

    # df = df.reshape(df.shape[0], 20, 20, 1)
    # Making sure that the values are float so that we can get decimal points after division
    df = df.astype('float32')
    # Normalizing the RGB codes by dividing it to the max RGB value.
    df /= 255
    return df, label

# %%
def createModel():
    # Creating a Sequential Model and adding the layers
    model = Sequential()
    input_shape = (28, 28, 1)
    model.add(Conv2D(28, kernel_size=(3,3), input_shape=input_shape))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Flatten()) # Flattening the 2D arrays for fully connected layers
    model.add(Dense(128, activation=tf.nn.relu))
    model.add(Dense(16, activation=tf.nn.relu))
    model.add(Dropout(0.2))
    model.add(Dense(10,activation=tf.nn.softmax))
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

# %%
def evaluateModel(model, data_test, label_test):
  results = model.evaluate(data_test, label_test, verbose=2)
  # Return accuracy
  return results[1]


# %%
def rebuildModel(flat_model):
  new_model = createModel()
  start = 0
  for i in range (0, len(new_model.layers)):
      bound = np.array(new_model.layers[i].get_weights()).size
      weights = []
      for j in range (0, bound):
        size = (new_model.layers[i].get_weights()[j]).size
        arr = np.array(flat_model[start:start+size])
        arr = arr.reshape(new_model.layers[i].get_weights()[j].shape)
        weights.append(arr)
        start += size
      if (bound > 0):
        new_model.layers[i].set_weights(weights)
  return new_model
# %%

################################
# Validation score
################################
def compute_validation_score(flat_model, data_dir):
  data_test, label_test = reshapeData(data_dir)
  model = rebuildModel(flat_model)
  result = evaluateModel(model, data_test, label_test)
  print(result)
  return result
# %%