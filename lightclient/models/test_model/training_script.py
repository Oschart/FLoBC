
#In[1]
import sys
import pandas as pd
import numpy as np
#ln[3]
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

dataset = pd.read_csv(sys.argv[1])
if len(dataset) == 0:
    raise Exception('Empty dataset')
# %%
# first neural network with keras tutorial
from numpy import loadtxt
from keras.models import Sequential
from keras.layers import Dense
# load the dataset
# split into input (X) and output (y) variables
X = dataset.iloc[:,0:8]
y = dataset.iloc[:,8]
# define the keras model
model = Sequential()
model.add(Dense(12, input_dim=8, activation='relu'))
model.add(Dense(8, activation='relu'))
model.add(Dense(1, activation='sigmoid'))
# compile the keras model
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
# fit the keras model on the dataset
model.fit(X, y, epochs=150, batch_size=10)
# evaluate the keras model
_, accuracy = model.evaluate(X, y)
print('Accuracy: %.2f' % (accuracy*100))
# %%
print(model.summary())
# %%

# %%
arr = np.array(model.get_weights())

for i in range (0, len(arr)):
    arr[i] = arr[i].flatten()

arr = np.concatenate(arr)
list = arr.tolist()
list = list[0:4061]
# print(list)
send_to_node(list)
# %%
