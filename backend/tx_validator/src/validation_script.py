import sys
import numpy as np
import pandas as pd 

def parse_gradients(gradients):
    split = gradients.split("|")
    split = [float(element) for element in split]
    return np.array(split)

def send_valid(is_valid):
    verdict = 'valid' if is_valid else 'invalid'
    print("VERDICT" + verdict + "ENDVERDICT")


data_validation = pd.read_csv(sys.argv[1])
gradients = parse_gradients(sys.argv[2])

# TODO: Validation using data_validation and gradients vector
# Call "send_valid" with True if valid and False otherwise

# Placeholder: valid vector only if all are below 1
if max(gradients >= 1.0):
    send_valid(False)
else: 
    send_valid(True)
