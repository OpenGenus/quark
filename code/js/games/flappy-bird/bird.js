// BIRD
const bird = {
    animation : [
        {sX: 276, sY : 112},
        {sX: 276, sY : 139},
        {sX: 276, sY : 164},
        {sX: 276, sY : 139}
    ],
    x : 50,
    y : 150,
    w : 34,
    h : 26,
    
    radius : 12,
    
    frame : 0,
    
    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation : 0,
    
    draw : function(){
        let bird = this.animation[this.frame];
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h,- this.w/2, - this.h/2, this.w, this.h);
        
        ctx.restore();
    },
    
    flap : function(){
        this.speed = - this.jump;
    },
    
    update: function(){
        // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLAP SLOWLY
        this.period = state.current == state.getReady ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames%this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame%this.animation.length;
        
        if(state.current == state.getReady){
            this.y = 150; // RESET POSITION OF THE BIRD AFTER GAME OVER
            this.rotation = 0 * DEGREE;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            
            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.over;
                    DIE.play();
                }
            }
            
            // IF THE SPEED IS GREATER THAN THE JUMP MEANS THE BIRD IS FALLING DOWN
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else{
                this.rotation = -25 * DEGREE;
            }
        }
        
    },
    speedReset : function(){
        this.speed = 0;
    }
}