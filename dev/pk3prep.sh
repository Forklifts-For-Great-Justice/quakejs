#!/bin/bash

if [ -z "$1" ] ; then
	echo "Usage: $0 <path>"
	echo "  Finds .pk3 files without a crc32 prefix and creates links as necessary."
	exit 1;
fi
cd "$1"

for i in assets/*/pak*.pk3 ; do
	crc="$(crc32 $i)"
	number="$(printf "%d" "0x${crc}")"

	dir="$(dirname $i)"
	base="$(basename $i)"

	ln -v $dir/$base $dir/$number-$base
done
