class Plateau{
    constructor(){
        console.log('Plateau instanciée');
        this.Joueurs = new Array(2)
        for(let i =0 ; i<2; i++) this.Joueurs[i] = new Joueur(i);// 0 blanc, 1 noir
        

        //this.PiecesPrises = new Array(2)
        //for(let i=0; i<2; i++) this.PiecesPrises[i] = []

        this.board = new Array(8)
        for(let i = 0; i<8; i++){
            this.board[i] = new Array(8)
            for(let j = 0; j<8; j++){
                this.board[i][j] = new Case();
            }
        }

        for(let j=0; j<2; j++){
            for(let i=0; i<8; i++) this.board[i][1 + (j*5)].piece = new Pion(j, i, 1 + (j*5));
            for(let i=0; i<2; i++) this.board[i*7][j*7].piece = new Tour(j, i*7, j*7);
            for(let i=0; i<2; i++) this.board[1 + (i*5)][j*7].piece = new Cavalier(j, 1 + (i*5), j*7);
            for(let i=0; i<2; i++) this.board[2 + (i*3)][j*7].piece = new Fou(j, 2+ (i*3), j*7);
            this.board[3 + j][j*7].piece = new Reine(j, 3+j, j*7);
            this.board[4 - j][j*7].piece = new Roi(j, 4-j, j*7); // mettre la coordonnée du roi depuis joueur ?
        }

        

        this.select = new Object() // classe coo a faire
        this.select.x = -1;
        this.select.y = -1;

        //rajouter gestion de l'erreur sur getBoard

        //rajouter un moyen de reset justplayed du pion intelligemment.. 

    }
    isInBoard(x, y){
        if(x<0||y<0||x>7||y>7) return false;
        else return true;
    }
    getBoard(x,y){
        if(this.isInBoard(x,y)) return this.board[x][y];
        else return new Case(); // Gestion de l'erreur a faire en fonction de l'utilisation, Case en attendant pour eviter l'erreur
    }
    reset_playable(){
        for(let i = 0; i<8; i++){
            for(let j = 0; j<8; j++){
                this.board[i][j].playable = false;
            }
        }
    }
    playable(x,y, couleur){

        //tester si il y a un echec après que le coup est joué et pas avant..
        
        if(this.isInBoard(x,y)){
            if(!this.board[this.Joueurs[couleur].roi.x][this.Joueurs[couleur].roi.y].piece.echec(this)){ //sur le type ?
                this.board[x][y].playable = true; // erreur a afficher sinon ? (ex:en rouge au lieu de vert)
            }
        }
        
        
    }
    supprimer(x,y){
        if(this.isInBoard(x,y)){ // rajouter verif si pas vide
            this.Joueurs[this.board[x][y].piece.couleur].pieces--;
            this.board[x][y].piece = 0;
        }
    }

    check_vide(x,y){
        if(this.isInBoard(x,y)){
            if(this.board[x][y].piece == 0) return true;
        }
        return false;
    }
    check_piece(x,y){
        if(this.isInBoard(x,y)){
            if(this.board[x][y].piece != 0) return true;
        }
        return false;
    }

    jouer(x, y, piece){//rajouter le coup dans l'affichage a faire par la suite + sécurité
        if(this.board[x][y].piece!=0) this.supprimer(x, y)

        this.board[piece.x][piece.y].piece=0; //rajouter dans une methode ?
        piece.played = true
        piece.x = x
        piece.y = y
        this.board[x][y].piece = piece
    }
}


class Case{
    constructor(){ // Couleur de la case à gérer dans la partie graphique
        this.playable = false; // prévisualisation du coup jouable
        this.piece = 0; // undefined à mettre ?
    }
}
