class Piece{
    constructor(couleur, nom = "Piece"){
        console.log(nom + " viens d'être instanciée");

        this.type = nom
        img = "Vide.png"

        //Initialisation des coordonnées (classe a faire ?)
        this.x = -1;
        this.y = -1;

        this.color = couleur; // couleur de la pièce
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
