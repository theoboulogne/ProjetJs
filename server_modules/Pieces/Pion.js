const Piece = require('./Piece');

class Pion extends Piece {
    constructor(couleur, x, y, id){
        super(couleur, x, y, id)
    }

    playable(plateau){
        if(this.deplacements.length == 1) { //si jms jouée
            if(plateau.isInBoard(this.x,this.y+(Math.pow(-1,this.couleur)*(2)))){
                if(plateau.check_vide(this.x,this.y+(Math.pow(-1,this.couleur)*(2)))&&plateau.check_vide(this.x,this.y+(Math.pow(-1,this.couleur)))) {
                    plateau.playable(this.x,this.y+(Math.pow(-1,this.couleur)*(2)),this)
                }
            }
        }
        //déplacement par défault
        if(plateau.isInBoard(this.x,this.y+(Math.pow(-1,this.couleur)*(1)))){
            if(plateau.check_vide(this.x,this.y+(Math.pow(-1,this.couleur)*(1)))){
                plateau.playable(this.x,this.y+(Math.pow(-1,this.couleur)*(1)), this)
            }
        }
        
        for(let i=-1; i<2; i+=2) {
            //prise de piece
            if(plateau.isInBoard(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)))){
                if(plateau.check_piece(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)))){
                    if(plateau.board[this.x + i][this.y+(Math.pow(-1,this.couleur)*(1))].piece.couleur != this.couleur){
                        plateau.playable(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)),this)
                    }
                }
            }
            //prise en passant
            if(plateau.isInBoard(this.x + i, this.y)){
                if(plateau.getBoard(this.x + i,this.y).piece.nom==this.nom){ 
                    if(plateau.getBoard(this.x+i,this.y).piece.deplacements.length == 2 && this.y == plateau.getBoard(this.x+i,this.y).piece.deplacements[1].y){
                        if(Math.abs(plateau.getBoard(this.x+i,this.y).piece.deplacements[1].y-plateau.getBoard(this.x+i,this.y).piece.deplacements[0].y)==2){
                            if(plateau.isInBoard(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)))){
                                if(plateau.check_vide(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)))){
                                    plateau.playable(this.x + i,this.y+(Math.pow(-1,this.couleur)*(1)), this)
                                }
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
                for(let i=-1; i<2; i+=2){ // on supprime la piece en cas de prise en passant,
                    if(plateau.getBoard(this.x+i,this.y).piece.nom==this.nom && plateau.getBoard(this.x+i,this.y).piece.couleur != this.couleur){
                        if(x==this.x+i && y==this.y+(Math.pow(-1,this.couleur))){
                            if(plateau.getBoard(this.x+i,this.y).piece.deplacements.length == 2 && this.y == plateau.getBoard(this.x+i,this.y).piece.deplacements[1].y){
                                if(plateau.getBoard(this.x+i,(Math.pow(-1,this.couleur)+this.y)).piece==0){
                                    plateau.supprimer(this.x+i, this.y)
                                }
                            }
                        }
                    }
                }
                plateau.jouer(x, y, this);
            }
        }
    }

    promotion(nomPiece){
        const P = eval("require('./"+nomPiece+"')") //On appelle la pièce demandée
        let tmp = new P(this.couleur, this.x, this.y, this.id)
        tmp.deplacements.pop()
        for(let i=0; i<this.deplacements.length; i++) tmp.deplacements.push(this.deplacements[i])
        return tmp;
    }
}

module.exports = Pion;