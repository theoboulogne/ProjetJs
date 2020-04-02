const Piece = require('./Piece');

class Roi extends Piece{
    constructor(couleur, x, y){
        super(couleur, x, y)
    }

    verifierboucle(pieceName,sens, plateau){
        for(let i = 0; i < sens.length; i++){
            let x = this.x + sens[i][0];
            let y = this.y + sens[i][1];
            let boucle = true;

            if (plateau.isInBoard(x,y)) while(boucle){
                if(plateau.check_piece(x,y)){
                    if(plateau.board[x][y].piece.couleur == this.couleur) boucle = false;
                    else for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.constructor.name == pieceName[j]) return true;
                }
                x += sens[i][0]
                y += sens[i][1]
                if(!plateau.isInBoard(x,y)) boucle = false;
            }
        }
        return false;
    }

    verifiercote(pieceName,sens, plateau){
        for(let i = 0; i < sens.length; i++){
            let x = this.x + sens[i][0];
            let y = this.y + sens[i][1];

            if(plateau.check_piece(x,y)){
                 if(plateau.board[x][y].piece.couleur != this.couleur){
                    for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.constructor.name == pieceName[j]) return true;
                }
            }
            
        }
        return false;
    }

    echec(plateau){

//Voir pour changer piecename par une condition avec des |

        if (this.verifierboucle(["Reine","Fou"],[[1,1],[1,-1],[-1,1],[-1,-1]], plateau)) return true;
        if (this.verifierboucle(["Reine","Tour"],[[1,0],[-1,0],[0,1],[0,-1]], plateau)) return true;
        if (this.verifiercote(["Pion"],[[1*Math.pow(-1,this.couleur + 1),1*Math.pow(-1,this.couleur + 1)],[1*Math.pow(-1,this.couleur + 1),-1*Math.pow(-1,this.couleur + 1)]], plateau)) return true;
        if (this.verifiercote(["Cavalier"],[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]], plateau)) return true;

        return false;
    }

    playable(plateau){
        plateau.reset_playable()
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                if(plateau.isInBoard(this.x + i, this.y + j)){
                    if(plateau.board[this.x + i][this.y + j].piece == 0){
                        if(!(i == 0 && j == 0)) plateau.playable(this.x + i, this.y + j, this.couleur);
                    }
                    else if (plateau.board[this.x + i][this.y + j].piece.couleur != this.couleur){
                        if(!(i == 0 && j == 0)) plateau.playable(this.x + i, this.y + j, this.couleur);
                    }
                }
            }
        }

        return (isPlayable);
    }

    roque(plateau){
        let renvoi = [];
        let valeurs = [-4,3];
        
        let tempX = this.x;

        if(this.deplacements.length == 0){
            for (let j = 0; j < valeurs.length; j++){
                if(plateau.board[this.x + valeurs[j]][this.y].piece.constructor.name == 'Tour' && plateau.board[this.x + valeurs[j]][this.y].piece.deplacements.length == 0){
                    let i = 1;
                    while (i < Math.abs(valeurs[j]) && (plateau.board[tempX - i][this.y].piece == 0)){
                        this.x--;
                        if(i < 3){
                            if(this.echec(plateau)){
                                i = i + Math.abs(valeurs[j]);
                            }
                        }
                        i++;
                    }
                    this.x = tempX;
                    if (i == Math.abs(valeurs[j])){
                        renvoi.push([this.x + valeurs[j], this.x, this.y]);
                    }
                }
            }
        }
        return renvoi;
    }


    move(x,y, plateau){ 
        if(plateau.isInBoard(x,y)){
            if(plateau.board[x][y].playable){
                plateau.jouer(x, y, this); // appeler méthode du parent ?

                plateau.Joueurs[this.couleur].roi.x = x;
                plateau.Joueurs[this.couleur].roi.y = y;
            }
        }
    }
};


module.exports = Roi;