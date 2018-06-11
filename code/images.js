var id = 0
var category = getQueryVariable("category")

function show_image(num) {
    $.getJSON("images.json", function(json) {
        var dict = json.category.filter(function (entry) {
            return entry.name === category;
        });
        var img = document.createElement("img");
        img.src = "images/" + category + "/" + dict[0].specific_source[num]["file"];
        img.style = "text-align:center; vertical-align:middle; max-width:100%;  max-height:100%;"
    
        var outerDiv = document.getElementById("outer");
        var innerDiv = document.getElementById("inner");
        innerDiv.parentNode.removeChild(innerDiv);
    
        var div = document.createElement("div");
        div.id = "inner"
        outerDiv.appendChild(div);
        var theDiv = document.getElementById("inner");
        theDiv.appendChild(img);
        var credits = "";
        if (dict[0].specific_source[num]["source"] == "" || dict[0].specific_source[num]["source"] == undefined){
            credits = dict[0].source;
        } else {
            credits = dict[0].specific_source[num]["source"]
        }
        document.getElementById("credits").innerHTML = "The credit of the image goes to " + credits + " !";
    });
}
function increase(){

    $.getJSON("images.json", function(json) {
        var dict = json.category.filter(function (entry) {
            return entry.name === category;
        });
        id += 1;
        if (id == Object.keys( dict[0].specific_source).length - 1) {
            document.getElementById("next").disabled = true;
        }
        if (id > 0) {
            document.getElementById("previous").disabled = false;
        }

        show_image(id);
        });
}

function decrease(){
    $.getJSON("images.json", function(json) {
        var dict = json.category.filter(function (entry) {
            return entry.name === category;
        });
        id -= 1;
        if (id == 0) {
            document.getElementById("previous").disabled = true;
        }
        if (id < Object.keys( dict[0].specific_source).length - 1) {
            document.getElementById("next").disabled = false;
        }
        show_image(id);
    });
}

function random(){
    $.getJSON("images.json", function(json) {
        var dict = json.category.filter(function (entry) {
            return entry.name === category;
        });
        id = Math.floor((Math.random() * Object.keys( dict[0].specific_source).length));
        if (id == 0) {
            document.getElementById("previous").disabled = true;
        } else {
            document.getElementById("previous").disabled = false;
        }
        if (id == Object.keys( dict[0].specific_source).length - 1) {
            document.getElementById("next").disabled = true;
        } else {
            document.getElementById("next").disabled = false;
        }

        show_image(id);
    });
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

document.getElementById('previous').addEventListener('click',decrease);
document.getElementById('next').addEventListener('click',increase);
document.getElementById('random').addEventListener('click',random);

$( document ).ready(function() {
    show_image(id);
    document.getElementById("previous").disabled = true;
});
