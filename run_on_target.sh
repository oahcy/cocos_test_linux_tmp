#!/bin/sh
LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/nfs
kill -9 24595
./test-cases