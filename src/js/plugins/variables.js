/**
This file is part of BeanCounter

Copyright 2014 Joseph Lewis III <joseph@josephlewis.net>
Licensed under the GPLv3 and MIT licenses.
**/

// List the variables the user input
(function(){
    'use strict';

    var fun = function(bc){

        if(bc.hasNumericalAnswer())
            return; // we don't extract for numerically solvable expressions

        try
        {
            var res = bc.processEquation(bc.expression, "variables");
            res = res.replace("\n", ", ");

            bc.addResult("Variables", res);
        }
        catch(e)
        {
            console.log(e);
        }
    };

    BeanCounterGeneral.registerAdvancedPlugin("{expression|Exp}", fun);
})();
