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

INPUT_SHAPE = (20, 20, 1)

# %%


def reshapeData(index):
    df = read_input(index)
    # df = df.head(int(len(df) * 0.9))
    df = df.sample(int(0.7*len(df)))
    label = df.iloc[:, 0]
    label = label.to_numpy()
    df = df.drop(df.columns[0], axis=1)
    df = df.values.reshape(df.shape[0], *INPUT_SHAPE)

    # df = df.reshape(df.shape[0], 20, 20, 1)
    # Making sure that the values are float so that we can get decimal points after division
    df = df.astype('float32')
    # Normalizing the RGB codes by dividing it to the max RGB value.
    df /= 255
    return df, label

# %%


def createModel():
    # Creating a Sequential Model and adding the layers
    input_shape = INPUT_SHAPE
    model = tf.keras.models.Sequential([
        tf.keras.layers.Flatten(input_shape=INPUT_SHAPE),
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
# ###############################
# 1) Training
# ###############################
newModel_flag = readNewModel_flag(1)
data_train, label_train = reshapeData(2)
list = read_weights(3)
model = createModel()
model, list = rebuildModel(model, list)
model = trainModel(model, data_train, label_train)
# ################################
# # 2) Flattening
# ################################
new_list = flattenWeights(model)
send_to_node(newModel_flag, list, new_list, result)
