class Piece{
    constructor(couleur, nom = "Piece"){
        console.log('Piece instanciée');
        this.type = nom

        //Initialisation des coordonnées (classe a faire ?)
        this.x = -1;
        this.y = -1;

        this.color = couleur; // couleur de la pièce
        this.played = false; // pièce déjà jouée ? (pour le roque, le pion..) mettre que dans les classe ou c'est nécessaire ?
                                                                            // si oui changer la methode de playable du plateau
    }
    set_Position(board, x, y){ // on déplace une pièce, aucunes vérification n'est effectuée par rapport à la possibilité de jouer 
                               // ou par rapport a l'enregistrement du premier déplacement de la pièce
        if(!(this.x==-1 && this.y==-1)){ // Si coordonnées définies on supprime la pièce de son dernier emplacement
            board[this.x][this.y].piece = 0;
        }
        board[x][y].piece = this;
    }
}

// à modifier ? voir l'exemple du prof..
//module.exports = Class;