class Pion extends Piece {
    constructor(couleur, x, y){
        super(couleur, x, y)

        this.justplayed = false;
    }

    playable(plateau){
        //plateau.reset_playable() à forcer

        //optimisation avec boucle de direction a faire..

        //rajouter fonction de verification de sortie de plateau sur les coordonnées

        // forcer le canmove lors du click sur la piece et jouer au relachement du click 
        //(piece qui suit la souris avec l'animation)
        if(!this.played) { //si jms jouée
            if(plateau.isInBoard(this.x,this.y+(Math.pow(-1,this.couleur)*(2)))){
                if(plateau.check_vide(this.x,this.y+(Math.pow(-1,this.couleur)*(2)))) {
                    plateau.playable(this.x,this.y+(Math.pow(-1,this.couleur)*(2)),this.couleur)
                }
            }
        }
        //déplacement par défault
        if(plateau.isInBoard(this.x,this.y+(Math.pow(-1,this.couleur)*(1)))){
            if(plateau.check_vide(this.x,this.y+(Math.pow(-1,this.couleur)*(1)))){
                plateau.playable(this.x,this.y+(Math.pow(-1,this.couleur)*(1)),this.couleur)
            }
        }
        
        for(let i=-1; i<2; i+=2) {
            //prise de piece
            if(plateau.isInBoard(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)))){
                if(plateau.check_piece(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)))){
                    plateau.playable(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)),this.couleur)
                }
            }
            //prise en passant
            if(plateau.isInBoard(this.x + i, this.y)){
                if(plateau.getBoard(this.x + i,this.y).piece.constructor.name==this.constructor.name){ //regarder la class directement?
                    if(plateau.getBoard(this.x + i,this.y).piece.justplayed){
                        if(plateau.isInBoard(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)))){
                            if(plateau.check_vide(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)))){
                                plateau.playable(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)),this.couleur)
                            }
                        }
                    }
                }
            }

        }

    }


    move(x,y,plateau){
        if(plateau.isInBoard(x,y)){
            if(plateau.board[x][y].playable){
                if((x == this.x)&&(y == this.y+(Math.pow(-1,this.couleur)*2))) this.justplayed = true;

                for(let i=-1; i<2; i+=2){ // on supprime la piece en cas de prise en passant,
                    // rajouter check si vide
                    if(plateau.getBoard(this.x+i,this.y).piece.constructor.name==this.constructor.name){
                        if(plateau.getBoard(this.x+i,this.y).piece.justplayed){
                            if(plateau.getBoard(this.x+i,(Math.pow(-1,this.couleur)+this.y)).piece==0){
                                plateau.supprimer(this.x+i, this.y)
                            }
                        }
                    }
                }
                
                plateau.jouer(x, y, this); // rajouter le changement de piece sur la derniere ligne
            }
        }
    }
}