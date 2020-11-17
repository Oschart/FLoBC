
#In[1]
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import tensorflow as tf

#In[2]
data_train = pd.read_csv("mnist_train.csv")
label_train = data_train.iloc[:, 0]
label_train = label_train.to_numpy()
data_train = data_train.drop(data_train.columns[0], axis = 1)
data_train = data_train.values.reshape(data_train.shape[0], 28, 28)

#In[3]
data_test = pd.read_csv("mnist_test.csv")
label_test = data_test.iloc[:, 0]
label_test = label_test.to_numpy()
data_test = data_test.drop(data_test.columns[0], axis = 1)
data_test = data_test.values.reshape(data_test.shape[0], 28, 28)

#In[4]
# Reshaping the array to 4-dims so that it can work with the Keras API
data_train = data_train.reshape(data_train.shape[0], 28, 28, 1)
data_test = data_test.reshape(data_test.shape[0], 28, 28, 1)
input_shape = (28, 28, 1)
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
model = tf.keras.models.Sequential([
  tf.keras.layers.Flatten(input_shape=(28, 28))
#   tf.keras.layers.Dense(10, activation='relu'),
#   tf.keras.layers.Dropout(0.2),
#   tf.keras.layers.Dense(10)
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
model.fit(data_train, label_train, epochs=5)

# %%
model.evaluate(data_test,  label_test, verbose=2)

# %%
model.summary()
# %%
arr = np.array(model.get_weights())

for i in range (0, len(arr)):
        arr[i] = arr[i].flatten()

arr = np.concatenate(arr)
list = arr.tolist()
print(list)
print(len(list))
# %%
