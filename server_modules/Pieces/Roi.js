

class Roi{

    constructor(x, y, player){
        this.x = x;
        this.y = y;
        this.player = player;
    }

    isSafe(x,y){
        /* detecter fou/reine */
        /* detecter tour/reine */
        /* detecter pion */
        /* detecter cavalier */
    }

    playable(){

        let X = this.x - 1;
        let Y = this.y - 1;

        let isPlayable = [];

        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                if(isInBoard(X + i, Y + i)){
                    
                }
            }
        }
    }

    move(x,y){
        
    }

}

module.exports = Roi;