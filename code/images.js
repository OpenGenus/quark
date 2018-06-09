var id = 0
var dict = {1: "google.com",
                2: "yahoo.com",
                3: "facebook.com",
                4: "google.com",
                5: "website.com"}

function show_image(src, num) {
    var img = document.createElement("img");
    img.src = "images/" + src;
    img.style = "text-align:center; vertical-align:middle; max-width:100%;  max-height:100%;"

    var outerDiv = document.getElementById("outer");
    var innerDiv = document.getElementById("inner");
    innerDiv.parentNode.removeChild(innerDiv);

    var div = document.createElement("div");
    div.id = "inner"
    outerDiv.appendChild(div);
    var theDiv = document.getElementById("inner");
    theDiv.appendChild(img);
    document.getElementById("credits").innerHTML = "The credit of the image goes to " + dict[num] + " !";

}
function increase(){
    id += 1;
    if (id == Object.keys(dict).length - 1) {
        document.getElementById("next").disabled = true;
    }
    if (id > 0) {
        document.getElementById("previous").disabled = false;
    }

    src = id + 1 +".jpg";
    show_image(src, id + 1);

}

function decrease(){
    id -= 1;
    if (id == 0) {
        document.getElementById("previous").disabled = true;
    }
    if (id < Object.keys(dict).length - 1) {
        document.getElementById("next").disabled = false;
    }

    src = id + 1 +".jpg";
    show_image(src, id + 1);
}

function random(){
    id = Math.floor((Math.random() * Object.keys(dict).length) + 0);
    if (id == 0) {
        document.getElementById("previous").disabled = true;
    } else {
        document.getElementById("previous").disabled = false;
    }
    if (id == Object.keys(dict).length - 1) {
        document.getElementById("next").disabled = true;
    } else {
        document.getElementById("next").disabled = false;
    }
    src = id + 1 +".jpg";
    show_image(src, id + 1);
}

document.getElementById('previous').addEventListener('click',decrease);
document.getElementById('next').addEventListener('click',increase);
document.getElementById('random').addEventListener('click',random);

$( document ).ready(function() {
    src = 1 +".jpg";
    show_image(src, id + 1);
    document.getElementById("previous").disabled = true;
});
