#!/bin/sh

# Add -s LINKABLE=1 to SERVER_LDFLAGS. This is necessary to get Emscripten to
# correctly export things via EXPORTED_FUNCTIONS. Without this, we get
# 'unresolved symbol: Com_Printf' and stuff.
sed -i -e 's/INVOKE_RUN=1/& -s LINKABLE=1/' Makefile
sed -i -e 's/INVOKE_RUN=0/& -s LINKABLE=1 -g4/' Makefile

# Export syscall()
sed -i -e "/EXPORTED_FUNCTIONS=/ { s/]/, '_Con_ToggleConsole_f']/ }" Makefile
sed -i -e "/SYSC__deps:/ { s/]/, '_Con_ToggleConsole_f']/ }" code/sys/sys_common.js

# Short-circuit EULA prompt. We accept.
sed -i -e '/PromptEULA: function/ { s/$/ return callback();/ }' code/sys/sys_node.js
