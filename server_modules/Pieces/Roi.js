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
                    else for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.nom == pieceName[j]) return true;
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
                    for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.nom == pieceName[j]) return true;
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
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                if(plateau.isInBoard(this.x + i, this.y + j)){
                    if(plateau.board[this.x + i][this.y + j].piece == 0){
                        if(!(i == 0 && j == 0)) plateau.playable(this.x + i, this.y + j, this);
                    }
                    else if (plateau.board[this.x + i][this.y + j].piece.couleur != this.couleur){
                        if(!(i == 0 && j == 0)) plateau.playable(this.x + i, this.y + j, this);
                    }
                }
            }
        }
        let roque = this.roquePlayable(plateau);
        for (let k = 0; k < 2; k++){
            if (roque[k]) plateau.playable(this.x, this.y + (7*k-4), this);
        }
    }

    roquePlayable(plateau){
        let renvoi = [0,0];
        let valeurs = [-4,3];
       
        let tempX = this.x;
 
        if(this.deplacements.length == 0){
            for (let j = 0; j < valeurs.length; j++){
                if(plateau.board[this.x + valeurs[j]][this.y].piece.name == 'Tour' && plateau.board[this.x + valeurs[j]][this.y].piece.deplacements.length == 0){
                    let i = 1;
                    while (i < Math.abs(valeurs[j]) && (plateau.board[tempX - i][this.y].piece == 0)){
                        this.x = this.x + (valeurs[j]/Math.abs(valeurs[j]));
                        if(i < 3){
                            if(this.echec(plateau)){
                                i = i + Math.abs(valeurs[j]);
                            }
                        }
                        i++;
                    }
                    this.x = tempX;
                    if (i == Math.abs(valeurs[j])){
                        renvoi[j];
                    }
                }
            }
        }
        return renvoi;
    }

    move(x,y, plateau){ 
        if(plateau.isInBoard(x,y)){
            if(plateau.board[x][y].playable){
                let diff = y - this.y;
                if(Math.abs(diff) == 2){
                    plateau.jouer(x,y,this);
                    if (diff == -2) plateau.jouer(x,y + 1,plateau.board[this.x][this.y - 4].piece);
                    else plateau.jouer(x,y - 1,plateau.board[this.x][this.y + 3].piece);

                    plateau.Nbtour--;

                    plateau.couts.splice(couts.length()-2, 2);

                    if(diff == 2)  plateau.couts.push("Petit roque");
                    else plateau.couts.push("Grand roque");
                }
                else{
                    plateau.jouer(x, y, this); // appeler méthode du parent ?

                }
                plateau.Joueurs[this.couleur].roi.x = x;
                plateau.Joueurs[this.couleur].roi.y = y;
            }
        }
    }
};


module.exports = Roi;