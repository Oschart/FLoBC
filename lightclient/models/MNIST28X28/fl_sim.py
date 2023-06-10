import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from utils import flattenWeights, trainModel, rebuildModel, BO
from fed_avg import read_weights_file, federated_averaging
from training_script import *
import warnings
import os
import sys

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"      # To disable using GPU
warnings.filterwarnings('ignore')

INPUT_SHAPE = (28, 28, 1)

NUM_CLIENTS = int(sys.argv[4])

def split_data(df):
    df = df.sample(int(0.3*len(df)))
    label = df.iloc[:, 0]
    label = label.to_numpy()
    df = df.drop(df.columns[0], axis=1)
    df = df.values.reshape(df.shape[0], *INPUT_SHAPE)
    df = df.astype('float32')
    df /= 255
    return df, label

# load the csv file
df = pd.read_csv('/home/seif/Documents/FLoBC/FLoBC/lightclient/models/MNIST28X28/data.csv')

# split the data into NUM_CLIENTS parts randomly
# percentages = [0.6, 0.2, 0.8, 0.6, 0.2, 0.8, 0.6, 0.2, 0.8, 0.7]  # Split into 60%, 20%, and 20% respectively

# percentages = percentages[:NUM_CLIENTS]

# segment_indices = [int(len(df) * p) for p in percentages]
# segment_indices.append(len(df))  # Add the last index for slicing

# # Split the DataFrame into segments
# split_data_list = []
# for i in range(NUM_CLIENTS):
#     start_index = segment_indices[i]
#     end_index = segment_indices[i + 1]
#     segment = df.iloc[start_index:end_index]
#     segment.reset_index(drop=True, inplace=True)
#     split_data_list.append(segment)

# if NUM_CLIENTS == 1:
split_data_list = np.array_split(df, NUM_CLIENTS)

# save each part to a separate file
for i, data in enumerate(split_data_list):
    data_train, label_train = split_data(data)
    model = createModel()

    bo_model = BO(model, data_train, label_train)
    #gd_model,_ = trainModel(model, data_train, label_train)
    
    bo_weights_list = flattenWeights(bo_model)
    #gd_weights_list = flattenWeights(gd_model)

    delimiter = "|"

    with open('./weights/'+f'{NUM_CLIENTS}/BO/'+f'weights_{i}.txt',"w") as f:
        weights_str = delimiter.join(str(w) for w in bo_weights_list)
        f.write(weights_str)
    
    # with open('./weights/'+f'{NUM_CLIENTS}/GD/'+f'weights_{i}.txt',"w") as f:
    #     weights_str = delimiter.join(str(w) for w in gd_weights_list)
    #     f.write(weights_str)


# do fed avg for all the weights and save the result to a file 
bo_all_weights = []
gd_all_weights = []

for i in range(0,NUM_CLIENTS-1):
    filename = './weights/'+f'{NUM_CLIENTS}/BO/'+f'weights_{i}.txt'
    l = read_weights_file(filename)
    bo_all_weights.append(l)

bo_averaged_weights = federated_averaging(bo_all_weights)


# for i in range(0,NUM_CLIENTS-1):
#     filename = './weights/'+f'{NUM_CLIENTS}/GD/'+f'weights_{i}.txt'
#     l = read_weights_file(filename)
#     gd_all_weights.append(l)

# gd_averaged_weights = federated_averaging(gd_all_weights)


# rebuild the model from the fed avg weights and evaluate it
bo_list = bo_averaged_weights
bo_model = createModel()
bo_model = rebuildModel(bo_model, bo_list)

# gd_list = gd_averaged_weights
# gd_model = createModel()
# gd_model = rebuildModel(gd_model, gd_list)

data = pd.read_csv('mnist_test.csv')

y_test = data['label']

X_test = data.drop('label', axis=1)

X_test = np.reshape(X_test, (-1, 28, 28, 1))

print("BO accuracy: ", bo_model.evaluate(X_test, y_test, verbose = 0))
#print("GD accuracy: ", gd_model.evaluate(X_test, y_test, verbose = 0))

with open('./weights/'+f'{NUM_CLIENTS}/'+f'performance.txt',"w") as f:
    bo_acc = "BO accuracy: " + str(bo_model.evaluate(X_test, y_test, verbose = 0)[1]) + "\n"
    f.write(bo_acc)
    # gd_acc = "GD accuracy: " + str(gd_model.evaluate(X_test, y_test, verbose = 0)[1])
    # f.write(gd_acc)



# save the fed avg weights to a file
delimiter = "|"
with open('./weights/'+f'{NUM_CLIENTS}/BO/'+f'weights_fed_avg.txt',"w") as f:
    weights_str = delimiter.join(str(w) for w in bo_averaged_weights)
    f.write(weights_str)

# with open('./weights/'+f'{NUM_CLIENTS}/GD/'+f'weights_fed_avg.txt',"w") as f:
#     weights_str = delimiter.join(str(w) for w in gd_averaged_weights)
#     f.write(weights_str)
