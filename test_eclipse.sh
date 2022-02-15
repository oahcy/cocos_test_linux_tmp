cmake -S"./" -B"./res_eclipse/proj" -DRES_DIR="./res_eclipse" -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON -DCMAKE_BUILD_TYPE=Debug -G "Eclipse CDT4 - Unix Makefiles" -DCMAKE_TOOLCHAIN_FILE=./qnx.cmake
cmake --build ./res_eclipse/proj/
