
//On Document ready 
        $(document).ready(function(){
          createCanvas();       
          init_life();
          window.interval_status =interval();
          
        });   
       


function interval ()

{

	var ret = setInterval (function()
	{
		draw();
		draw_pl();
		update_pl();
		draw_bull();
		update_b();
		draw_e();
		update_e();
		draw_sb();
		draw_life();
		draw_se();
  		update_se();			
		
	},1000/FPS);
	
	return ret;
}

function clearArray()
{
	enemies.length=0;
	s_enemies.length=0;
	playerBullets.length=0;

}


//Game End Screen
function endGame()
{
		clearArray();
		var audio = new Audio('sounds/gameEnd.mp3');
		audio.play();
		clearInterval(window.interval_status);	
		canvas.clearRect(0,0,width,height);

		canvas.beginPath();
		canvas.fillStyle = "#ffffff ";
		go.draw(canvas,128,150);
		canvas.fillText("Click Anywhere To Restart",136,270);
		canvas.closePath();

		console.log(window.interval_status);
		document.addEventListener('click', function() {
		 location.reload();       
	   	 }, false);

}


