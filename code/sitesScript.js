var start='';
var end='';
var tabURL='';
var tabHost='';
var lastVisited ='';

function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}
$(document).ready(function(){

      $(function() {
        start = new Date();
        tabURL = window.location.href;
        tabHost = getHostName(tabURL);
        lastVisited = start.getDate()+"/"+start.getMonth()+"/"+start.getFullYear();
             
      });
});

$(window).unload(function() {
  end = new Date();

       chrome.runtime.sendMessage({URL_found: "true", lastV : lastVisited, URL:tabHost,time:(end.getTime()-start.getTime())}, function(response) {
        });
});
 

