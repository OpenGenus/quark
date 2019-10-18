var step = 1;

function collides(a,b)
{
	var ans =  (a.x<b.x + b.width && 
		a.x +a.width > b.x && 
		a.y < b.y + b.height &&
		a.y + a.height >b.y );
	return ans;

}


function handleCollisions()
{
	playerBullets.forEach(function(bullet){

		enemies.forEach(function(enemy){

		if(collides(bullet,enemy)&&enemy.active==true){
			enemy.explode();
			bullet.active = false;
			score = score+10;			
		}
		});

		s_enemies.forEach(function(senemy){
			if(collides(bullet,senemy)){
				senemy.hit();
				bullet.active = false;
			}
		});
		


	});

	s_enemies.forEach(function(enemy){
		if(collides(enemy,player)){
				
				// enemy.explode();
				// player.explode();
				
				endGame();
		}
	});

	enemies.forEach(function(enemy){
		if(collides(enemy,player)){
				
				// enemy.explode();
				// player.explode();
				
				endGame();
		}
	});

	//Change level with score 
	if(score==500*step)
			{
				canvas.clearRect(0,0,width,height);
				levels++;
				enemies.length = 0;
				playerBullets.length=0;
				s_enemies.length=0;
				step++;
				p1.x= 220;
				p1.y = 480;
				
			
			}

}