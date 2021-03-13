## To run:

sh spawn.sh -n <number of validators> -t <number of trainers> -p <path of output lightclients directory> -c -j -b -l

## Arguments:
- -c: to clean blockchain
- -j: to rebuild backend javascript
- -b: to buil backend rust
- -l: to run scripts on linux
- -n: for number of validators
- -t: for number of trainers
- -p: path for the directory that will include the light client folders

#### You don't need to specify -p if you'll use the lightclient directory and the backend directory in the root