MATHOMATIC_DIR=lib/mathomatic-master/lib
JS_DIR=src/js

#nodewebkit stuff, we'll try not to hit the servers too much
NW_DIR=nodewebkit_fetch
NW_VERSION=v0.11.5
NW_FETCH_PATH=http://dl.node-webkit.org/$(NW_VERSION)

NW_LINUX_64_TAR=node-webkit-$(NW_VERSION)-linux-x64.tar.gz
NW_LINUX_64=$(NW_FETCH_PATH)/$(NW_LINUX_64_TAR)
NW_WIN_64=$(NW_FETCH_PATH)/node-webkit-$(NW_VERSION)-win-x64.tar.gz
NW_osx_64=$(NW_FETCH_PATH)/node-webkit-$(NW_VERSION)-osx-x64.tar.gz

.PHONY: clean all

all: bc bc_linux bc_windows bc_mac

# requires a set up and running emscripten environment
mathomatic_js:
	$(MAKE) -C $(MATHOMATIC_DIR)
	mv $(MATHOMATIC_DIR)/math.js $(JS_DIR)/math.js

output:
    mkdir -p output

# 
bc: mathomatic_js

	zip -r output/app.nw src/*

bc_linux: bc
	wget $(NW_LINUX_64) -nc --directory-prefix $(NW_DIR)
	cp $(NW_DIR)/$(NW_LINUX_64_TAR) output/$(NW_LINUX_64_TAR)
	tar -C output -xvzf output/$(NW_LINUX_64_TAR)
	mv output/node-webkit-v0.11.5-linux-x64 output/linux_x64
	cp output/app.nw output/linux_x64
	mv output/linux_x64/nw output/linux_x64/beancounter
	
	# patch to run on modern linux distributions, temporary fix
	cp output/linux_x64 output/linux_64_patched
	sed -i 's/udev\.so\.0/udev.so.1/g' output/linux_64_patched/beancounter

	
	
bc_windows: bc
	

bc_mac: bc
	

clean:
	rm -rf output
	$(MAKE) -C $(MATHOMATIC_DIR) clean

webclean:
	rm -rf nodewebkit_fetch/*.tar.gz
