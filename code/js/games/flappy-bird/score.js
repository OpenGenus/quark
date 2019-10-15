const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);
            
        }else if(state.current == state.over){
            // SCORE VALUE
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 625, 186);
            ctx.strokeText(this.value, 625, 186);
            // BEST SCORE
            ctx.fillText(this.best, 625, 228);
            ctx.strokeText(this.best, 625, 228);
        }
    },
    
    reset : function(){
        this.value = 0;
    }
}