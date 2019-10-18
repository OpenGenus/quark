var playerBullets = [];

function draw_bull()
{
	playerBullets.forEach(function(bullet){
		bullet.draw();
	});

}


function update_b()
{
	playerBullets.forEach(function(bullet){
		bullet.update();
	});

	playerBullets = playerBullets.filter(function(bullet){
		return bullet.active;
	})

}


function bullet(I)
{
	I.active = true;
	I.xVelocity = 0; 
	I.yVelocity = -I.speed;
	I.width = 3;
	I.height = 3;
	I.color ="#feff51";
	I.inBounds = function()
	{
		return (I.x>=0 && I.x<=width && I.y >=0 && I.y <= height);
	};
	I.draw = function()
	{
		canvas.beginPath();
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x,this.y,this.width,this.height);
		canvas.closePath();
	};
	I.update = function(){

		I.x += I.xVelocity;
		I.y += I.yVelocity;
		I.active = I.active && I.inBounds();
	};

	return I;


};