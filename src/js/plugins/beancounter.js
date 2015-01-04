/**
The main file for BeanCounter's internal functions.

Copyright 2014 - Joseph Lewis III <joseph@josephlewis.net>

Dual licensed GPLv3 + MIT
**/

'use strict';

// Show the version number of BeanCounter
(function(){

    var fun = function(bc){
        bc.addResult("Beancounter Version", "0.2");
    };

    BeanCounterGeneral.registerAdvancedPlugin("version", fun);
})();

// Show the version number of BeanCounter
(function(){

    var fun = function(bc){
        bc.addResult("Copyright", "2014 Joseph Lewis &lt;joseph@josephlewis.net&gt; <br>\
        Dual Licensed GPLv3 + MIT<br><br>\
        <b>Third Party Programs Used</b>\
        <ul>\
        <li>JQuery - MIT License</li>\
        <li>Bootstrap - MIT License</li>\
        <li>Mathomatic - LGPL</li>\
        <li>MathJax - Apache License V2</li>\
        </ul>");
    };

    BeanCounterGeneral.registerAdvancedPlugin("(?:copyright|license|about)", fun);
})();

