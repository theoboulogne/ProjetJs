
const Piece = require('./Piece');

class Reine extends Piece{
    //x et y position sur le tableau
    constructor(couleur, x, y, id){
        super(couleur, x, y, id)
    }

    //fonction pour connaitre les cases jouables
    playable(plateau) {
        //scan permet verifier toutes les directions ou peut aller la piece sur le plateau
        let scan = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[1,-1],[-1,1]];
        //va vers la diection donée
        for (let j=0; j<scan.length; j++){
            let i=1;
            //si la case est sur le plateau
            while(plateau.isInBoard(this.x + (scan[j][0] * i),this.y + (scan[j][1] * i))){
                //mets les cases en playble si la case est vide (case initialisée a 0)
                if (plateau.board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece == 0) {
                    plateau.playable((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i),this);
                }
                else {
                    //mets les cases en playble si la case est occupée par un ennemi (une case qui n'est pas de la couleur de la piece)
                    if (plateau.board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece.couleur != this.couleur){
                        plateau.playable((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i),this);
                    }
                    //si la case est occupée par un ennemi alors il ne peut pas aller plus loin
                    i = 8;  
                } 
                i++;
            }
        }
    }


}

module.exports = Reine;