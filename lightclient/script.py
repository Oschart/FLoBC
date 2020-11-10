import sys
import numpy as np

N = 10

if len(sys.argv) > 1:
    temp = int(sys.argv[1])
    N = temp

print(np.random.rand(N))
