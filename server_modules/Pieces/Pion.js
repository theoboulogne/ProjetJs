class Pion extends Piece {
    constructor(couleur, nom){
        super(couleur, nom)

        justplayed = false;

    }

    canmove(plateau){
        plateau.reset_playable()

        //optimisation avec boucle de direction a faire..

        //rajouter fonction de verification de sortie de plateau sur les coordonnées

        // forcer le canmove lors du click sur la piece et jouer au relachement du click 
        //(piece qui suit la souris avec l'animation)

        if(!this.played) { //si jms jouée
            if(plateau.vide(this.x,(Math.pow(-1,couleur)*(this.y+2)))) {
                plateau.playable(this.x,(Math.pow(-1,couleur)*(this.y+2)),this.couleur)
            }
        }
        //déplacement par défault
        if(plateau.vide(this.x,(Math.pow(-1,couleur)*(this.y+1)))){
            plateau.playable(this.x,(Math.pow(-1,couleur)*(this.y+1)),this.couleur)
        }

        
        for(let i=-1; i<2; i+=2) {
            //prise de piece
            if(!plateau.vide(this.x + i,(Math.pow(-1,couleur)*(this.y+1)))){
                plateau.playable(this.x + i,(Math.pow(-1,couleur)*(this.y+1)),this.couleur)
            }
            //prise en passant
            if(plateau.board[this.x + i][this.y].piece.type==this.type){ //regarder la class directement?
                if(plateau.board[this.x + i][this.y].piece.justplayed){
                    if(plateau.vide(this.x + i,(Math.pow(-1,couleur)*(this.y+1)))){
                        plateau.playable(this.x + i,(Math.pow(-1,couleur)*(this.y+1)),this.couleur)
                    }
                }
            }

        }

    }


    move(x,y,plateau){
        if(plateau.board[x][y].playable){
            if((x == this.x)&&(y == this.y+(Math.pow(-1,couleur)*2))) this.justplayed = true;

            if(plateau.board[this.x-1][this.y].piece.type==this.type){
                if(plateau.board[this.x-1][this.y].piece.justplayed){
                    if(plateau.board[this.x-1][(Math.pow(-1,couleur)*(this.y+1))].piece==0){
                        plateau.supprimer(this.x-1, this.y)
                        //Methode pour supprimer une piece a utiliser pour (this.x-1 this.y)
                    }
                }
            } //optimisation possible avec une boucle de direction..
            if(plateau.board[this.x+1][this.y].piece.type==this.type){
                if(plateau.board[this.x+1][this.y].piece.justplayed){
                    if(plateau.board[this.x+1][(Math.pow(-1,couleur)*(this.y+1))].piece==0){
                        plateau.supprimer(this.x+1, this.y)
                        //Methode pour supprimer une piece a utiliser pour (this.x+1 this.y)
                    }
                }
            }
            
            plateau.jouer(x, y, this);
        }
    }
}