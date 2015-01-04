BeanCounter
===========

BeanCounter is an entirely web-based computer algebra system with a clean user 
interface similar to WolframAlpha. It supports feature addition through a simple
plugin system making it adaptable to a wide variety of operations. 

![](https://raw.githubusercontent.com/josephlewis42/beancounter/master/screenshot.png)

Out of the box it supports:

* expression evaluation
* integration/differentiation
* formatting expressions with LaTeX
* solving for different variables
* simplification

Live demo is [available here](http://josephlewis.net/apps/BeanCounter/).


Environment
-----------

This application can run in modern web-browsers or as a standalone app on the 
desktop through node-webkit.


Technology
----------

The entire system is built on top of JavaScript, using an `emscripten` compiled
libmathomatic as the backend CAS.

Running Time
------------

The execution speed of mathomatic in the browser is fairly good, it takes about
as much time as WolframAlpha does to return results.

License
=======

Copyright (c) 2015, Joseph Lewis III <joseph@josephlewis.net>

The BeanCounter code is licensed under an LGPL and MIT license. This project
uses several libraries that have their own licenses:

* Mathomatic - LGPL
* nodewebkit - MIT
* MathJax - Apache v2.0
* Bootstrap - MIT
* JQuery - MIT
