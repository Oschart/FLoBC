
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
# Importing the required Keras modules containing model and layers
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Dropout, Flatten, MaxPooling2D
# Creating a Sequential Model and adding the layers
model = Sequential()
model.add(Conv2D(28, kernel_size=(3,3), input_shape=input_shape))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Flatten()) # Flattening the 2D arrays for fully connected layers
model.add(Dense(128, activation=tf.nn.relu))
model.add(Dropout(0.2))
model.add(Dense(10,activation=tf.nn.softmax))

#In[6]
model.compile(optimizer='adam', 
              loss='sparse_categorical_crossentropy', 
              metrics=['accuracy'])
model.fit(x=data_train,y=label_train, epochs=10)

#In[7]
## Validation
model.evaluate(data_test, label_test)


#In[8]
arr = np.array(model.get_weights())

for i in range (0, len(arr)):
        arr[i] = arr[i].flatten()

arr = np.concatenate(arr)
list = arr.tolist()

# returning the array
print(list)

# %%
