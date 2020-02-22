class Piece{
    constructor(couleur, x, y){

        if(couleur) console.log('Nouvelle pièce : ' + this.constructor.name + ' Noir')
        else console.log('Nouvelle pièce : ' + this.constructor.name + ' Blanc')
        //Initialisation des coordonnées (classe a faire ?)
        this.x = x;
        this.y = y;

        this.couleur = couleur; // couleur de la pièce
        this.played = false; // pièce déjà jouée ? (pour le roque, le pion..) mettre que dans les classe ou c'est nécessaire ?
                                                                            // si oui changer la methode de playable du plateau
    }
    // méthode générale
    move(x,y, plateau){ //forcer playable avant move..
        if(plateau.isInBoard(x,y)){
            if(plateau.board[x][y].playable){
                plateau.jouer(x, y, this);
            }
        }
    }
}

// à modifier ? voir l'exemple du prof..
//module.exports = Class;
