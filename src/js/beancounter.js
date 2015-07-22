/**
The main file for BeanCounter's JavaScript.

Copyright 2014 - Joseph Lewis III <joseph@josephlewis.net>

Dual licensed GPLv3 + MIT
**/


var BeanCounterGeneral = {
    /** Basic plugins are a simple function that takes in the BeanCounter
     * instance each time the user enters text and is executed.
     **/
    basicPlugins:[],
    replacements:{  "text":"([\\w]+)",
                    "unit":"([\\w/\\*\\^]+)",
                    "integer":"([-+]?\\d+)",
                    "float":"([-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)", // http://www.regular-expressions.info/floatingpoint.html
                    "list":"((?:(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)[\\s,]*)+)", // floating point list
                    "expression":"(.+[\\+\\-\\*/\\^\\(\\)].+)", // will not test for correctness, just form
                    "percentage":"([-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)[\\s]?(?:pct|percent|%)"},
    /**
     * Registers an advanced plugin that is called when the matcher
     * is matched.
     *
     * The function fun must have the following prototype:
     *      function(beanCounterInstance, matcherMap)
     *
     * Matchers take the following format:
     *      "My name is {text|Name} and I am {integer|Age} years old",
     *
     * Where text and integer are items in the replacements map.
     * The supplied function will be called with a map of items
     * corresponding to the values the user supplies in the matcher,
     * for example:
     *
     *      {"Name":"Arthur", "Age":"42"}
     *
     * if funname is provided then console.log will pretty print the
     * function name while parsing (useful for debugging)
     **/
    registerAdvancedPlugin : function(matcher, fun, funname) {
        var re_match = /{([\w]+\|[\w]+)}/gi;
        var output_string = matcher;
        var capture_names = [];
        funname = funname | "advanced plugin";

        while ( ( match = re_match.exec( matcher ) ) ){
            console.log(match);
            var val = match[1].split("|")[0];
            var name = match[1].split("|")[1];

            capture_names.push(name);
            output_string = output_string.replace(match[0], this.replacements[val]);
        }

        console.log(output_string);
        console.log(capture_names);

        this.basicPlugins.push(function(bc){
            console.log("calling " + funname);
            var outputMap = {};
            var rx = new RegExp(output_string, "gi");

            var captures = rx.exec(bc.expression);

            // check to see if this is a match
            if(captures == null){
                console.log("\t"+bc.expression+" Not a match for "+output_string);
                console.log("\treturning");
                return;
            }

            console.log("\t" + captures);
            console.log("\t" + typeof(captures));
            for(var i = 0; i < capture_names.length; i++) {
                var name = capture_names[i];
                var cap  = captures[i + 1];

                outputMap[name] = cap;
                console.log("\t" + name + " = " + cap);

            }
            fun(bc, outputMap);
        });
    },




    /**
     * Registers a multimatch plugin that is called when the matcher
     * is matched.
     *
     * The function fun must have the following prototype:
     *      function(beanCounterInstance, matcherMap)
     *
     * Matchers take the following format:
     *      ["loan", "{percent|Percent}", "{currency|Value}", "{duration|Length}"]
     *
     * Which would match any of the following:
     *  30% loan for 30 years on $5000
     *  loan on $6000 at 0.5 percent for 10 months
     *  $3 loan for 6 days at 5000% interest
     *
     * Note that items matched will go in order and will be removed from
     * the input once matched, so asking:
     *
     *      ["{percent|Percent}", "{integer|Int}"]
     *
     * will match:
     *
     *      500% 300
     *
     * But:
     *
     *      ["{integer|Int}", "{percent|Percent}"]
     *
     * will not, because the integer will match the 500 first and cut it
     * out leaving "% 300" remaining, which does not match the percent
     * item.
     *
     * Where text and integer are items in the replacements map.
     * The supplied function will be called with a map of items
     * corresponding to the values the user supplies in the matcher,
     * for example:
     *
     *      {"Name":"Arthur", "Age":"42"}
     *
     * if funname is provided then console.log will pretty print the
     * function name while parsing (useful for debugging)
     **/
    registerContextualPlugin : function(matcher, fun, funname) {
        var re_match = /{([\w]+\|[\w]+)}/gi;

        var replacements = this.replacements;
        this.basicPlugins.push(function(bc){
            // the thing we're passing to fun later on
            var outputMap = {};

            // copy this locally because we'll be manipulating it
            var expression = bc.expression;

            var numMatches = 0;

            // for each item in the matcher, we need to see if it works.
            for(var i = 0; i < matcher.length; i++) {
                var item = matcher[i];

                // These are the names of the things to capture, e.g. "{integer|Int}" -> "Int"
                var capture_names = [];

                // Next we look up matches for the conversions and replace them in the regex
                // with the actual expression they represent.
                while ( ( match = re_match.exec( item ) ) ){
                    console.log(match);
                    var val = match[1].split("|")[0];
                    var name = match[1].split("|")[1];

                    capture_names.push(name);
                    item = item.replace(match[0], replacements[val]);
                    numMatches += 1;
                }

                console.log("Trying to get: " + capture_names);
                console.log("With regex: " + item);
                console.log("From string: " + expression);

                // Construct a regexp from the whole matching sequence we can
                // capture over the current beancounter input
                var rx = new RegExp(item, "gi");
                var captures = rx.exec(expression);
                console.log("captures: " + captures);

                if(captures == null) {
                    continue;
                }

                // Remove each capture from the expression for the next time
                // around, so we don't end up copying something multiple times.
                for(var j = 0; j < captures.length; j++) {
                    var captured = captures[j];
                    var capsplit = expression.indexOf(captured) ;

                    if(capsplit == -1) {
                        continue
                    }

                    console.log("capture location: " + capsplit + " curr: " + expression);
                    expression = expression.substring(capsplit + captured.length);
                    console.log(expression)

                    if(capture_names[j] != undefined) {
                        outputMap[capture_names[j]] = captured;
                    }
                }
            }

            if (Object.keys(outputMap).length != numMatches) {
                console.log("Wrong number of matches expected: " + numMatches);
                console.log(outputMap);
                return;
            }
            console.log(outputMap);
            fun(bc, outputMap);
        });



        // TODO implement me

        // for item in matcher, replace appropriately
        // keep two arrays, things to match and their names

        // construct a function that matches one then removes it until
        // all items are through
        /**
        var re_match = /{([\w]+\|[\w]+)}/gi;
        var output_string = matcher;
        var capture_names = [];
        funname = funname | "advanced plugin";

        while ( ( match = re_match.exec( matcher ) ) ){
            console.log(match);
            var val = match[1].split("|")[0];
            var name = match[1].split("|")[1];

            capture_names.push(name);
            output_string = output_string.replace(match[0], this.replacements[val]);
        }

        console.log(output_string);
        console.log(capture_names);

        this.basicPlugins.push(function(bc){
            console.log("calling " + funname);
            var outputMap = {};
            var rx = new RegExp(output_string, "gi");

            var captures = rx.exec(bc.expression);

            // check to see if this is a match
            if(captures == null){
                console.log("\t"+bc.expression+" Not a match for "+output_string);
                console.log("\treturning");
                return;
            }

            console.log("\t" + captures);
            console.log("\t" + typeof(captures));
            for(var i = 0; i < capture_names.length; i++) {
                var name = capture_names[i];
                var cap  = captures[i + 1];

                outputMap[name] = cap;
                console.log("\t" + name + " = " + cap);

            }
            fun(bc, outputMap);
        });**/
    }
};


var BeanCounter = function(input_id, output_id){
    console.log("Constructing beancounter with input: " + input_id + " output: " + output_id);
    this.input_id = input_id;
    this.output_id = output_id;
    this.expression = "";
    this.history = [];
    this.history_index = 0;
    this.current_results = new Set();

    // functions provided by Matho, these should be replaced with something more
    // viable in the future
    this.matho_init = Module.cwrap('init', 'void', []);
    this.js_solve = Module.cwrap('solve_function', 'number', ['string', 'string']);

    var bc = this;
    window.onhashchange = function() {
        var eq = decodeURIComponent(window.location.hash).substring(1);
        bc.userInput(eq);
    };
};

BeanCounter.prototype.userInput = function(value) {
    if(value == this.expression) return;

    this.expression = value;
    this.history.push(value);
    this.history_index = this.history.length;
    this.update(value);
};

BeanCounter.prototype.keyhandler = function(event) {
    "use strict"; // strict mode for intelligence.

    event = event || {which:13};

    var code = event.which;

    switch(code)
    {
        case 13: // return/enter
            console.log("keyhandler return:" + this.input_id);
            var val = document.getElementById(this.input_id).value;
            document.getElementById(this.input_id).value = "";
            this.userInput(val);
            break;

        case 38: // up arrow
            if(this.history.length == 0)
                return;

            this.history_index--;

            if(this.history_index < 0)
                this.history_index = 0;

            document.getElementById(this.input_id).value = this.history[this.history_index];
            break;

        case 40: // down arrow
            console.log("down");
            if(this.history.length == 0)
                return;
            this.history_index++;

            if(this.history_index >= this.history.length)
            {
                this.history_index = this.history.length;
                document.getElementById(this.input_id).value = "";
                return;
            }
            else
            {
                document.getElementById(this.input_id).value = this.history[this.history_index];
            }

            break;

    }
};

// Clears the results display
BeanCounter.prototype.clearResults = function() {
    "use strict"; // strict mode for intelligence.

    document.getElementById(this.output_id).innerHTML = "";
    this.current_results.clear();
};

// Converts an expression to a pretty output, returns the empty string on failure.
BeanCounter.prototype.latexify = function(expression) {
    "use strict"; // strict mode for intelligence.

    try {
        return '<div>' + parser.parse(expression) + '</div>';
    } catch(e) {
        return "";
    }
};

// Adds a formatted result to the user display
BeanCounter.prototype.addResult = function(title, htmlContent) {
    "use strict"; // strict mode for intelligence.
    var resultText = "<div class='resultinfo' id='"+title+"'><h2>" + title +"</h2>" + htmlContent + "</div>";

    // some plugins might be improperly registered twice, don't show them
    if(this.current_results.has(resultText)){
        console.log("already have a section for: " + title);
        return;
    }
    this.current_results.add(resultText);
    document.getElementById(this.output_id).innerHTML += resultText;
};

// Converts a map of title -> value pairs to an HTML table
BeanCounter.prototype.constructTable = function(tableContents) {
    "use strict"; // strict mode for intelligence.

    var htmlContent = "";

    htmlContent += "<table class='table table-striped'>";

    // http://stackoverflow.com/a/684692
    for (var key in tableContents) {
        if (tableContents.hasOwnProperty(key)) { // ignore prototypes if passed in

            htmlContent += "<tr><th>" + String(key) + "</th><td>" + String(tableContents[key]) + "</td></tr>";
        }
    }

    htmlContent += "</table>";

    return htmlContent;
};


// Updates the expression and output based on it
BeanCounter.prototype.update = function(expression) {
    "use strict"; // strict mode for intelligence.

    console.log("Updating with expression: " + expression);

    this.expression = expression;

    this.clearResults();

    window.location.hash = encodeURIComponent(expression);

    for(var i = 0; i < BeanCounterGeneral.basicPlugins.length; i++)
    {
        console.log("Executing Plugin " + i);
        var plugin = BeanCounterGeneral.basicPlugins[i];
        plugin(this);
    }
};

// Processes an expression using the matho engine
// giving a firstcommand enters it into the uninitialized engine
// the secondcommand is optionally executed
// only the value of the second command is returned if it is entered.
// this allows you to enter something like the equation, then use
// the `differentiate` call on it.
//
// TODO find a way to make emscripten not dependent on this stupid
// global variable! Or us not dependent on emscripten
BeanCounter.prototype.processEquation = function(firstcommand, secondcommand)
{
    "use strict"; // strict mode for intelligence.

    this.matho_init();
    emscriptenresult = "";
    this.js_solve(firstcommand, "\n");
    console.log(emscriptenresult);

    var c2 = secondcommand || "";
    if(c2 != "")
    {
        emscriptenresult = "";
        this.js_solve(secondcommand, "\n");
        console.log(emscriptenresult);

    }

    return emscriptenresult;
};


BeanCounter.prototype.hasNumericalAnswer = function()
{
    "use strict"; // strict mode for intelligence.

    var res = this.processEquation(this.expression);
    if(res.indexOf("answer =") > -1)
    {
        return true;
    }

    return false;
};

// Changes a string matching the list item to a list of numbers,
// can return a list with only a single element.
BeanCounter.prototype.evalList = function(list){

    "use strict";

    var nums = list.split(/[\s,]+/);
    var output = [];

    // TODO replace this with list comprehensions when EMCA 7 comes out
    for(var i in nums) {
        console.log(output);
        if(nums[i] == "") {
            continue
        }
        output.push(parseFloat(nums[i]));
    }

    return output;
};

BeanCounter.prototype.getVariables = function()
{
    "use strict"; // strict mode for intelligence.

    var res = this.processEquation(this.expression, "variables");
    var variables = res.split("\n");

    var cleaned = [];

    for(var i in variables){
        if(variables[i] !== ""){
            cleaned.push(variables[i]);
        }
    }

    return cleaned;
};

BeanCounter.prototype.isEquation = function()
{
    "use strict"; // strict mode for intelligence.
    return (this.expression.indexOf("=") >= 0);
};

require(["js/parsers/calculator"], function() {
    console.log("loaded calculator");
    BeanCounter.prototype.evaluate = parser.parse;
});
/**
 "js/parsers/latex_generator.js", "js/parsers/mathml_generator.js"
    BeanCounter.prototype.latexify = latex.parser;
    BeanCounter.prototype.mathmlify = mathml.parser;
**/
