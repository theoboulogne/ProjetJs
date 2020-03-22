const Piece = require('./Piece');

class Cavalier extends Piece{
    constructor(couleur, x, y){
        super(couleur, x, y)
    }

    playable(plateau) {
        plateau.reset_playable();
        let scan = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
        for (let j=0; j<scan.length; j++){
            if(plateau.isInBoard(this.x + (scan[j][0]),this.y + (scan[j][1]))){
                if (plateau.board[(this.x + (scan[j][0]))][this.y + (scan[j][1])].piece == 0) {
                    plateau.playable((this.x + (scan[j][0] )),this.y + (scan[j][1] ),this.couleur);
                }
                else {
                    if (plateau.board[(this.x + (scan[j][0]))][this.y + (scan[j][1])].piece.couleur != this.couleur){
                        plateau.playable((this.x + (scan[j][0])),this.y + (scan[j][1]),this.couleur);
                    }  
                }
            }
        }
    }

}

module.exports = Cavalier;