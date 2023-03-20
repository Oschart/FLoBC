# %%
import sys
import pandas as pd
import numpy as np
import GPyOpt
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import accuracy_score
# %%
################################
# Formatted print back to node
################################
def send_to_node(newModel_flag, initial_model, update_vector):
    if len(update_vector) == 0:
        print("VECTOR[]ENDVECTOR")
    else:
        print(len(update_vector))
        print(len(initial_model))
        print("VECTOR[", flush=True, end="")
        if newModel_flag:
            for i in range(len(update_vector) - 1):
                print(update_vector[i], flush=True, end=",")
            print(update_vector[-1], flush=True, end="")
        else:
            for i in range(len(update_vector) - 1):
                print(update_vector[i] - initial_model[i], flush=True, end=",")
            print(update_vector[-1] - initial_model[-1], flush=True, end="")
        print("]ENDVECTOR",end="\n",flush=True)
# %%
################################
# Reading dataframe
################################
def read_input(index):
    if len(sys.argv) < (index+1):
        raise Exception('No dataset path found')

    df = pd.read_csv(sys.argv[index])
    # df = pd.read_csv("data.csv")
    if len(df) == 0:
        raise Exception('Empty dataset')
    return df

# %%
def readNewModel_flag(index):
    if len(sys.argv) < (index+1):
        raise Exception('No new model flag found')
    
    return sys.argv[index]

# %%
################################
# Reading weights list
################################
def read_weights(index):
    if len(sys.argv) < (index+1):
        raise Exception('No weights list found')

    weights_list_path = sys.argv[index]
    weights_list = open(weights_list_path, "r").readline().split("|")
    if len(weights_list) == 0:
        raise Exception('Empty weights list')
    weights_list = [float(i) for i in weights_list] 
    return weights_list

# %%
def flattenWeights(model):
  arr = np.array(model.get_weights())
  for i in range (0, len(arr)):
          arr[i] = arr[i].flatten()

  arr = np.concatenate(arr)
  list = arr.tolist()
  return list

# %%
def trainModel(model, data_train, label_train):
    model.fit(data_train, label_train, epochs=1, verbose=1)
    loss, accuracy = model.evaluate(data_train, label_train, verbose=0)
    return model, loss

# %%
def rebuildModel(new_model, list):
    # if (newModel_flag):
    #     list = []
    #     np.random.seed(0)
    #     list = np.random.uniform(low = -0.09, high = 0.09, size = new_model.count_params()).tolist()
    start = 0
    for i in range (0, len(new_model.layers)):
        bound = np.array(new_model.layers[i].get_weights(), dtype="object").size
        weights = []
        for j in range (0, bound):
            size = (new_model.layers[i].get_weights()[j]).size
            arr = np.array(list[start:start+size])
            arr = arr.reshape(new_model.layers[i].get_weights()[j].shape)
            weights.append(arr)
            start += size
        if (bound > 0):
            new_model.layers[i].set_weights(weights)
    return new_model

#%%
# Define the objective function to be optimized
def objective_function(hyperparameters, X_train, y_train, X_valid, y_valid):
    
    #kernel allows for a very flexible function that can model a wide variety of functions..
    kernel = RBF(length_scale=hyperparameters['length_scale'])
    
    regressor = GaussianProcessRegressor(kernel=kernel)
    regressor.fit(X_train, y_train)
    y_pred = regressor.predict(X_valid)
    score = accuracy_score(y_valid, y_pred.round())
    return score

#%%
# Define the RFMS-BO algorithm
def rfms_bo(X, y, kernel=None, num_iters=10):
    if kernel is None:
        kernel = RBF()

    # Initialize the GP with the initial set of hyperparameters
    gp = GaussianProcessRegressor(kernel=kernel)
    gp.fit(X, y)

    # Run the RFMS-BO algorithm for the specified number of iterations
    for i in range(num_iters):
        # Select the next hyperparameters to evaluate using expected improvement
        x_next = None # TODO: Implement selection of next hyperparameters

        # Evaluate the model with the selected hyperparameters
        y_next = None # TODO: Implement evaluation of model with selected hyperparameters

        # Add the new hyperparameters and their corresponding performance to the training data
        X = np.vstack((X, x_next))
        y = np.append(y, y_next)

        # Retrain the GP on the expanded dataset
        gp.fit(X, y)

    # Return the best hyperparameters found by the algorithm
    return X[np.argmax(y)]
