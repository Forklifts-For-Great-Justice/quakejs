#!/bin/sh

while ! curl -q -o /dev/null http://assets:9000/assets/manifest.json; do
  echo "Waiting on asset server to be online"
  sleep 1
done

QUAKE_GAME="${QUAKE_GAME:-baseq3}"
node build/release-js-js/ioq3ded.js +set fs_game "${QUAKE_GAME}" set dedicated 1 +exec server.cfg +set fs_cdn assets:9000
