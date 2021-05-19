# Experiments Scripts
Run those scripts from the root FDMMLS directory

* spawn.sh script in [spawn directory](./spawn/) spawns the system given number of trainers, validators, synch scheme and period. 
* fixedN.sh script in [exp2 directory](./exp2/) spawns the system with different configurations of trainers and validators given the n number of nodes in the system
* Scripts in [track_plot directory](./track_plot/) are called from the spawn script to track the progress of the system, record the results and stop the system after certain number of iterations. 
