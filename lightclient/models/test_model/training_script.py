
#In[1]
import sys
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import tensorflow as tf

# Formatted print back to node
def send_to_node(update_vector):
    if len(update_vector) == 0:
        print("VECTOR[]ENDVECTOR")
    else:
        print("VECTOR[", end='')
        for i in range(len(update_vector) - 1):
            print(update_vector[i], end=',')
        print(update_vector[-1], end='')
        print("]ENDVECTOR")

if len(sys.argv) < 2:
    raise Exception('No dataset path found')

data_train = pd.read_csv(sys.argv[1])
if len(data_train) == 0:
    raise Exception('Empty dataset')

#In[2]
# data_train = pd.read_csv("resized_train.csv")
label_train = data_train.iloc[:, 0]
label_train = label_train.to_numpy()
data_train = data_train.drop(data_train.columns[0], axis = 1)
data_train = data_train.values.reshape(data_train.shape[0], 20, 20)

#In[4]
# Reshaping the array to 4-dims so that it can work with the Keras API
data_train = data_train.reshape(data_train.shape[0], 20, 20, 1)
input_shape = (20, 20, 1)
# Making sure that the values are float so that we can get decimal points after division
data_train = data_train.astype('float32')
# Normalizing the RGB codes by dividing it to the max RGB value.
data_train /= 255

#In[5]
model = tf.keras.models.Sequential([
  tf.keras.layers.Flatten(input_shape=(20, 20)),
  # tf.keras.layers.Dense(10, activation='relu'),
  # tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Dense(10)
])

# %%
predictions = model(data_train[:1]).numpy()
tf.nn.softmax(predictions).numpy()

loss_fn = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
# %%
model.compile(optimizer='adam',
              loss=loss_fn,
              metrics=['accuracy'])
# %%
model.fit(data_train, label_train, epochs=20, verbose = 0)

# %%
arr = np.array(model.get_weights())

for i in range (0, len(arr)):
        arr[i] = arr[i].flatten()

arr = np.concatenate(arr)
list = arr.tolist()
send_to_node(list)
# %%
