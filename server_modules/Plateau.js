const Roi = require('./Pieces/Roi');
const Pion = require('./Pieces/Pion');
const Fou = require('./Pieces/Fou');
const Cavalier = require('./Pieces/Cavalier');
const Reine = require('./Pieces/Reine');
const Tour = require('./Pieces/Tour');

const Case = require('./Case');

class Plateau{
    constructor(){

        this.ia = 0 //variable pour signaler le mode IA ou non 
        this.ModeIA = 0;

        this.Nbtour = 0;
        this.board = new Array(8)
        for(let i = 0; i<8; i++){
            this.board[i] = new Array(8)
            for(let j = 0; j<8; j++){
                this.board[i][j] = new Case();
            }
        }
        let idGeneration = 0 // on définit un Id à la génération pour chaque pièce afin de pouvoir les sélectionner 
                             // correctement et ainsi éviter les problèmes liés aux fonctions de déplacement qui sont
                             // executées lorsque l'on est sur la page 
                             // (sinon lors de la prise d'une pièce il arrive que la pièce déplacée soit supprimée également..)
        for(let j=0; j<2; j++){                                                                    //
            for(let i=0; i<8; i++) {                                                               //
                this.board[i][1 + (j*5)].piece = new Pion(j, i, 1 + (j*5), idGeneration);          //
                idGeneration++;                                                                    //
            }                                                                                      //
            for(let i=0; i<2; i++) {                                                               //
                this.board[i*7][j*7].piece = new Tour(j, i*7, j*7, idGeneration);                  //
                idGeneration++;                                                                    //
            }                                                                                      //
            for(let i=0; i<2; i++) {                                                               // On créé chaque pieces pour chaque joueurs avec 
                this.board[1 + (i*5)][j*7].piece = new Cavalier(j, 1 + (i*5), j*7, idGeneration);  // leur couleur,
                idGeneration++;                                                                    // leurs positions,
            }                                                                                      // et leur ID
            for(let i=0; i<2; i++) {                                                               //
                this.board[2 + (i*3)][j*7].piece = new Fou(j, 2+ (i*3), j*7, idGeneration);        //
                idGeneration++;                                                                    //
            }                                                                                      //
            this.board[4][j*7].piece = new Reine(j, 4, j*7, idGeneration);                         //
            idGeneration++;                                                                        //
            this.board[3][j*7].piece = new Roi(j, 3, j*7, idGeneration);                           //
            idGeneration++;                                                                        //
        }

        this.Joueurs = new Array()
        this.coups = new Array()

        //Case sélectionnée du playable
        this.select = {x:-1, y:-1};
    }

    //Méthodes d'accès au board
    isInBoard(x, y){
        if(x<0||y<0||x>7||y>7) return false;
        else return true;
    }
    getBoard(x,y){
        if(this.isInBoard(x,y)) return this.board[x][y];
        else return new Case(); 
    }
    
    //Méthode de vérification pour la présence de pièce (2 méthodes par rapport à la gestion d'erreur)
    check_vide(x,y){
        if(this.isInBoard(x,y)) return (this.board[x][y].piece == 0);
        return false;
    }
    check_piece(x,y){
        if(this.isInBoard(x,y)) return (this.board[x][y].piece != 0);
        return false;
    }

    //Méthodes de gestion des cases jouables
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
            if(!this.check_echec(x,y,piece)) this.board[x][y].playable = true; 
        }
    }

// méthodes de jeu pour bouger et manger des pièces
    jouer(x, y, piece){
        this.supprimer(x, y) // on mange la case d'arrivé au cas où il y a une pièce
        
        piece.deplacements.push({x:x, y:y}); // on enregistre le déplacement

        this.board[piece.x][piece.y].piece=0;
        piece.x = x                           // on bouge la piece coté piece et on la supprime sur le plateau
        piece.y = y

        this.coups.push(JSON.parse(JSON.stringify(piece))) // on enregistre le coup ( par copie pour éviter les pb de portée de variable )

        this.board[x][y].piece = piece       // on met la piece sur sa destination

        this.Nbtour++;                       // on augmente le nombre de tour

        this.select = {x:-1, y:-1};          // on de-selectione la piece jouée
        this.reset_playable();
    }
    supprimer(x,y){
        if(this.check_piece(x, y)){
            let piece_prise = {Nbtour:this.Nbtour, piece:this.board[x][y].piece}//Enregistrement pièce prise
            this.Joueurs[this.board[x][y].piece.couleur].pieces_prises.push(piece_prise);
            //Retrait de la pièce du board
            this.board[x][y].piece = 0;
        }
    }

    // Méthode d'évaluation du mat
    echecEtMat(couleur){
        if(this.board[this.Joueurs[couleur].roi.x][this.Joueurs[couleur].roi.y].piece.echec(this)){ // si le roi est en échec
            if(!this.check_CanMovePieces(couleur)) return true; // on regarde si une piece peu bouger
        }
        return false;
    }

    pat(couleur){
        // Vérification de la possibilité de se déplacer du joueur
        //On check le roi en premier pour éviter les test inutiles
        if(!this.check_CanMovePiece(this.Joueurs[couleur].roi.x,this.Joueurs[couleur].roi.y)){ // si il peut pas bouger on vérifie les autres pièces
            if(!this.check_CanMovePieces(couleur)){ // on regarde si une piece peu bouger
                return true; // si aucunes pièces ne peut bouger on renvoi vrai
            }
        }
        // Maintenant on vient vérifier la répétition des 3 coups pour le nul 
        //(on le garde dans la même fonction 'pat' pour éviter la multiplication des events socket.io)
        if(this.coups.length>10){ // on se garde une marge pour éviter les dépassements du tableau et aussi vu que la règle n'est jamais appliquée en début de partie
            let compteur = 0;
            let debutIdx = this.coups.length-8; // on vient vérifier sur 4 tours pour vérifier 2 paires de coups

            for(let i=0; i<3; i+=2){ // les 2 paires(décallage de 2 car 2 coups par tour)
                if(this.check_coups_egaux(debutIdx+i, debutIdx+4+i) && this.check_coups_egaux(debutIdx+1+i, debutIdx+5+i)){ // on vérifie les 2 joueurs
                    compteur++;
                }
            }
            if(compteur == 2) return true; // si les 2 paires correspondent on met nul 
            //(répétition de 4 coups au lieu de 3 pour éviter que ça se déclenche en début de partie)
        }

        return false;
    }

    check_coups_egaux(idx1, idx2){//meme nom et meme position
        if(this.coups[idx1].nom == this.coups[idx2].nom){
            if(this.coups[idx1].x == this.coups[idx2].x){
                if(this.coups[idx1].y == this.coups[idx2].y){
                    return true;
                }
            }
        }
        return false;
    }
    check_CanMovePieces(couleur){
        for(let i = 0; i < 8; i++){                               // On parcourt le plateau
            for(let j = 0; j < 8; j++){                           //
                if(this.board[i][j].piece.couleur == couleur){    // Quand une piece est de la meme couleur que celle demandé
                    if(this.check_CanMovePiece(i, j)) return true // si on peut la bouger on renvoi true
                }
            }
        }
        this.reset_playable()
        return false;                // si on ne s'est pas arreté alors aucune piece ne peu bouger
    }
    check_CanMovePiece(x, y){
        this.reset_playable()
        this.board[x][y].piece.playable(this);        // On lui lance sa fonction playable
        for(let l = 0; l < 8; l++){                   //
            for(let m = 0; m < 8; m++){               //
                if(this.board[l][m].playable){        // Si elle peu bouger sur une case 
                    this.reset_playable()
                    return true;                      // on s'arrete sinon on continue
                }
            }
        }
        this.reset_playable()
        return false; // alors elle ne peut pas bouger
    }

    check_echec(x, y, piece){ // on vérifie qu'un coup ne met pas notre roi en echec

        //Clone par copie, plus long a executer mais plus simple à comprendre

        let tmpPlateau = this.clone();
        tmpPlateau.board[x][y].playable = true;
        tmpPlateau.board[piece.x][piece.y].piece.move(x, y, tmpPlateau);
        if(tmpPlateau.board[tmpPlateau.Joueurs[piece.couleur].roi.x][tmpPlateau.Joueurs[piece.couleur].roi.y].piece.echec(tmpPlateau)) return true;
        return false;
    }
    clone(){ // on copie le plateau pour effectuer le coup virtuelement pour le test check_echec()
             // notre IA est recursive donc pour éviter de chambouler le jeu, pour chaque test on clone le plateau
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
        tmp.coups = JSON.parse(JSON.stringify(this.coups));

        tmp.chrono = JSON.parse(JSON.stringify(this.chrono))

        return tmp;


    }
}
        // Ancienne méthode de clone, non conservée car inutile

        // for(let i=0; i<this.Joueurs.length; i++){
        //    tmp.Joueurs.push(this.Joueurs[i].clone())
        // }
        // for(let i=0; i<this.coups.length; i++){
        //    if(typeof(this.coups[i])=='String') tmp.coups.push(this.coups[i])
        //    else tmp.coups.push(this.coups[i].clone())
        // }
        // tmp.select.x = this.select.x
        // tmp.select.y = this.select.y

        /*

        
        //tmpPlateau.board[i][j].piece = window[classNameString](this.board[i][j].piece.couleur)

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

            this.coups[this.Nbtour].x = this.coups[this.Nbtour].deplacements[this.coups[this.Nbtour].deplacements.length-2].x
            this.coups[this.Nbtour].y = this.coups[this.Nbtour].deplacements[this.coups[this.Nbtour].deplacements.length-2].y
            this.coups[this.Nbtour].deplacements.splice(this.coups[this.Nbtour].deplacements.length - 1, 1);
            

            if(this.coups[this.Nbtour].nom=="Roi"){
                this.Joueurs[this.coups[this.Nbtour].couleur].roi.x = this.coups[this.Nbtour].x;
                this.Joueurs[this.coups[this.Nbtour].couleur].roi.y = this.coups[this.Nbtour].y;
            }


            this.board[this.coups[this.Nbtour].x][this.coups[this.Nbtour].y].piece=this.coups[this.Nbtour]; 
            this.board[x][y].piece = 0

            this.cancel_supprimer(this.Nbtour, (this.coups[this.Nbtour].couleur+1)%2)
            this.coups.splice(this.coups, 1)
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


module.exports = Plateau;
