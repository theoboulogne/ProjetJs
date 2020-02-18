class Jeu{
    constructor(){
        this.echiquier = new Plateau();
        //Génération des events a faire ?
        //Génération de la partie graphique a faire

        this.render = new renderCss(this.echiquier.board);

        
    }
}

class Joueur{
    constructor(couleur){
        this.pieces = 16; // 16 au debut de la partie
        this.couleur = couleur // 0 ou 1, blanc/noir
        this.roi.x = 4 - couleur; //position du roi en fonction de la couleur à l'initialisation
        this.roi.y = couleur * 7;
    }
}