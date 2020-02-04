class Jeu{
    constructor(){
        this.blancs = Joueur(0)
        this.noirs = Joueur(1)
        this.echiquier = new Plateau();
        //Génération des pièces à faire..

        this.render = new renderCss(this.echiquier.board);

        
    }
}

class Joueur{
    constructor(couleur){
        // On instancie les pièces du joueur puis on les ajoutes au plateau
    }
}