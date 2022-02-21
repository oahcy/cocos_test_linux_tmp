adb=/c/Users/Administrator/AppData/Local/Android/Sdk/platform-tools/adb.exe
thrid_path=/d/code/engine-native2/engine-native/external/qnx/lib
${adb} root
${adb} push ./res_eclipse/proj/test-cases //data
${adb} shell chmod +x //data/test-cases
