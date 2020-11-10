import sys
import pandas as pd

if len(sys.argv) < 2:
    raise Exception('No dataset path found')

df = pd.read_csv(sys.argv[1])
if len(df) == 0:
    raise Exception('Empty dataset')

# TODO: training and all
update_vector = df.iloc[0].to_numpy()

# returning the array
print(update_vector)
