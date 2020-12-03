import sys
import numpy as np
import pandas as pd 

MODELS_DIR = '../src/models/'

# Hardcoded
model_id = 'mnist'

data_dir = MODELS_DIR + model_id + '/data.csv'


import importlib
model_mod = importlib.import_module('models.%s.validate'%model_id)

def parse_vector(model_weights):
    split = model_weights.split("|")
    split = [float(element) for element in split]
    return np.array(split)


def send_score(score):
    print("RETURN" + score + "ENDRETURN")
    #print(score)


# data_validation = pd.read_csv(data_dir)
with open('../dist/temp_cache.txt', 'r') as file:
    base_model_str = file.read().replace('\n', '')

base_model = parse_vector(base_model_str)
score = model_mod.compute_validation_score(base_model, data_dir)
score = str(score)

send_score(score)
