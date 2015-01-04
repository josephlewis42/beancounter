/**
This file is part of BeanCounter

Copyright 2014 Joseph Lewis III <joseph@josephlewis.net>
Licensed under the GPLv3 and MIT licenses.
**/

// Solve equations for their different variables.
(function(){

    var fun = function(bc, matches){
        
        var exp = matches['Exp'];
        
        // Ensure we have a solvable system.        
        if( ! bc.isEquation() ||
            bc.hasNumericalAnswer()){
            return;
        }
        
        // Get the variables we can solve for
        var res = bc.processEquation(exp, "variables");
        var variables = res.split("\n");
        
        if(variables.length == 0){
            return;
        }
        
        var sols = [];
        
        var i;
        for(i = 0; i < variables.length; i++)
        {
            if(variables[i] === "" || variables[i] === "answer"){
                continue;
            }

            var res = bc.processEquation(exp, "solve " + variables[i]);
            var res2 = bc.latexify(res) || res;
            
            sols.push("<b>Solve for " + variables[i] + "</b><br><p>" + res2 + "</p>");
        }
        
        bc.addResult("Solutions", sols.join("<br>"));
    };

    BeanCounterGeneral.registerAdvancedPlugin("{expression|Exp}", fun);
})();
