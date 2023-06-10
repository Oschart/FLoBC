#!/bin/bash

for i in {1..10}
do
    /bin/python3 fl_sim.py false data.csv weights.txt $i
done
