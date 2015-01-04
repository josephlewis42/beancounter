
// Prompts the user to do a tour
(function(){
    var fun = function(bc){
        bc.addResult("Tutorial", "<div style='text-align:center;'><b>First Time Using BeanCounter?</b><br><br>\
        <button type='button' class='btn btn-success' onclick='show_tour()'>Take the tour! <i>(it's fast!)</i></button></div>");
    };

    BeanCounterGeneral.registerAdvancedPlugin("firstrun", fun);
})();


function show_tour()
{
    // Instance the tour
    var tour = new Tour({
        debug: true,
      steps: [
      {
        element: "#beancounter",
        placement: "bottom",
        title: "Welcome",
        content: "Welcome to BeanCounter a calculator for the modern age"
      },
      {
        element: "#curr_eq",
        title: "Input Area",
        placement: "bottom",
        content: "This is where you enter your equations. Press [enter] once its in to calculate.",
        onShow: function (tour) {
            document.getElementById("curr_eq").value = "y = 3x^2 + x^2 - 4/2 - 1x";
        }

    },
    {
        element: "#results_area",
        title: "Results Pane",
        placement: "top",
        content: "This is where the results show up",
        onShow: function (tour) {
            document.getElementById("curr_eq").value = "y = 3x^2 + x^2 - 4/2 - 1x";

            document.getElementById("curr_eq").onkeyup({which:13});
        }
    },
    {
        element: "#aboutButton",
        title: "About",
        placement: "bottom",
        content: "You can get more information or view the tour again from here",
    },
    {
        element: "#results_area",
        title: "More Help",
        placement: "top",
        content: "For now, we'll leave you with some extra help",
        onShow: function (tour) {
            document.getElementById("curr_eq").value = "help";
            document.getElementById("curr_eq").onkeyup({which:13});
        }
    },
    ]});

    // Initialize the tour
    tour.init();

    // Start the tour
    tour.start();

    if (tour.ended()) {
      // decide what to do
      tour.restart();
    }

    return false;
}
