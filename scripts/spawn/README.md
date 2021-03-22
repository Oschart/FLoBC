## To run:
- Run those scripts from the root FDMMLS directory <br>
``` shell
$ sh spawn.sh -n <number of validators> -t <number of trainers> -p <optional path of output lightclients directory> -c -j -b -l -e <target version OR waiting period> -r -s <sync scheme> -d <sync period>
````
## Arguments:
- -c: [OPTIONAL] to clean blockchain --> default does not clean
- -j: [OPTIONAL] to rebuild backend javascript --> default: does not build
- -b: [OPTIONAL] to buil backend rust --> default: does not build
- -l: [OPTIONAL] to run scripts on linux --> default: MAC
- -n: for number of validators
- -t: for number of trainers
- -p: [OPTIONAL] path for the directory that will include the light client folders --> default is root
- -e: [OPTIONAL] spawns a tracker script for dumping accuracy data when reaching a specific version (positive int) or for a certain number of minutes (negative int)
- -r: [OPTIONAL] When tracking done, will terminate all terminals opened before the tracker, except for the terminal initiating the spawn script
- -s: [OPTIONAL] synchronization scheme "BAP", "BSP", "SSP" --> default is BAP
- -d: [OPTIONAL] duration of 1 training iteration. Needed for BSP and SSP. --> default is 60 seconds
#### You don't need to specify -p if you'll use the lightclient directory and the backend directory in the root
