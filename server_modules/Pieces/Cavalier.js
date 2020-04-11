const Piece = require('./Piece');

class Cavalier extends Piece{
    //x et y position sur le tableau
    constructor(couleur, x, y, id){
        super(couleur, x, y, id)
    }

    //fonction pour connaitre les cases jouables
    playable(plateau) {
        //scan permet verifier toutes les positions ou peut aller la piece sur le plateau
        let scan = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
        for (let j=0; j<scan.length; j++){
            //si la case est sur le plateau
            if(plateau.isInBoard(this.x + (scan[j][0]),this.y + (scan[j][1]))){
                //mets les cases en playble si la case est vide (case initialisé a 0)
                if (plateau.board[(this.x + (scan[j][0]))][this.y + (scan[j][1])].piece == 0) {
                    plateau.playable((this.x + (scan[j][0] )),this.y + (scan[j][1] ),this);
                }
                else {
                    //mets les cases en playble si la case est occupée par un ennemi (une case qui n'est pas de la couleur de la piece)
                    if (plateau.board[(this.x + (scan[j][0]))][this.y + (scan[j][1])].piece.couleur != this.couleur){
                        plateau.playable((this.x + (scan[j][0])),this.y + (scan[j][1]),this);
                    }  
                }
            }
        }
    }

}

module.exports = Cavalier;