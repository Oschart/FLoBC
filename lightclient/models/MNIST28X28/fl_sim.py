import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Dropout, Flatten, MaxPooling2D
from utils import *
import warnings
import logging
import os

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"      # To disable using GPU
tf.get_logger().setLevel('ERROR')
warnings.filterwarnings('ignore')

INPUT_SHAPE = (28, 28, 1)
NUM_CLIENTS = 10

def split_data(df):
    df = df.sample(int(0.3*len(df)))
    label = df.iloc[:, 0]
    label = label.to_numpy()
    df = df.drop(df.columns[0], axis=1)
    df = df.values.reshape(df.shape[0], *INPUT_SHAPE)
    # Making sure that the values are float so that we can get decimal points after division
    df = df.astype('float32')
    # Normalizing the RGB codes by dividing it to the max RGB value.
    df /= 255
    return df, label

def createModel():
    # Creating a Sequential Model and adding the layers
    model = Sequential()
    model.add(Conv2D(28, kernel_size=(3,3), input_shape=INPUT_SHAPE))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Flatten()) # Flattening the 2D arrays for fully connected layers
    model.add(Dense(128, activation=tf.nn.relu))
    model.add(Dense(16, activation=tf.nn.relu))
    model.add(Dropout(0.2))
    model.add(Dense(10,activation=tf.nn.softmax))
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

def flattenWeights(model):
  arr = np.array(model.get_weights())
  for i in range (0, len(arr)):
          arr[i] = arr[i].flatten()

  arr = np.concatenate(arr)
  list = arr.tolist()
  return list

# load the csv file
df = pd.read_csv('lightclient/models/MNIST28X28/data.csv')

# split the data into 10 parts
split_data_list = np.array_split(df, NUM_CLIENTS)

# save each part to a separate file
for i, data in enumerate(split_data_list):
    # data.to_csv(f'data_{i}.csv', index=False)
    print(type(data))
    data_train, label_train = split_data(data)
    model = createModel()
    model = BO(model, data_train, label_train)
    
    print(model.get_weights())
    new_list = flattenWeights(model)

    delimiter = "|"

    with open(f'weights_{i}.txt' "w") as f:
        weights_str = delimiter.join(str(w) for w in new_list)
        f.write(weights_str)