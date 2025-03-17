#!/bin/sh

while ! curl -q -o /dev/null http://assets:9000/assets/manifest.json; do
  echo "Waiting on asset server to be online"
  sleep 1
done

node build/ioq3ded.js +set fs_game baseq3 set dedicated 1 +exec server.cfg +set fs_cdn assets:9000
