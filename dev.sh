#!/bin/sh
#

# Prerequisite: Build docker image 'quakebuild'
#
# Development: Compile quake server, client code, and qvm files.
# Testing Deployment: Run quakebuild image with files built from development
# Production Deployment: Run quakebuild image with no changes

HAVE=""

need() {
  if [ "${HAVE%%*:${1}}" != "$HAVE" -o "${HAVE%%*:${1}:*}" != "$HAVE" ]; then
    #echo "Already found $1 in $HAVE" >&2
    return 0
  fi
  check_$1 || fail "$1"
  HAVE="${HAVE}:$1"
  return 0
}

fail() {
  echo "Failure: $@" >&2
  exit 1
}

check_jq() {
  # Is jq usable?
  echo '{ "test": 11 }' | jq -e ".test == 11" > /dev/null 2>&1
}

check_docker() {
  # Check if docker is usable.
  docker ps -n 0 > /dev/null 2>&1
}

check_bash() {
  bash -c 'echo "Hello world"' | grep -qF "Hello world"
}

check_refresh_dev() {
  dockerfile="Dockerfile.quakedev"
  image="quakebuild:dev"

  # This should compile the qvm files and zip them into pak100.pk3
  docker build -f "${dockerfile}" -t "${image}" --progress plain . \
    || fail "Failed to build from ${dockerfile} using local ./ioq3"
}

check_zip() {
  zip -h | grep -q 'Copyright.*Info-ZIP'
}

build_docker_images() {
  need docker
  need jq

  docker build -f ./dev/Dockerfile.quake -t quakebuild --progress plain dev \
    || fail "Failed to build quakebuild image from ./dev/Dockerfile.quake"

  docker build -f ./dev/Dockerfile.assets -t quake-assets --progress plain dev \
    || fail "Failed to build quake-assetes image from ./dev/Dockerfile.assets"

  # Show image build time. Sometimes we may expect a new build, and the
  # CreatedSince will tell us how old the image is. If the image didn't need to
  # be rebuilt (according to 'docker build' then this will show in the creation
  # time.
  echo "Docker images:"
  docker image ls --format json | jq -r '. | select(.Tag == "latest" and (.Repository | test("^quake(-assets|build)$"))) | "  \(.Repository):\(.Tag) (Creation time \(.CreatedSince))"'
}

run_service() {
  need docker
  docker compose up --force-recreate --build
}

build_pk3() {
  need docker
  need refresh_dev

  image="quakebuild:dev"
  
  # Test that the build created /tmp/pak100.pk3
  docker run "${image}" test -f /tmp/pak100.pk3 \
    || fail "After building, didn't find /tmp/pak100.pk3."

  # Check that the right files exist. There should be 3 .qvm files in the .pk3 file.
  docker run "${image}" unzip -l /tmp/pak100.pk3 \
    | awk '/ vm\/(ui|cgame|qagame).qvm$/ { found++ } END { if (found != 3) exit 1 }' \
    || fail "pak100.pk3 file is missing some files. Did the build fail?"

  [ -d "base/hf" ] || mkdir base/hf

  # Fetch the built QVM files out of the docker image
  docker run "${image}" tar -zcC /tmp pak100.pk3 | tar -C base/hf -zxv
  cp -v base/hf/pak100.pk3 assets/hf/pak100.pk3
}

build_client() {
  need docker
  need refresh_dev

  image="quakebuild:dev"

  # Test that the build created ioquake3.js
  docker run "${image}" test -f build/release-js-js/ioquake3.js \
    || fail "After building, didn't find build/release-js-js/ioquake3.js"

  # Fetch the built ioquake3.js out of the docker image
  echo "Copying ioquake3.js to html/"
  docker run "${image}" tar -cC build/release-js-js ioquake3.js | tar -C html -xv
}

build_server() {
  need docker
  need refresh_dev

  image="quakebuild:dev"
  # Test that the build created ioq3ded.js
  docker run "${image}" test -f build/release-js-js/ioq3ded.js \
    || fail "After building, didn't find build/release-js-js/ioq3ded.js"

  # Fetch the built ioq3ded.js out of the docker image
  echo "Copying ioq3ded.js to build/"
  docker run "${image}" tar -cC build/release-js-js ioq3ded.js | tar -xvC build
}

iterate() {
  docker compose down -t 1 
  build_client
  build_pk3
  build_server
  docker compose up -d 
}

if [ "$#" -eq 0 -o "$1" = "--help" -o "$1" = "-h" ]; then
  echo "Usage: $0 <command>"
  cat << HELP
  run                  - runs services in docker compose.
      Port 8080 is html, 9000 is assets, 27690 is quake (via websocket)
      This command automatically builds any necessary docker images.

  Development Commands:
  build-docker-images  - builds the quake server and asset server docker images.

  build-pk3            - builds the hf pk3 files based on code in ./ioq3
      This allows you to build changes locally for testing. 

  build-client         - builds the javascript client (ioquake3.js)
      This allows you to build changes locally for testing. 

  iterate              - rebuild and restart services

  tsc                  - Compile typescript and watch for code changes.

  tsc-test             - Run tests and watch for code changes.
HELP
  exit 0
fi

case "$1" in 
  build-docker-images)
    build_docker_images
    ;;
  build-pk3)
    build_pk3 "$@"
    ;;
  build-client)
    build_client "$@"
    ;;
  build-server)
    build_server "$@"
    ;;
  run)
    run_service
    ;;
  iterate)
    iterate "$@"
    ;;
  tsc)
    npm exec tsc -- --watch
    ;;
  tsc-test)
    # mocha --watch and --node-option=watch don't seem to work with typescript. They crash.
    npm exec mocha -- shenanigans
    ;;
  *)
    echo "Unknown command: $1"
    ;;
esac
