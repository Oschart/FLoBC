# %%
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Dropout, Flatten, MaxPooling2D
from utils import send_to_node, read_input, read_weights, flattenWeights, trainModel, rebuildModel, readNewModel_flag

# %%
def reshapeData(index):
    df = read_input(index)
    df = df.head(int(len(df) * 0.9))
    df = df.sample(int(0.7*len(df)))
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
    # model.add(Dense(128, activation=tf.nn.relu))
    model.add(Dense(16, activation=tf.nn.relu))
    model.add(Dropout(0.2))
    model.add(Dense(10,activation=tf.nn.softmax))
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

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

# import validate
# validate.validate(list)