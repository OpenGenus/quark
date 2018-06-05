function readFile(path_to_code){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", path_to_code, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                document.getElementById("show-code").innerHTML = allText;
            }
        }
    }
    rawFile.send(null);
}

function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

let path = getQueryVariable("loc")
if (path){
    readFile("/code/" + path);
}