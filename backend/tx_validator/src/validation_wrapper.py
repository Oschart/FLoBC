import sys
import numpy as np
import pandas as pd 

MODELS_DIR = '../src/models/'

# Hardcoded
model_id = 'mnist'

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
    print("RETURN" + score + "ENDRETURN")


#data_validation = pd.read_csv(data_dir)
gradients = parse_gradients(sys.argv[2])
min_score = float(sys.argv[3])

score = model_mod.compute_validation_score(gradients, data_dir)

is_valid = score >= min_score

send_valid(is_valid)

'''

# TODO: Validation using data_validation and gradients vector
# Call "send_valid" with True if valid and False otherwise

# Placeholder: valid vector only if all are below 1
if max(gradients >= 1.0):
    send_valid(False)
else: 
    send_valid(True)

'''