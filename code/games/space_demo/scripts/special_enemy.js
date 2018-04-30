var s_enemies = [];
var ex = Sprite("ex");
var crossed_sp_enemies= 0;


function update_se(){


	if(crossed_sp_enemies>=1)
		{
			endGame();
		}
	
	s_enemies.forEach(function(enemy){
		enemy.update();
	});
	s_enemies = s_enemies.filter(function(enemy){
		return enemy.active;
	});

	if(Math.random()<0.001)
	{
		s_enemies.push(S_enemy());
	}
		

	handleCollisions();
}

function draw_se()
{
	s_enemies.forEach(function(enemy){
		enemy.draw();
	});
}

function S_enemy(I){


	I = I||{};
	I.sprite=Sprite("se3");
	I.active = true;
	I.age =levels+2;
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
		this.sprite.draw(canvas,this.x,this.y);
	
	};
	I.update = function()
	{
		
		I.x += I.xVelocity;
		I.y += I.yVelocity;

		I.yVelocity =levels+1;
		if(I.y>=512&&I.active)
		{

					I.active=false;
					crossed_sp_enemies++;
					del_life();
		
		}
		I.active = I.active && I.inBounds();


	};
	I.hit  = function()
	{
		I.age --;
		if(I.age<=0)
		{
				I.explode();
				bonus =bonus + 20; 		

		}
	}
	I.explode = function()
	{
		
		this.active=false;
		ex.draw(canvas,this.x-32,this.y-36);
	};


	return I;
};
