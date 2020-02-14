class Jeu{
    constructor(){
        this.blancs = Joueur(0)
        this.noirs = Joueur(1)
        this.echiquier = new Plateau();
        //Génération des pièces à faire..

    }
}

class Joueur{
    constructor(){
        this.pieces = -1; // 16 au debut de la partie
        this.couleur = -1 // 0 ou 1, blanc/noir
        this.roi.x = -1; //-1 a l'init puis def en fonction de la couleur,rajouter methode ici avec param ?
        this.roi.y = -1;
    }
}