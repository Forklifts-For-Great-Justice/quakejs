ifndef IOQ3
	IOQ3=./ioq3
  #$(error Error: IOQ3 path is not set. Set IOQ3= variable to root directory of IOQ3 source tree.)
endif

default: base/hf/pak100.pk3 assets/hf/pak100.pk3 docker

.PHONY: docker
docker:
	docker build -t quakebuild ./dev

.PHONY: setup
setup:
	sh html/get_assets.sh

run:
	docker-compose up --force-recreate --build

# These two variables copied from ioq3's Makefile
COMPILE_PLATFORM=$(shell uname | sed -e 's/_.*//' | tr '[:upper:]' '[:lower:]' | sed -e 's/\//_/g')
COMPILE_ARCH=$(shell uname -m | sed -e 's/i.86/x86/' | sed -e 's/^arm.*/arm/')

COMPILE_TARGET=$(COMPILE_PLATFORM)-$(COMPILE_ARCH)

QVM_OBJ = $(IOQ3)/build/release-$(COMPILE_TARGET)/baseq3/vm/cgame.qvm $(IOQ3)/build/release-$(COMPILE_TARGET)/baseq3/vm/qagame.qvm $(IOQ3)/build/release-$(COMPILE_TARGET)/baseq3/vm/ui.qvm

$(IOQ3)/build/release-$(COMPILE_TARGET)/baseq3/vm/cgame.qvm: quake_and_bake
$(IOQ3)/build/release-$(COMPILE_TARGET)/baseq3/vm/qagame.qvm: quake_and_bake
$(IOQ3)/build/release-$(COMPILE_TARGET)/baseq3/vm/ui.qvm: quake_and_bake

quake_and_bake:
	make -C "${IOQ3}" release TOOLS_CC=$(CC) \
		BUILD_SERVER=0 BUILD_CLIENT=0 BUILD_GAME_SO=0 BUILD_GAME_QVM=1

.PHONY: quake_and_bake

test:
	@echo $(QVM_OBJ)

base/hf: base
	mkdir $@

base:
	mkdir $@

ioq3/.git:
	git submodule update --init

base/hf/pak100.pk3: target=base/hf/pak100.pk3
base/hf/pak100.pk3: base/hf ioq3/.git
base/hf/pak100.pk3: $(QVM_OBJ)
base/hf/pak100.pk3:
	make check_ioq3
	@[ -d "$$(dirname "$(target)")" ] || mkdir "$$(dirname "$(target)")"
	@echo "Updating $(target) with qvm files from ${IOQ3}/build/release-$(COMPILE_TARGET)/baseq3"
	@fullpath="$$(pwd)/$(target)"; (cd $(IOQ3)/build/release-$(COMPILE_TARGET)/baseq3; zip -Dur "$$fullpath" vm); x=$$?; [ "$$x" -eq 0 -o "$$x"  -eq 12 ] || exit $$x

assets/hf/pak100.pk3: base/hf/pak100.pk3
	cp $< $@

check_ioq3:
	[ -d "$(IOQ3)" -a -f "$(IOQ3)/code/qcommon/common.c" ] || echo "IOQ3 directory seems... wrong? Expected to find ioq3 quake source code."

