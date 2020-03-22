const Roi = require('./Pieces/Roi');
const Pion = require('./Pieces/Pion');
const Fou = require('./Pieces/Fou');
const Cavalier = require('./Pieces/Cavalier');
const Reine = require('./Pieces/Reine');
const Tour = require('./Pieces/Tour');

const Case = require('./Case');
//const Joueur = require('./Joueur'); // a verifier l'utilité pour joueur

class Plateau{
    constructor(){
        console.log('Plateau instanciée');

        //Coté Client
        this.Nbtour = 0;
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

        //Coté Serveur
        this.Joueurs = new Array()
        this.couts = new Array()
        this.select = new Object() // classe coo a faire
        this.select.x = -1;
        this.select.y = -1;
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

    check_echec(x, y, couleur, piece){ // couleur optionnelle ?
        let tmpbool = false;
        console.log(piece)
        if(piece.constructor.name == "Pion"){
            for(let i=-1; i<2; i+=2){ // on supprime la piece en cas de prise en passant,
                if(this.getBoard(piece.x+i,piece.y).piece!=0 )if(this.getBoard(piece.x+i,piece.y).piece.constructor.name==piece.constructor.name){
                    if(this.getBoard(piece.x+i,piece.y).piece.deplacements.length == 2 && piece.y == this.getBoard(piece.x+i,piece.y).piece.deplacements[1].y){
                        if(this.getBoard(piece.x+i,(Math.pow(-1,piece.couleur)+piece.y)).piece==0){
                            this.supprimer(piece.x+i, piece.y)
                        }
                    }
                }
            }
        }
        
        if(piece.constructor.name=="Roi"){
            this.Joueurs[couleur].roi.x = x;
            this.Joueurs[couleur].roi.y = y;
        }
        
        this.jouer(x,y,piece);



        console.log(piece)
        console.log(this.Joueurs)
        if(this.board[this.Joueurs[couleur].roi.x][this.Joueurs[couleur].roi.y].piece.echec(this)) tmpbool = true;
        this.cancel_jouer(x,y);
        
        console.log(tmpbool)
        return tmpbool;     
    }


    playable(x,y, couleur, piece){
        if(this.isInBoard(x,y)){
            if(this.board[x][y].piece != 0) {
                if(this.board[x][y].piece.couleur == couleur) return;
            }
            if(!this.check_echec(x,y,couleur,piece)) this.board[x][y].playable = true; // erreur a afficher sinon ? (ex:en rouge au lieu de vert)
        }
        
        
    }
    supprimer(x,y){
        if(this.isInBoard(x,y)){ // rajouter verif si pas vide
            let piece_prise = new Object();
            piece_prise.Nbtour = this.Nbtour;
            piece_prise.piece = this.board[x][y].piece;
            this.Joueurs[this.board[x][y].piece.couleur].pieces_prises.push(piece_prise);

            this.Joueurs[this.board[x][y].piece.couleur].pieces--;
            this.board[x][y].piece = 0;
        }
    }
    cancel_supprimer(Nbtour, couleur){ // en fonction du nombre de tour pour la prise en passant..
        if(this.Joueurs[couleur].pieces_prises.length > 0){
            let x = this.Joueurs[couleur].pieces_prises[this.Joueurs[couleur].pieces_prises.length - 1].piece.x
            let y = this.Joueurs[couleur].pieces_prises[this.Joueurs[couleur].pieces_prises.length - 1].piece.y
            let piece = this.Joueurs[couleur].pieces_prises[this.Joueurs[couleur].pieces_prises.length - 1].piece
            if(this.Joueurs[couleur].pieces_prises[this.Joueurs[couleur].pieces_prises.length - 1].Nbtour == Nbtour){
                // si le bon tour
                this.Joueurs[couleur].pieces++;
                this.board[x][y].piece = piece;
            }
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
    console.log('jouer')
        if(this.board[x][y].piece!=0) this.supprimer(x, y)
        
        let deplacement = new Object(); // class coo a faire..
        deplacement.x = x
        deplacement.y = y
        piece.deplacements.push(deplacement)

        this.board[piece.x][piece.y].piece=0; //rajouter dans une methode ?
        piece.x = x
        piece.y = y

        this.couts.push(piece)

        this.board[x][y].piece = piece

        this.Nbtour++;
    }
    cancel_jouer(x,y){
        this.Nbtour--;

        console.log(this.couts)
        console.log(this.Nbtour)


        this.couts[this.Nbtour].x = this.couts[this.Nbtour].deplacements[this.couts[this.Nbtour].deplacements.length-2].x
        this.couts[this.Nbtour].y = this.couts[this.Nbtour].deplacements[this.couts[this.Nbtour].deplacements.length-2].y
        this.couts[this.Nbtour].deplacements.splice(this.couts[this.Nbtour].deplacements.length - 1, 1);
        

        if(this.couts[this.Nbtour].constructor.name=="Roi"){
            this.Joueurs[this.couts[this.Nbtour].couleur].roi.x = this.couts[this.Nbtour].x;
            this.Joueurs[this.couts[this.Nbtour].couleur].roi.y = this.couts[this.Nbtour].y;
        }


        this.board[this.couts[this.Nbtour].x][this.couts[this.Nbtour].y].piece=this.couts[this.Nbtour]; 
        this.board[x][y].piece = 0

        this.cancel_supprimer(this.Nbtour, (this.couts[this.Nbtour].couleur+1)%2)
        this.couts.splice(this.couts, 1)
    }
}


module.exports = Plateau;
