/**
This file is part of BeanCounter

Copyright 2014 Joseph Lewis III <joseph@josephlewis.net>
Licensed under the MIT license.
**/

"using strict;"

require(['scripts/config'], function() {
        var fun = function(bc){

            vars = bc.getVariables()
            if(vars.length == 0 || vars.length > 1) {
                return
            }

            var v = vars[0]

            // we do 1/10th of a unit for decent plotting without tearing through
            // the processor

            var start = -10
            var end   = 10
            var step  = 0.1

            for(var i = start; i < end; i += step) {

                console.log(bc.eval());
            }

            bc.addResult("Plot", "");
        };

        BeanCounterGeneral.registerAdvancedPlugin("{expression|Exp}", fun);
});
