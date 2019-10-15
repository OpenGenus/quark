document.getElementById("logo").addEventListener('click', function () {
    window.location.replace("../../popup.html");
});


// SELECT CVS
const cvs = document.getElementById("myCanvas");
const ctx = cvs.getContext("2d");

// GAME VARS AND CONSTS
let frames = 0;
const DEGREE = Math.PI/180;

// LOAD SPRITE IMAGE
const sprite = new Image();
sprite.src = "assets/img/sprite.png";

// LOAD SOUNDS
const SCORE_S = new Audio();
SCORE_S.src = "assets/audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "assets/audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "assets/audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "assets/audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "assets/audio/sfx_die.wav";

// GAME STATE
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

// START BUTTON COORD
const startBtn = {
    x : 520,
    y : 263,
    w : 83,
    h : 29
}

// CONTROL THE GAME
cvs.addEventListener("click", function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            if(bird.y - bird.radius <= 0) return;
            bird.flap();
            FLAP.play();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            console.log(startBtn);
            console.log(evt.clientX);   
            // CHECK IF WE CLICK ON THE START BUTTON
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
               
            }
            break;
    }
});


// BACKGROUND
const bg = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,
    
    draw : function(){
        for(let i =0;i<5;i++)
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + i*this.w, this.y, this.w, this.h);
    }
    
}

// FOREGROUND
const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,
    
    dx : 2,
    
    draw : function(){
        for(let i =0;i<6;i++)
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + i*this.w, this.y, this.w, this.h);
    },
    
    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

// GET READY MESSAGE
const getReady = {
    sX : 0,
    sY : 228,
    w : 173,
    h : 152,
    x : cvs.width/2 - 173/2,
    y : 80,
    
    draw: function(){
        if(state.current == state.getReady){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
    
}

// GAME OVER MESSAGE
const gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : 90,
    
    draw: function(){
        if(state.current == state.over){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);   
        }
    }
    
}

// DRAW
function draw(){
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

// UPDATE
function update(){
    bird.update();
    fg.update();
    pipes.update();
}

// LOOP
function loop(){
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}
loop();
