## To run:
- Run those scripts from the root FDMMLS directory <br>
``` shell
$ sh main.sh -n <maximum number of validators> -t <maximum number of trainers> -s <starting number of trainers> -v <starting number of validators> -b -l -e <target version> -r 
````
## Arguments:
- -b: [OPTIONAL] to buil backend rust --> default: does not build
- -l: [OPTIONAL] to run scripts on linux --> default: MAC
- -n: for maximum number of validators
- -t: for maximum number of trainers
- -s: for starting number of trainers
- -v: for starting number of validators
- -e: [OPTIONAL] spawns a tracker script for dumping accuracy data when reaching a specific version (positive int) or for a certain number of minutes (negative int)
- -r: [OPTIONAL] When tracking done, will terminate all terminals opened before the tracker, except for the terminal initiating the spawn script

``` shell
$ sh fixedN.sh -n <number of nodes> -s <starting number of nodes> -b -l -e <target version OR waiting period> -r 
````
## Arguments:
- -b: [OPTIONAL] to buil backend rust --> default: does not build
- -l: [OPTIONAL] to run scripts on linux --> default: MAC
- -n: for maximum number of agents/nodes 
- -s: for starting number of agents/nodes
- -e: [OPTIONAL] spawns a tracker script for dumping accuracy data when reaching a specific version (positive int) or for a certain number of minutes (negative int)
- -r: [OPTIONAL] When tracking done, will terminate all terminals opened before the tracker, except for the terminal initiating the spawn script
