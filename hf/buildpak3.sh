#!/bin/sh

set -e

if [ "$(basename "$0")" != "$0" ] ; then
  dir="$(dirname "$0")"
  echo "=> cd $dir"
  cd "$dir"
fi

build="build"
pakfile="pak101.pk3"

prepare() {
  source="$1"
  target="${build}/$2"

  [ ! -d "$(dirname "$target")" ] && mkdir -p "$(dirname "$target")"
  cp -pu "$source" "$target"
}

package() {
  set +e
  (
    cd "${build}"
    zip -Dur "${pakfile}" . -x "${pakfile}"
  )
  code=$?
  set -e

  case "$code" in
    0) echo "=> ${build}/${pakfile} created" ;;
    12) echo "=> ${build}/${pakfile} already up to date" ;;
    *) 
      echo "=> zip failed, exit code $code"
      exit "$code"
      ;;
  esac
}

# "Bow to my firewall!" instead of the original "Quad damage!" voice
prepare sounds/bow-to-my-firewall/self.wav sound/items/quaddamage.wav

# Extra sound played when shooting and having quad damage
prepare sounds/bow-to-my-firewall/ahh.wav sound/items/damage3.wav

package
