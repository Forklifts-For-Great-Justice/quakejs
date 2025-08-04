#!/bin/sh

set -e
set -x

MAKE_JOBS="${MAKE_JOBS:-12}"

export BUILD_DIR=${BUILD_DIR:=build}

if [ ! -f "${HOME}/.emscripten" ] ; then
  env PATH=${LLVM}:$PATH ${EMSCRIPTEN}/emcc --generate-config
fi

# Build the 'release' otherwise exported functions like Z_Malloc get renamed
# Z_MallocDebug and emscripten can't find them.
env PATH=${LLVM}:$PATH ${EMSCRIPTEN}/emmake \
  make PLATFORM=js EMSCRIPTEN=${EMSCRIPTEN} \
    BUILD_SERVER=1 BUILD_CLIENT=1 BUILD_GAME_QVM=1 BUILD_GAME_SO=0 \
    release -j${MAKE_JOBS}

# Patch the build
# Remove a line that causes a crash on startup
# Error was:
# >   /tmp/ioq3/build/release-js-js/ioq3ded.js:5320
# >           if(!window.getUserMedia) {
# >           ^
# >  
# >   ReferenceError: window is not defined
sed -i -e '/function Module_getUserMedia()/d' ${BUILD_DIR}/release-js-js/ioq3ded.js

# emscripten incorrectly changes the name of some function variables for some reason.
# Fix it here, and without this fix, javascript errors with "ReferenceError: Can't find variable: id"
sed -i -re 's/(_emscripten_glGetObjectParameteriv_emscripten_glGetObjectParameterivid|_emscripten_glDeleteObject_emscripten_glDeleteObjectid|_emscripten_glGetObjectParameteriv_emscripten_glGetObjectParameterivid)/id/' ${BUILD_DIR}/release-js-js/ioquake3.js

# In the WebAudio api, `setVelocity` no longer exists?
# In the upstream quakejs pre-built code, any lines calling 'setVelocity' are
# commented out; seemingly by hand.
# Comment out any lines that invoke this.
sed -i -re 's@ *.*(panner|listener).setVelocity@//&@' ${BUILD_DIR}/release-js-js/ioquake3.js
