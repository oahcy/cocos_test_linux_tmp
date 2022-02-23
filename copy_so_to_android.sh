!#/bin/sh
set -x
adb=/c/Users/Administrator/AppData/Local/Android/Sdk/platform-tools/adb.exe
thrid_path=/d/code/engine-native2/engine-native/external/qnx/lib
sys_lib_path=/d/QNX/qnx710_3/target/qnx7/aarch64le/usr/lib
sys_path=/d/QNX/qnx710_3/target/qnx7/aarch64le

${adb} root
${adb} push ${thrid_path}/openal-soft/libopenal.so.1 //data
${adb} push ${thrid_path}/curl/libcurl.so //data
${adb} push ${thrid_path}/sdl2/libSDL2-2.0.so.16 //data
${adb} push ${thrid_path}/cairo/libcairo.so //data/libcairo.so.11706

#system so
${adb} push ${sys_lib_path}/libpixman-1.so.40 //data
${adb} push ${sys_lib_path}/libfontconfig.so.1 //data
${adb} push ${sys_lib_path}/libxml2.so.2 //data
${adb} push ${sys_lib_path}/libfreetype.so.23 //data
${adb} push ${sys_lib_path}/libiconv.so.1 //data
${adb} push ${sys_lib_path}/liblzma.so.5 //data
${adb} push ${sys_lib_path}/libbz2.so.1 //data

#system bin
# http://www.qnx.com/developers/docs/7.0.0/index.html#com.qnx.doc.ide.userguide/topic/host_target_comm_serial.html
# Serial communications
${adb} push ${sys_path}/bin/stty //data
${adb} shell chmod +x //data/stty
${adb} push ${sys_path}/bin/mkdir //data
${adb} shell chmod +x //data/mkdir
${adb} push ${sys_path}/bin/mv //data
${adb} shell chmod +x //data/mv
${adb} push ${sys_path}/bin/ps //data
${adb} shell chmod +x //data/ps
${adb} push ${sys_path}/usr/bin/pdebug //data
${adb} shell chmod +x //data/pdebug
${adb} push ./run_on_target.sh //data
${adb} shell chmod +x //data/run_on_target.sh
${adb} push ./hello_world //data
${adb} shell chmod +x //data/hello_world
