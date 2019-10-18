var score = 0 ;
var bonus = 0 ;
var total_score = score+bonus;

var scoreBox = {

	color :"#ffffff",
	x:0,
	y:0,
	box_width : 150,
	box_height : 50,

	draw : function ()
	{
		
		  canvas.fillStyle = this.color;
		  //canvas.fillRect(width - this.box_width , this.y , this.box_width,this.box_height);

		  //canvas.strokeRect(width - this.box_width , this.y , this.box_width,this.box_height);
   		  canvas.font = "15pt Arial";

   		  canvas.fillStyle = "#ffffff";
   		  total_score = score+bonus;
   		  var text = "SCORE : "+ total_score;
   		  var text2 = "LEVEL   : "+levels;
   		
		  canvas.fillText(text,width - this.box_width+5,this.y+20);
		  canvas.fillText(text2,width - this.box_width+5,this.y+40);
		 



	},



}

function draw_sb()
{
	var b1 = scoreBox;
	b1.draw();
}

