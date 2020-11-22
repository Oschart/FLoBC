
#In[1]
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import tensorflow as tf

#In[2]
################################
## Read train set
################################
data_train = pd.read_csv("resized_train.csv")
label_train = data_train.iloc[:, 0]
label_train = label_train.to_numpy()
data_train = data_train.drop(data_train.columns[0], axis = 1)
data_train = data_train.values.reshape(data_train.shape[0], 20, 20)

#In[3]
################################
## Read test set
################################
data_test = pd.read_csv("resized_test.csv")
label_test = data_test.iloc[:, 0]
label_test = label_test.to_numpy()
data_test = data_test.drop(data_test.columns[0], axis = 1)
data_test = data_test.values.reshape(data_test.shape[0], 20, 20)

#In[4]
################################
## Reshape data
################################
# Reshaping the array to 4-dims so that it can work with the Keras API
data_train = data_train.reshape(data_train.shape[0], 20, 20, 1)
data_test = data_test.reshape(data_test.shape[0], 20, 20, 1)
input_shape = (20, 20, 1)
# Making sure that the values are float so that we can get decimal points after division
data_train = data_train.astype('float32')
data_test = data_test.astype('float32')
# Normalizing the RGB codes by dividing it to the max RGB value.
data_train /= 255
data_test /= 255
print('x_train shape:', data_train.shape)
print('Number of images in x_train', data_train.shape[0])
print('Number of images in x_test', data_test.shape[0])

#In[5]
################################
## Create model and loss function
################################
model = tf.keras.models.Sequential([
  tf.keras.layers.Flatten(input_shape=(20, 20)),
  # tf.keras.layers.Dense(10, activation='relu'),
  # tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Dense(10)
])

predictions = model(data_train[:1]).numpy()
tf.nn.softmax(predictions).numpy()
loss_fn = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)

model.compile(optimizer='adam',
              loss=loss_fn,
              metrics=['accuracy'])
model.evaluate(data_test,  label_test, verbose=2)

# %%
################################
## Train model
################################
model.fit(data_train, label_train, epochs=20)

# %%
################################
## Validate model
################################
model.evaluate(data_test,  label_test, verbose=2)

# %%
model.summary()
# %%
################################
## Flatten model weights
################################
arr = np.array(model.get_weights())
for i in range (0, len(arr)):
        arr[i] = arr[i].flatten()

arr = np.concatenate(arr)
list = arr.tolist()
print(list)
print(len(list))
# %%
################################
## Compile model from 1D list of weights
################################
new_model = tf.keras.models.Sequential([
  tf.keras.layers.Flatten(input_shape=(20, 20)),
  # tf.keras.layers.Dense(10, activation='relu'),
  # tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Dense(10)
])
new_model.compile(optimizer='adam',
              loss=loss_fn,
              metrics=['accuracy'])
new_model.evaluate(data_test,  label_test, verbose=2)
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

new_model.evaluate(data_test,  label_test, verbose=2)
# %%
