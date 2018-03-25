var start;
var end;
var tabURL;


$(document).ready(function(){

      $(function() {
        start = new Date();

        tabURL = window.location.href;
        console.log(tabURL);
      });
});

$(window).unload(function() {
  end = new Date();


       chrome.runtime.sendMessage({URL_found: "true", URL:tabURL,time:(end.getTime()-start.getTime())}, function(response) {
            console.log(response);  
        });
});
 

