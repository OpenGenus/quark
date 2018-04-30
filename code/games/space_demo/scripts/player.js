var player = {


	color :"#ffffe0",
	x : 220,
	y : 480,
	width : 32,
	height : 32,

	draw : function ()
	{
		
		 this.sprite.draw(canvas,this.x,this.y);
	},
	draw_explosion : function(x,y)
	{
		//explode.draw(canvas,x,y);
		endGame();
		
	}

}
player.sprite = Sprite("player");
player.explode = function()
{
	this.active = false ;
	this.draw_explosion(this.x,this.y);

}
var p1 = player;

function draw_pl()
{
	
	p1.draw();
}

$(function(){
         window.keydown={};

         function keyName(event)
         {
           return jQuery.hotkeys.specialKeys[event.which]||String.fromCharCode(event.which).toLowerCase()
         }

         $(document).bind("keydown",function(event){
           keydown[keyName(event)]=true;
         });
         $(document).bind("keyup",function(event){
           keydown[keyName(event)]=false;
         });


 }) ;

function update_pl()
{
	if(keydown.space)
	{
		player.shoot();
	}

	if(keydown.left)
	{
		player.x-=5;
	}
	if(keydown.right)
	{
		player.x+=5;
	}

player.x = player.x.clamp(0,width-player.width);
handleCollisions();
}
 
player.midpoint = function(){

	return{
		x: this.x + this.width/2,
		y: this.y + this.height/2
	};
};


player.shoot = function(){

	var audio = new Audio('sounds/shoot.mp3');
	audio.play();
	var bulletPosition = this.midpoint();
	playerBullets.push(bullet({
	speed : 5,
	x: bulletPosition.x,
	y: bulletPosition.y


	}));
};

