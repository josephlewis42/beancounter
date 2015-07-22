

// shows raw input
(function(){
    var visualize = function(bc){
        var exp = bc.expression;

        bc.addResult("Input", exp);
    };

    BeanCounterGeneral.basicPlugins.push(visualize);
})();


// Performs a visualization of the current code
(function(){
    var fun = function(bc){

        var exp = bc.expression;
        var tex = bc.latexify(exp);
        if(tex != "")
        {
            bc.addResult("Representation", tex);
        }
    };

    BeanCounterGeneral.registerAdvancedPlugin("{expression|Exp}", fun);
})();


// Returns the answer if it is simple
(function(){
    var fun = function(bc){
        var exp = bc.expression;
        var res = bc.processEquation(exp);
        if(res.indexOf("answer =") > -1)
        {
            bc.addResult("Answer", res.split("=")[1]);
            isbasic = true;
        }

    };

    BeanCounterGeneral.registerAdvancedPlugin("{expression|Exp}", fun);
})();


// Simplifies the equation
(function(){
    var fun = function(bc){
        if(bc.hasNumericalAnswer())
            return;

        var simple = bc.processEquation(bc.expression, "simplify");
        if(simple === bc.expression)
            return;

        var tex = bc.latexify(simple);
        if(tex != "")
            bc.addResult("Simplified", tex);
    };

    BeanCounterGeneral.registerAdvancedPlugin("{expression|Exp}", fun);
})();


// an alternate using our new module
(function(){

    var fun = function(bc){
        var exp = bc.expression;
        var res = bc.evaluate(exp);
        bc.addResult("Answer2", "" + res);
    };

    BeanCounterGeneral.registerAdvancedPlugin("{expression|Exp}", fun);
})();



// shows hello world
(function(){
    var visualize = function(bc, matched){
        bc.addResult("Hello, " + matched["Name"], "");
    };

    BeanCounterGeneral.registerAdvancedPlugin("Hello {text|Name}", visualize);
})();
