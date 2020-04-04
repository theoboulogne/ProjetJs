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
            this.board[4][j*7].piece = new Reine(j, 4, j*7);
            this.board[3][j*7].piece = new Roi(j, 3, j*7); // mettre la coordonnée du roi depuis joueur ?
        }

        //Coté Serveur
        this.Joueurs = new Array()
        this.couts = new Array()

        //select du playable a implémenter pour la sécurité
        this.select = {x:-1, y:-1};
    }
    isInBoard(x, y){
        if(x<0||y<0||x>7||y>7) return false;
        else return true;
    }
    getBoard(x,y){
        if(this.isInBoard(x,y)) return this.board[x][y];
        else return new Case(); // Gestion de l'erreur a faire en fonction de l'utilisation, Case en attendant pour eviter l'erreur
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


    reset_playable(){
        for(let i = 0; i<8; i++){
            for(let j = 0; j<8; j++){
                this.board[i][j].playable = false;
            }
        }
    }
    playable(x,y, piece){
        if(this.isInBoard(x,y)){
            if(this.board[x][y].piece != 0) {
                if(this.board[x][y].piece.couleur == piece.couleur) return;
            }
            if(!this.check_echec(x,y,piece)) this.board[x][y].playable = true; // erreur a afficher sinon ? (ex:en rouge au lieu de vert)
        }
    }


    jouer(x, y, piece){//rajouter le coup dans l'affichage a faire par la suite + sécurité
        if(this.board[x][y].piece!=0) this.supprimer(x, y)
        
        //let deplacement = new Object(); // Vérif que ça marche bien a faire 
                                          // sinon undo les commment
        //deplacement.x = x
        //deplacement.y = y
        piece.deplacements.push({x:x, y:y});

        this.board[piece.x][piece.y].piece=0; //rajouter dans une methode ?
        piece.x = x
        piece.y = y

        this.couts.push(piece)

        this.board[x][y].piece = piece

        this.Nbtour++;
        
        this.reset_playable();
    }
    supprimer(x,y){
        if(this.isInBoard(x,y)){ // rajouter verif si pas vide
            let piece_prise = {Nbtour:this.Nbtour, piece:this.board[x][y].piece}
            this.Joueurs[this.board[x][y].piece.couleur].pieces_prises.push(piece_prise);

            this.Joueurs[this.board[x][y].piece.couleur].pieces--;
            this.board[x][y].piece = 0;
        }
    }


    echecEtMat(couleur){
        if(this.board[this.Joueurs[couleur].roi.x][this.Joueurs[couleur].roi.y].piece.echec(this)){
            for(let j = 0; j < 8; j++){
                for(let k = 0; k < 8; k++){
                    if(this.board[j][k].piece.couleur == couleur){
                        this.board[j][k].piece.playable(this);
                        for(let l = 0; l < 8; l++){
                            for(let m = 0; m < 8; m++){
                                if(this.board[l][m].playable()){
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
            return true;
        }
        return false;
    }

    
    check_echec(x, y, piece){ 

        //Clone par copie, plus long a executer mais plus simple
        // Amélioration possible en sélectionnant le strict nécessaire à cloner (Non car on l'utilise pour l'envoi au client)

        //tmpPlateau.board[i][j].piece = window[classNameString](this.board[i][j].piece.couleur)
        let tmpPlateau = this.clone();
        tmpPlateau.board[x][y].playable = true;
        tmpPlateau.board[piece.x][piece.y].piece.move(x, y, tmpPlateau);
        if(tmpPlateau.board[tmpPlateau.Joueurs[piece.couleur].roi.x][tmpPlateau.Joueurs[piece.couleur].roi.y].piece.echec(tmpPlateau)) return true;
        return false;
    }
    clone(){
        let tmp = new Plateau();

        tmp.Nbtour = this.Nbtour;
        for(let i = 0; i<8; i++){
            for(let j = 0; j<8; j++){
                if(this.board[i][j].piece == 0) tmp.board[i][j].piece = 0;
                else tmp.board[i][j].piece = this.board[i][j].piece.clone()
                //tmp.board[i][j] = this.board[i][j].clone() Useless car on l'utilise pour le move, 
                                                            //désactiver la vérif de playable coté client..
            }
        }
        tmp.Joueurs = JSON.parse(JSON.stringify(this.Joueurs));
        tmp.couts = JSON.parse(JSON.stringify(this.couts));
        return tmp;
        //for(let i=0; i<this.Joueurs.length; i++){
        //    tmp.Joueurs.push(this.Joueurs[i].clone())
        //}
        //for(let i=0; i<this.couts.length; i++){
        //    if(typeof(this.couts[i])=='String') tmp.couts.push(this.couts[i])
        //    else tmp.couts.push(this.couts[i].clone())
        //}
        //tmp.select.x = this.select.x
        //tmp.select.y = this.select.y

    }

        /*

        //Test de clone sans conservation des méthodes, trop long..

        let tmpPlateau = JSON.parse(JSON.stringify(this));

        tmpPlateau.board[x][y].piece = piece;
        tmpPlateau.board[piece.x][piece.y].piece = 0;

        tmpPlateau.board[x][y].piece.x = x;
        tmpPlateau.board[x][y].piece.y = y;

        if(piece.nom == "Pion"){
            for(let i=-1; i<2; i+=2){ // on supprime la piece en cas de prise en passant,
                if(tmpPlateau.board[piece.x+i][piece.y].piece!=0 )if(this.getBoard(piece.x+i,piece.y).piece.nom==piece.nom){
                    if(this.getBoard(piece.x+i,piece.y).piece.deplacements.length == 2 && piece.y == this.getBoard(piece.x+i,piece.y).piece.deplacements[1].y){
                        if(this.getBoard(piece.x+i,(Math.pow(-1,piece.couleur)+piece.y)).piece==0){
                            this.supprimer(piece.x+i, piece.y)
                        }
                    }
                }
            }
        }
        
        if(piece.nom=="Roi"){
            this.Joueurs[piece.couleur].roi.x = x;
            this.Joueurs[piece.couleur].roi.y = y;
        }




        // Check échec sans clone (utilisé au début mais retiré par la suite..)

        /*
        if(piece.nom == "Pion"){
            for(let i=-1; i<2; i+=2){ // on supprime la piece en cas de prise en passant,
                if(this.getBoard(piece.x+i,piece.y).piece!=0 )if(this.getBoard(piece.x+i,piece.y).piece.nom==piece.nom){
                    if(this.getBoard(piece.x+i,piece.y).piece.deplacements.length == 2 && piece.y == this.getBoard(piece.x+i,piece.y).piece.deplacements[1].y){
                        if(this.getBoard(piece.x+i,(Math.pow(-1,piece.couleur)+piece.y)).piece==0){
                            this.supprimer(piece.x+i, piece.y)
                        }
                    }
                }
            }
        }
        
        if(piece.nom=="Roi"){
            this.Joueurs[piece.couleur].roi.x = x;
            this.Joueurs[piece.couleur].roi.y = y;
        }
        
        this.jouer(x,y,piece);

        if(this.board[this.Joueurs[piece.couleur].roi.x][this.Joueurs[piece.couleur].roi.y].piece.echec(this)) tmpbool = true;
        this.cancel_jouer(x,y);
        
        return tmpbool;     
        */
       
    //Fonctions utilisées pour l'ancien check echec :
    /*
    cancel_jouer(x,y){
        this.Nbtour--;

        this.couts[this.Nbtour].x = this.couts[this.Nbtour].deplacements[this.couts[this.Nbtour].deplacements.length-2].x
        this.couts[this.Nbtour].y = this.couts[this.Nbtour].deplacements[this.couts[this.Nbtour].deplacements.length-2].y
        this.couts[this.Nbtour].deplacements.splice(this.couts[this.Nbtour].deplacements.length - 1, 1);
        

        if(this.couts[this.Nbtour].nom=="Roi"){
            this.Joueurs[this.couts[this.Nbtour].couleur].roi.x = this.couts[this.Nbtour].x;
            this.Joueurs[this.couts[this.Nbtour].couleur].roi.y = this.couts[this.Nbtour].y;
        }


        this.board[this.couts[this.Nbtour].x][this.couts[this.Nbtour].y].piece=this.couts[this.Nbtour]; 
        this.board[x][y].piece = 0

        this.cancel_supprimer(this.Nbtour, (this.couts[this.Nbtour].couleur+1)%2)
        this.couts.splice(this.couts, 1)
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
    */
}


module.exports = Plateau;
