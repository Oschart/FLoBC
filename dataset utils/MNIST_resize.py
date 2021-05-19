
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

# %%
from skimage.transform import resize, rescale
from skimage.util import img_as_ubyte

data_train2 = np.zeros(60000 * 20 * 20)
data_train2 = data_train2.reshape(60000, 20, 20)
for i in range (0, data_train.shape[0]): 
    data_train2[i] = rescale(img_as_ubyte(data_train[i]), 0.73, anti_aliasing=False)
    data_train2[i] = img_as_ubyte(data_train2[i])

# %%
data_test2 = np.zeros(10000 * 20 * 20)
data_test2 = data_test2.reshape(10000, 20, 20)
for i in range (0, data_test.shape[0]): 
    data_test2[i] = rescale(img_as_ubyte(data_test[i]), 0.73, anti_aliasing=False)
    data_test2[i] = img_as_ubyte(data_test2[i])
# %%
data_train2 = data_train2.reshape(60000, 20*20)
data_test2 = data_test2.reshape(10000, 20*20)
data_train_new = pd.DataFrame(data_train2)
label_train = pd.DataFrame(label_train)
data_train_new = pd.concat([label_train,data_train_new], axis=1)
data_test_new = pd.DataFrame(data_test2)
label_test = pd.DataFrame(label_test)
data_test_new = pd.concat([label_test,data_test_new], axis=1)

# %%
data_train_new.to_csv('resized_train.csv', index=False)
data_test_new.to_csv('resized_test.csv', index=False)

# %%
