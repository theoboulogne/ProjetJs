class Roi extends Piece{

    constructor(couleur, x, y){
        super(couleur, "Roi")

        this.x = x;
        this.y = y;
    }

    verifierboucle(pieceName,sens, plateau){
        for(let i = 0; i < sens.length; i++){
            let x = this.x + 1*sens[i][0];
            let y = this.y + 1*sens[i][1];

                //pas de décallage de x et y ?? a voir

            if (plateau.isInBoard(x,y)) while(plateau.board[x][y].piece.couleur != this.couleur){
                if (plateau.isInBoard(x,y)) for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.type == pieceName[j]) return true;
            }
        }
        return false;
    }

    verifiercote(pieceName,sens, plateau){
        for(let i = 1; i <= sens.length; i++){
            let x = this.x + 1*sens[i][0];
            let y = this.y + 1*sensy[i][1];
            if (plateau.isInBoard(x,y)) if(plateau.board[x][y].piece.couleur != this.couleur){
                for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.type == pieceName[j]) return true;
            }
        }
        return false;
    }

    echec(plateau){
        if (verifierboucle(["reine","fou"],[[1,1],[1,-1],[-1,1],[-1,-1]], plateau)) return true;
        if (verifierboucle(["reine","tour"],[[1,0],[-1,0],[0,1],[0,-1]], plateau)) return true;
        if (verifiercote(["pion"],[[1*Math.pow(-1,this.couleur + 1),1*Math.pow(-1,this.couleur + 1)],[1*Math.pow(-1,this.couleur + 1),-1*Math.pow(-1,this.couleur + 1)]], plateau)) return true;
        if (verifiercote(["cavalier"],[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]], plateau)) return true;
        return false;
    }

    playable(plateau){
        plateau.reset_playable()
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                if(plateau.isInBoard(this.x + i, this.y + j)){
                    plateau.playable(this.x + i, this.y + j, this.couleur);
                }
            }
        }
    }

    move(x,y, plateau){ //forcer playable avant move..
        if(plateau.isInBoard(x,y)){
            if(plateau.board[x][y].playable){
                plateau.jouer(x, y, this);

                plateau.Joueurs[this.couleur].roi.x = x;
                plateau.Joueurs[this.couleur].roi.y = y;
            }
        }
    }
};

module.exports = Roi;