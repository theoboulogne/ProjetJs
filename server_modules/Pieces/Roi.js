const Piece = require('./Piece');

<<<<<<< HEAD
    constructor(x, y, player){
        this.x = x;
        this.y = y;
        this.player = player;
        this.hasMoved = 0;
    }

    verifier(pieceName,sens, x, y){
         
        for(let i = 0; i < sens.length; i++){
            x += 1*sens[i][0];
            y += 1*sensy[i][1];
            if (isInBoard(x,y)) while(board[x][y].piece.couleur != this.couleur){
                if (isInBoard(x,y)) for (let j = 0; j < pieceName.length; j++) if (board[x][y].piece.name == pieceName[j]) return 1;
            }
=======
class Roi extends Piece{
    constructor(couleur, x, y){
        super(couleur, x, y)
    }

    verifierboucle(pieceName,sens, plateau){
        for(let i = 0; i < sens.length; i++){
            let x = this.x + sens[i][0];
            let y = this.y + sens[i][1];
            let boucle = true;
>>>>>>> Théo

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

<<<<<<< HEAD
    verifier2(pieceName,sens, x, y){

        for(let i = 1; i <= sens.length; i++){
            x += 1*sens[i][0];
            y += 1*sensy[i][1];
            if (isInBoard(x,y)) if(board[x][y].piece.couleur != this.couleur){
                for (let i = 0; i < pieceName.length; i++) if (board[x][y].piece.name == pieceName1) return 1;
=======
    verifiercote(pieceName,sens, plateau){
        for(let i = 0; i < sens.length; i++){
            let x = this.x + sens[i][0];
            let y = this.y + sens[i][1];

            if(plateau.check_piece(x,y)){
                 if(plateau.board[x][y].piece.couleur != this.couleur){
                    for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.constructor.name == pieceName[j]) return true;
                }
>>>>>>> Théo
            }
            
        }
        return false;
    }

<<<<<<< HEAD
    isEnEcheque(x,y){
        if (verifier(["reine","fou"],[[1,1],[1,-1],[-1,1],[-1,-1]],x,y) ||
            verifier(["reine","tour"],[[1,0],[-1,0],[0,1],[0,-1]],x,y) ||
            verifier2(["pion"],[[1*Math.pow(-1,this.couleur + 1),1*Math.pow(-1,this.couleur + 1)],[1*Math.pow(-1,this.couleur + 1),-1*Math.pow(-1,this.couleur + 1)]],x,y) ||
            verifier2(["cavalier"],[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]],x,y)) return 1;
        
        return 0;
    }
=======
    echec(plateau){

//Voir pour changer piecename par une condition avec des |
>>>>>>> Théo

//erreurs..

        if (this.verifierboucle(["Reine","Fou"],[[1,1],[1,-1],[-1,1],[-1,-1]], plateau)) return true;
        if (this.verifierboucle(["Reine","Tour"],[[1,0],[-1,0],[0,1],[0,-1]], plateau)) return true;
        if (this.verifiercote(["Pion"],[[1*Math.pow(-1,this.couleur + 1),1*Math.pow(-1,this.couleur + 1)],[1*Math.pow(-1,this.couleur + 1),-1*Math.pow(-1,this.couleur + 1)]], plateau)) return true;
        if (this.verifiercote(["Cavalier"],[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]], plateau)) return true;

        return false;
    }

<<<<<<< HEAD
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                if(isInBoard(X + i, Y + i)){
                    if(!this.isEnEcheque(X + i, Y + i)){
                        if(X + i != this.x & Y + i != this.y){
                            isPlayable.push((X + i, Y + i));
                        }
=======
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
>>>>>>> Théo
                    }
                }
            }
        }

        return (isPlayable);
    }

    roque(){
        if(this.hasMoved == 0){
            if(bord[this.x - 4][this.y].piece.constructor.name == 'Tour' && bord[this.x - 4][this.y].piece.couleur == this.couleur){
                if(bord[this.x - 4][this.y].piece.played == 0){
                    let i = 1;
                    while (i < 4 && !this.isEnEcheque(this.x - i,y) && (board[this.x - i][this.y].piece == 0)){
                        i++;
                    }
                    if (i == 4){
                        return ([this.x - 4, this.x, this.y]);
                    }
                }
            }
            if(bord[this.x + 3][this.y].piece.constructor.name == 'Tour' && bord[this.x + 3][this.y].piece.couleur == this.couleur){
                if(bord[this.x + 3][this.y].piece.played == 0){
                    let i = 1;
                    while (i < 3 && !this.isEnEcheque(this.x + i,y) && (board[this.x + i][this.y].piece == 0)){
                        i++;
                    }
                    if (i == 3){
                        return ([this.x + 3, this.x, this.y]);
                    }
                 }
            }
        }
    }

<<<<<<< HEAD
    move(x,y){
        this.x = x;
        this.y = y;
        if (this.hasMoved == 0) this.hasMoved = 1;
    }
=======
>>>>>>> Théo

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