var life_cur = [] ;


function init_life()
{
	life_cur = [] ;
	for(var i = 0 ; i < 3 ; i ++)
	{
		life_cur.push(Life(i));
	}
}
function draw_life()
{

	life_cur.forEach(function(life){
		life.draw();

	});
}
function del_life()
{

		var audio = new Audio('sounds/Blip.wav');
		audio.play();
		life_cur.pop();
}



function Life(pos,I)
{
	I = I||{};
	I.active =true;
	I.x = 0+25*pos;
	I.sprite = Sprite("life3");
	I.y = 0;
	I.width = 2;
	I.height = 2;
	I.draw = function()
	{
		this.sprite.draw(canvas,this.x,this.y,this.width,this.height);
	};


	return I;
}

