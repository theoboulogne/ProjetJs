
class Joueur{
    constructor(couleur, id){
        this.id = id;

        this.pieces = 16; // 16 au debut de la partie
        this.couleur = couleur // 0 ou 1, blanc/noir
        this.roi = new Object();                                                            // class Coordonnées à faire..
        this.roi.x = 3; //position du roi en fonction de la couleur à l'initialisation
        this.roi.y = couleur * 7;

        this.pieces_prises = new Array()
    }

    //methode creation pieceprise a faire
}

module.exports = Joueur;