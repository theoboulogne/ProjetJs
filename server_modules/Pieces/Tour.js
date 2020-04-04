const Piece = require('./Piece');

class Tour extends Piece{
    constructor(couleur, x, y){
        super(couleur, x, y)
    }
    
    playable(plateau) {
        let scan = [[-1,0],[1,0],[0,-1],[0,1]];
        for (let j=0; j<scan.length; j++){
            let i=1;
            while(plateau.isInBoard(this.x + (scan[j][0] * i),this.y + (scan[j][1] * i))){
                if (plateau.board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece == 0) {
                    plateau.playable((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i),this);
                }
                else {
                    if (plateau.board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece.couleur != this.couleur){
                        plateau.playable((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i),this);
                    }
                    i = 8;  
                } 
                i++;
            }
        }
    }

}

module.exports = Tour;