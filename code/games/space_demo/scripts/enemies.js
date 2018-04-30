var enemies = [];
var ex = Sprite("ex");
var crossed_enemies = 0;

function update_e(){


	if(crossed_enemies>=3)
		{
			endGame();

		}
	enemies.forEach(function(enemy){
		enemy.update();
	});
	enemies = enemies.filter(function(enemy){
		return enemy.active;
	});
	if(Math.random()<0.1)
	{
		enemies.push(Enemy());
	}

	handleCollisions();
}

function draw_e()
{
	enemies.forEach(function(enemy){
		enemy.draw();
	});
}

function Enemy(I){


	I = I||{};
	I.sprite=Sprite("blank");
	I.active = true;
	I.age = Math.floor(Math.random()*120);
	I.color="#A2B";
	I.x = width/4 + Math.random()*width/2;
	I.y = 0 ;
	I.xVelocity = 0;
	I.yVelocity = 2;
	I.width = 32;
	I.height = 32;
	I.inBounds = function()
	{
		return (I.x>=0 && I.x<=width && I.y >=0 && I.y <= height);
	};
	I.draw = function()
	{
		canvas.beginPath();
		this.sprite.draw(canvas,this.x,this.y);
		canvas.closePath();

	
	};
	I.update = function()
	{
		
		I.x += I.xVelocity;
		I.y += I.yVelocity;
		I.xVelocity = 3*Math.sin(I.age*Math.PI/64);
		I.yVelocity =1*(levels);
		I.age++;
		if(I.y>=512&&I.active)
		{

					I.active=false;
					crossed_enemies++;
					del_life();
		
		}
		I.active = I.active && I.inBounds();

		var text = "enemy"+(levels-1)%3;
		I.sprite = Sprite(text);


	};
	I.explode = function()
	{
		
		this.active=false;
		ex.draw(canvas,this.x-32,this.y-36);
		var audio = new Audio('sounds/explosion.mp3');
		//var audio = new Audio('sounds/shoot.wav');
		audio.play();
	}


	return I;
};
