class Plateau{
    constructor(){
        console.log('Plateau instanciée');
        this.Joueurs = new Array(2)
        for(let i =0 ; i<2; i++){ // 0 blanc, 1 noir
            this.Joueurs = new Joueur(i);
        }
        

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
            for(let i=0; i<8; i++) this.board[i][1 + (j*5)].piece = new Pion(j);
            for(let i=0; i<2; i++) this.board[i*7][j*7].piece = new Tour(j);
            for(let i=0; i<2; i++) this.board[1 + (i*5)][j*7].piece = new Cavalier(j);
            for(let i=0; i<2; i++) this.board[2 + (i*3)][j*7].piece = new Fou(j);
            this.board[3 + j][j*7].piece = new Reine(j);
            this.board[4 - j][j*7].piece = new Roi(j); // mettre la coordonnée du roi depuis joueur ?
        }

        


        //rajouter gestion de l'erreur sur getBoard

        //rajouter un moyen de reset justplayed du pion intelligemment.. 

    }
    isInBoard(x, y){
        if(x<0||y<0||x>7||y>7) return false;
        else return true;
    }
    getBoard(x,y){
        if(this.isInBoard(x,y)) return this.board[x][y];
        else return Case(); // Gestion de l'erreur a faire en fonction de l'utilisation, Case en attendant pour eviter l'erreur
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

    vide(x,y){
        if(this.isInBoard(x,y)){
            if(this.board[x][y].piece == 0) return true;
            else return false;
        }
        else return null;
    }

    jouer(x, y, piece){//rajouter le coup dans l'affichage a faire par la suite + sécurité
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
