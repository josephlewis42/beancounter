/**
This file is part of BeanCounter

Copyright 2014 Joseph Lewis III <joseph@josephlewis.net>
Licensed under the GPLv3 and MIT licenses.
**/

// Differentiate
(function() {

  var fun = function(bc, matches) {

    var exp = matches['Exp'];

    // Get the variables we can solve for
    var variables = bc.getVariables();

    // Ensure we have a solvable system.
    if (!bc.isEquation() ||
      bc.hasNumericalAnswer() ||
      variables.length == 0) {
      return;
    }

    var sols = [];

    for (var i = 0; i < variables.length; i++) {
      var res = bc.processEquation(exp, "differentiate " + variables[i]);
      var res2 = bc.latexify(res) || res;

      sols.push("<b>Differentiate for " + variables[i] + "</b><br><p>" + res2 + "</p>");
    }

    bc.addResult("Differentials", sols.join("<br>"));
  };

  BeanCounterGeneral.registerAdvancedPlugin("{expression|Exp}", fun);
})();

// Integrate
(function() {

  var fun = function(bc, matches) {

    var exp = matches['Exp'];

    // Get the variables we can solve for
    var variables = bc.getVariables();

    // Ensure we have a solvable system.
    if (!bc.isEquation() ||
      bc.hasNumericalAnswer() ||
      variables.length == 0) {
      return;
    }

    var sols = [];

    for (var i = 0; i < variables.length; i++) {
      var res = bc.processEquation(exp, "integrate " + variables[i]);
      var res2 = bc.latexify(res) || res;

      sols.push("<b>Integrate " + variables[i] + "</b><br><p>" + res2 + "</p>");
    }

    bc.addResult("Integrals", sols.join("<br>"));
  };

  BeanCounterGeneral.registerAdvancedPlugin("{expression|Exp}", fun);
})();
