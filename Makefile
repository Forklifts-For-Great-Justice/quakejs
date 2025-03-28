ifndef IOQ3
  $(error Error: IOQ3 path is not set. Set IOQ3= variable to root directory of IOQ3 source tree.)
endif

default: pak

setup:
	sh html/get_assets.sh

run:
	docker-compose up

pak: target=base/hf/pak100.pk3
pak: check_ioq3
pak:
	make -C "${IOQ3}" release TOOLS_CC=$(CC) \
		BUILD_SERVER=0 BUILD_CLIENT=0 BUILD_GAME_SO=0 BUILD_GAME_QVM=1
	@[ -d "$$(dirname "$(target)")" ] || mkdir "$$(dirname "$(target)")"
	@echo "Updating $(target) with qvm files from ${IOQ3}/build/release/linux-x86_64/baseq3"
	@fullpath="$$(pwd)/$(target)"; (cd $(IOQ3)/build/release-linux-x86_64/baseq3; zip -Dur "$$fullpath" vm); x=$$?; [ "$$x" -eq 0 -o "$$x"  -eq 12 ] || exit $$x


.PHONY: pak

check_ioq3:
	[ -d "$(IOQ3)" -a -f "$(IOQ3)/code/qcommon/common.c" ] || echo "IOQ3 directory seems... wrong?"

