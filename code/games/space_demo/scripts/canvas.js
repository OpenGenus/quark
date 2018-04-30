

/*--------------------------Canvas Area -------------------------*/



var canvas;
var levels = 1;
var go = Sprite("gameover1");
var FPS = 30;




//Height & Width of the screen
var height = 512;
var width = 480;
var speed = 1;

function createCanvas ()
{
	
	//canvas element with Height/Width
	var canvas_Element = $("<canvas tabindex='1' id='mainCanvas' width='"+width+"' height='"+height+"'></canvas>");
	canvas = canvas_Element.get(0).getContext("2d");
	
	//Add canvas element to body
	canvas_Element.appendTo('body');


}


function draw()
{
	canvas.beginPath();
	canvas.clearRect(0,0,width,height);
	canvas.closePath();

}



