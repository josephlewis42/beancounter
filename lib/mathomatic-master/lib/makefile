# Makefile for the Mathomatic symbolic math library and its test program.
# See file README.txt for instructions.

CC=emcc
VERSION=`cat ../VERSION`
CFLAGS=-I../ -DLIBRARY -DVERSION=\"$(VERSION)\" # necessary C compiler flags

HEADERS=mathomatic.h ../includes.h ../license.h ../standard.h ../am.h \
		../externs.h ../blt.h ../complex.h ../proto.h ../altproto.h

MATHOMATIC_OBJECTS += globals.bc am.bc solve.bc help.bc parse.bc cmds.bc simplify.bc \
		  factor.bc super.bc unfactor.bc poly.bc diff.bc integrate.bc \
		  complex.bc complex_lib.bc list.bc gcd.bc factor_int.bc 

MATHOMATIC_SOURCES=../factor.c ../globals.c ../am.c ../solve.c ../help.c ../parse.c ../cmds.c ../simplify.c ../super.c ../unfactor.c ../poly.c ../diff.c ../integrate.c ../complex.c ../complex_lib.c ../list.c ../gcd.c ../factor_int.c lib.c emscripten.c

EMSCRIPTEN_ARGS=-s ALLOW_MEMORY_GROWTH=1 -s VERBOSE=1 -s EXPORTED_FUNCTIONS='["_matho_init", "_matho_process", "_matho_parse", "_matho_clear", "_free_mem", "_solve_function", "_init"]'

.PHONY: math.js

all: math.js

math.js: $(MATHOMATIC_SOURCES)
	$(CC) $(CFLAGS) $(CPPFLAGS) $(EMSCRIPTEN_ARGS) $^ -o $@

clean:
	rm -f *.o *.bc *.js
