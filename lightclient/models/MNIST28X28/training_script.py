# %%
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Dropout, Flatten, MaxPooling2D
from utils import send_to_node, read_input, read_weights, flattenWeights, trainModel, rebuildModel, readNewModel_flag

import warnings
import logging
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"      # To disable using GPU
tf.get_logger().setLevel('ERROR')
warnings.filterwarnings('ignore')

INPUT_SHAPE = (28, 28, 1)

# %%

def reshapeData(index):
    df = read_input(index)
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

def evaluateModel(model, data_test, label_test):
  results = model.evaluate(data_test, label_test, verbose=2)
  # Return accuracy
  return results[1]

def reshapeData_validate(file):
    df = pd.read_csv(file)
    # df = df.tail(int(len(df) * 0.1))
    # df = df.sample(int(0.5*len(df)), random_state=0)
    label = df.iloc[:, 0]
    label = label.to_numpy()
    df = df.drop(df.columns[0], axis = 1)
    df = df.values.reshape(df.shape[0], *INPUT_SHAPE)

    # df = df.reshape(df.shape[0], 20, 20, 1)
    # Making sure that the values are float so that we can get decimal points after division
    df = df.astype('float32')
    # Normalizing the RGB codes by dividing it to the max RGB value.
    df /= 255
    return df, label
# ###############################
# 1) Training
# ###############################
data_test, label_test = reshapeData_validate("models/MNIST28X28/mnist_test.csv")

newModel_flag = readNewModel_flag(1)
data_train, label_train = reshapeData(2)
list = read_weights(3)
model = createModel()
model, list = rebuildModel(model, list)
if not readNewModel_flag:
  result1 = evaluateModel(model, data_test, label_test)
else:
  result1 = 0

model = trainModel(model, data_train, label_train)
# ################################
# # 2) Flattening
# ################################
new_list = flattenWeights(model)
result = evaluateModel(model, data_test, label_test)
send_to_node(newModel_flag, list, new_list, result1, result)