class Piece{
    constructor(couleur, x, y){
        if(couleur) console.log('Nouvelle pièce : ' + this.constructor.name + ' Noir')
        else console.log('Nouvelle pièce : ' + this.constructor.name + ' Blanc')

        //Coté client
        this.x = x;//Initialisation des coordonnées (classe a faire ?)
        this.y = y;
        this.couleur = couleur; // couleur de la pièce

        //Coté serveur
        this.deplacements = new Array()
        let deplacement = Object() // classe coo a faire ?
        deplacement.x = x;
        deplacement.y = y;
        this.deplacements.push(deplacement)
    }
    // méthode générale
    move(x,y, plateau){ //toujours forcer playable avant move..
        if(plateau.isInBoard(x,y)){
            if(plateau.board[x][y].playable){
                plateau.jouer(x, y, this);
            }
        }
    }
}

module.exports = Piece;
