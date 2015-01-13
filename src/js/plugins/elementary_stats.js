/**
This file is part of BeanCounter

It is responsible for performing elementary statistics on datasets.

Copyright 2014 Joseph Lewis III <joseph@josephlewis.net>
Licensed under the GPLv3 and MIT licenses.
**/


(function(){
    
    var stats = function(data){
        var result = {};
        
        data.sort();
        
        result["Minimum"] = data[0];
        result["Maximum"] = data[data.length - 1];
        
        var sum = 0.0;
        for(var i in data){
            sum += data[i];
        }
        //result["Sum"] = sum;
        
        // mean;
        var mean = sum / data.length;
        result["Mean"] = mean;
        
        // median
        if(data.length % 2 == 0) {
            var middle = data.length / 2;
            result["Median"] = (data[middle - 1] + data[middle]) / 2.0;
        } else {
            result["Median"] = data[data.length / 2]; 
        }
        
        var variance = 0;
        for(var i in data){
            var tmp = data[i] - mean;
            variance += tmp * tmp; // squared
        }
        
        variance *= (1.0 / (data.length - 1));
        
        result["Variance"] = variance;
        
        // stddev
        
        result["Standard Deviation"] = Math.sqrt(variance);
        
        return result;
    };
    
    var fun = function(bc, matches){
        console.log("Statistics called");
        var data = bc.evalList(matches["data"]);
        console.log("evaled list");
        console.log(data);
        if(data.length <= 1)
            return;
            
        var results = stats(data);
        var html = bc.constructTable(results);
        console.log(html);
        bc.addResult("Statistics", html);
    };
    
    
    var funHelp = function(bc, matches){
        var data = [44, 50, 38, 96, 42, 47, 40, 39, 46, 50];

        var results = stats(data);
        var html = "<p>You can do statistics on lists of numbers.</p>" + 
                    "<p>Example Input: <code>44, 50, 38, 96, 42, 47, 40, 39, 46, 50</code></p>" + 
                    "<p>Result:</p>" + 
                    bc.constructTable(results);
        
        
        console.log(html);
        bc.addResult("Help - Statistics", html);
    };


    BeanCounterGeneral.registerAdvancedPlugin("{list|data}", fun);
    
    BeanCounterGeneral.registerAdvancedPlugin("help", funHelp);

})();


(function(){
    var fun = function(bc, matches){      
        
        var data = bc.evalList(matches["data"]);
        if(data.length <= 1)
            return;

        var sum = 0.0;
        var first = true;
        
        var textoutput = "";
        for(var i in data){
            if(! first)
                textoutput += " + ";
            sum += data[i];
            
            textoutput += String(data[i]);
            
            first = false;
        }
        
        textoutput = String(sum) + " = " + textoutput;
        
        bc.addResult("Total", textoutput);
    };

    BeanCounterGeneral.registerAdvancedPlugin("{list|data}", fun, "Total");
})();

