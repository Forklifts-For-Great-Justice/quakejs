#!/bin/sh

set -e
build="build"
pakfile="pak101.pk3"

updated=0

prepare() {
  source="$1"
  target="${build}/$2"
  flags="-vp"
  [ ! -d "$(dirname "$target")" ] && flags="$flags -D"

  if [ "$source" -nt "$target" ] ; then
    updated=1
    install $flags "$source" "$target"
  fi
}

package() {
  (
    cd "${build}"
    set +e
    zip -Dur "${pakfile}" . -x "${pakfile}"
    code=$?
    if [ "$code" -ne 0 -a "$code" -ne 12 ] ; then
      exit "$code"
    fi
  )

  if [ "$updated" -eq 0 ] ; then
    echo "=> ${build}/${pakfile} already up to date"
  else
    echo "=> ${build}/${pakfile} created"
  fi
}

# "Bow to my firewall!" instead of the original "Quad damage!" voice
prepare sounds/bow-to-my-firewall/self.wav sound/items/quaddamage.wav

# Extra sound played when shooting and having quad damage
prepare sounds/bow-to-my-firewall/ahh.wav sound/items/damage3.wav

package
