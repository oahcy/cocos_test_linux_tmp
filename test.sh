cmake -S"./" -B"./res/proj" -DRES_DIR="./res" -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -DCMAKE_BUILD_TYPE=Debug -G "Unix Makefiles" -DCMAKE_TOOLCHAIN_FILE=./qnx2.cmake && make -C ./res/proj
