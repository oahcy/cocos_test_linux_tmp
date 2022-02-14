set(CMAKE_SYSTEM_NAME QNX)

set(arch gcc_ntoaarch64le)
set(ntoarch arch64le)
set(QNX_PROCESSOR arch64le)

set(CMAKE_C_COMPILER qcc)
set(CMAKE_C_COMPILER_TARGET ${arch})

set(CMAKE_CXX_COMPILER q++ -V${arch}_cxx -D_QNX_SOURCE )
set(CMAKE_CXX_COMPILER_TARGET ${arch})

set(CMAKE_ASM_COMPILER qcc -V${arch})
set(CMAKE_ASM_DEFINE_FLAG "-Wa,--defsym,")

set(CMAKE_RANLIB $ENV{QNX_HOST}/usr/bin/nto${ntoarch}-ranlib
    CACHE PATH "QNX ranlib Program" FORCE)
set(CMAKE_AR $ENV{QNX_HOST}/usr/bin/nto${ntoarch}-ar
    CACHE PATH "QNX qr Program" FORCE)