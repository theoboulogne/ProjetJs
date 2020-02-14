class Plateau{
    constructor(){
        console.log('Plateau instanciée');
        Joueurs[2] = new Joueur[2]

        this.board = new Array(8)
        for(let i = 0; i<8; i++){
            this.board[i] = new Array(8)
            for(let j = 0; j<8; j++){
                this.board[i][j] = new Case();
            }
        }

        //rajouter methode d'acces a board avec securite de depassement

        //rajouter un moyen de reset justplayed intelligemment..

        // Ajouter les différentes pièces ( méthode ? ou passer les joueurs en argument du constructeur ? 
                                        //  ou générer les joueurs dans le plateau directement)
        // définir les coo du roi dans le joueur a l'initialisation du board
    }
    reset_playable(){
        for(let i = 0; i<8; i++){
            for(let j = 0; j<8; j++){
                this.board[i][j].playable = false;
            }
        }
    }
    playable(x,y, couleur){
        //rajouter verif de depassement aussi
        if(this.board[this.Joueur[couleur].roi.x][this.Joueur[couleur].roi.y].piece.echec()){ //sur le type ?
            return -1 // erreur a afficher ? (ex:en rouge au lieu de vert) ou alors ne rien return
        }
        
        this.board[x][y].playable = true;
    }
    supprimer(x,y){
        this.Joueur[this.board[x][y].piece.couleur].pieces--;
        this.board[x][y].piece = 0;
    }

    jouer(x, y, piece){//rajouter le coup dans l'affichage a faire par la suite
        if(this.board[x][y]!=0) this.supprimer(x, y)

        this.board[piece.x][piece.y]=0;
        piece.played = true
        piece.x = x
        piece.y = y
        this.board[x][y].piece = piece

        this.reset_playable();
    }
}


class Case{
    constructor(){ // Couleur de la case à gérer dans la partie graphique
        this.playable = false; // prévisualisation du coup jouable
        this.piece = 0; // undefined à mettre ?
    }
}
