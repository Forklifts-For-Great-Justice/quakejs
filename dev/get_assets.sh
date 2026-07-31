#!/bin/sh

set -e

pak() {
	name="$1"
	shift

	workdir="/tmp/pak-build-${name}"

	mkdir -p "$workdir"

	for i in "$@" ; do
		file="$workdir/$(basename "$i")"
		echo "Assets> Downloading $i"
		curl -C - --retry 3 --retry-delay 10 -o "$file" "$i"
		unzip "$file" -d "$workdir"
		rm "$file"
	done

	# Some paks ship with q3 mod files (qvm).
	# Purge them to prevent them from overriding ours by accident.
	find $workdir -name '*.qvm' -delete

	# Repackage into a single .pak file
	out="$PWD/$name"
	(
		cd $workdir
		zip -r $out .
		ls -ld $out
	)
}

cd assets

[ ! -d "hf" ] && mkdir hf
cd hf

# Fetch high-res asset replacements
if ! echo  "8b703ea3ebe73da409d154f8e14cb836  pak90.pk3" | md5sum -c > /dev/null 2>&1 ; then
	curl -C - --retry 3 --retry-delay 10 -O "https://files.ioquake3.org/xcsv_hires.zip"
	unzip xcsv_hires.zip xcsv_bq3hi-res.pk3
	mv xcsv_bq3hi-res.pk3 pak090.pk3
	rm xcsv_hires.zip
fi

# Pull in missing assets
pak "pak091.pk3" \
	https://q3js.lvlworld.com/assets/baseq3/1091220314-pak100.pk3  \
	https://q3js.lvlworld.com/assets/baseq3/92224616-pak101.pk3 \
	https://q3js.lvlworld.com/assets/baseq3/3150208968-pak102.pk3 \
	https://q3js.lvlworld.com/assets/baseq3/3396967599-pak103.pk3 \
	https://q3js.lvlworld.com/assets/baseq3/117878519-pak104.pk3 \
	https://q3js.lvlworld.com/assets/baseq3/1736309461-pak105.pk3 

# Maps seem more complicated to download because of the way the lvlworld website is setup...
#pak "pak091.pk3" \
	#'https://files.lvlworld.com/q3a/a-f/devoctf1.zip'
  #https://files.lvlworld.com/q3a/m-r/map-13dream_xt.zip
	#ftp://lvlmirror.mhgaming.com/a-f/devoctf1.zip \
	#ftp://lvlmirror.mhgaming.com/m-r/perterbia.zip \
	#ftp://lvlmirror.mhgaming.com/a-f/dead_sphere.zip \
	#ftp://lvlmirror.mhgaming.com/a-f/ct3ctf2.zip \
	#ftp://lvlmirror.mhgaming.com/m-r/map-13dream_xt.zip \
	#ftp://lvlmirror.mhgaming.com/m-r/nijoo_ctf.zip \
	#ftp://lvlmirror.mhgaming.com/a-f/facingworlds.zip

