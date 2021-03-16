## To run:
- Run those scripts from the root FDMMLS directory
sh spawn.sh -n <number of validators> -t <number of trainers> -p <path of output lightclients directory> -c -j -b -l -e <target version OR waiting period> -r

## Arguments:
- -c: to clean blockchain
- -j: to rebuild backend javascript
- -b: to buil backend rust
- -l: to run scripts on linux
- -n: for number of validators
- -t: for number of trainers
- -p: path for the directory that will include the light client folders
- -e: spawns a tracker script for dumping accuracy data when reaching a specific version (positive int) or for a certain number of minutes (negative int)
- -r: When tracking done, will terminate all terminals opened before the tracker, except for the terminal initiating the spawn script

#### You don't need to specify -p if you'll use the lightclient directory and the backend directory in the root