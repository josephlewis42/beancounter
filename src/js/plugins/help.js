
// Performs a visualization of the current code
(function(){
    var fun = function(bc){

        bc.addResult("Help - Calculator", "Beancounter can be used as a simple \
        calculator, any of these should work in the entry field:\
        <ul>\
        <li>3 + 4 - three plus four</li>\
        <li>3^2 * 8 - three squared times eight</li>\
        <li>5 / 6 - 9 - five divided by six minus nine</li>\
        <li>5 / (6 - 9) - five over six minus nine</li>\
        </ul>");

        bc.addResult("Help - Expressions", "Beancounter can also handle \
        expressions, it will simplify where needed and show the variables:\
        <ul>\
        <li>3x + 2x + 1</li>\
        </ul>");

        bc.addResult("Help - Equations", "Beancounter can also handle \
        equations, it will extract variables, solve for the different variables,\
        differentiate and integrate:\
        <ul>\
        <li>y = 3x + 4</li>\
        </ul>");

        bc.addResult("Help - Keys", "<ul>\
        <li>Use the up and down arrow keys in the entry area to work through your past entries.</li>\
        </ul>");
    };

    BeanCounterGeneral.registerAdvancedPlugin("help", fun);
})();
