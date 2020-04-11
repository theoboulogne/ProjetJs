class Piece{
    constructor(couleur, x, y, id){
        //Informations principales sur la pièce
        this.x = x;
        this.y = y;
        this.couleur = couleur;

        // Id pour l'affichage graphique (repérer la pièce autrement que par coordonnées)
        this.id = id; 
        
        //On enregistre le nom de la pièce à partir du constructeur
        this.nom = this.constructor.name;

        //Historique de déplacement
        this.deplacements = [{x:x,y:y}]
    }
    // Méthode générale
    move(x,y, plateau){
        if(plateau.isInBoard(x,y)){
            if(plateau.board[x][y].playable){
                plateau.jouer(x, y, this);
            }
        }
    }
    //Méthode de copie de la pièce (pour garder les méthodes de déplacement)
    clone(){
        const P = eval("require('./"+this.nom+"')") //On peut pas le mettre en haut car il s'agit de classe enfant
        let tmp = new P(this.couleur, this.x, this.y, this.id)
        tmp.deplacements = JSON.parse(JSON.stringify(this.deplacements)); // Copie du tableau déplacement
        return tmp;
    }
}
    /* Première méthode de clone, trop long car trop d'import
       à chaque création de pièce

    const Pion = require('./Pion');
    const Fou = require('./Fou');
    const Cavalier = require('./Cavalier');
    const Reine = require('./Reine');
    const Tour = require('./Tour');

    let tmp = eval("new " 
                   + this.nom 
                   + "(" 
                   + String(this.couleur) 
                   + ", "
                   + String(this.x)
                   + ", "
                   + String(this.y)
                   +  ")");
    */

module.exports = Piece;
