import sys
import numpy as np
import pandas as pd 
import os
import warnings

import tensorflow as tf

#os.environ["CUDA_VISIBLE_DEVICES"] = "-1"      # To disable using GPU
#tf.get_logger().setLevel('ERROR')
#warnings.filterwarnings('ignore')

MODELS_DIR = '../src/models/'

model_id = sys.argv[6]

data_dir = MODELS_DIR + model_id + '/data.csv'


import importlib
model_mod = importlib.import_module('models.%s.validate'%model_id)

def parse_gradients(gradients_path):
    gradients = open(gradients_path, "r").readline()
    split = gradients.split("|")
    split = [float(element) for element in split]
    return np.array(split)

def send_valid(is_valid):
    verdict = 'valid' if is_valid else 'invalid'
    print("VERDICT" + verdict + "ENDVERDICT")

def send_score(score):
    print("SCORE" + str(score) + "ENDSCORE")

#data_validation = pd.read_csv(data_dir)
gradients = parse_gradients(sys.argv[4])
newModel_flag = str(sys.argv[1])
if (newModel_flag == "true"):
    newModel_flag = 1
elif (newModel_flag == "false"):
    newModel_flag = 0
else:
    newModel_flag = int(newModel_flag)

if newModel_flag:
    evaluate_model = gradients
else:
    base_model = parse_gradients(sys.argv[3])
    evaluate_model = base_model + gradients

# if newModel_flag:
#     np.random.seed(0)
#     base_model = np.random.uniform(low = -0.09, high = 0.09, size = len(gradients)).tolist()
# else: 
#     base_model = parse_gradients(sys.argv[3])
min_score = float(sys.argv[5])
# evaluate_model = base_model + gradients
score = model_mod.compute_validation_score(evaluate_model, data_dir)

is_valid = score >= min_score

send_valid(is_valid)
send_score(score)

'''

# TODO: Validation using data_validation and gradients vector
# Call "send_valid" with True if valid and False otherwise

# Placeholder: valid vector only if all are below 1
if max(gradients >= 1.0):
    send_valid(False)
else: 
    send_valid(True)

'''
