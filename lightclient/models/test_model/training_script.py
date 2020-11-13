import sys
import pandas as pd
import numpy as np

# Formatted print back to node
def send_to_node(update_vector):
    if len(update_vector) == 0:
        print("[]")
    else:
        print("[", end='')
        for i in range(len(update_vector) - 1):
            print(update_vector[i], end=',')
        print(update_vector[-1], end='')
        print("]")

if len(sys.argv) < 2:
    raise Exception('No dataset path found')

df = pd.read_csv(sys.argv[1])
if len(df) == 0:
    raise Exception('Empty dataset')

# TODO: training and all
update_vector = df.iloc[0].to_numpy()

# returning the array
send_to_node(update_vector)
