class Roi{

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

        }
    }

    verifier2(pieceName,sens, x, y){

        for(let i = 1; i <= sens.length; i++){
            x += 1*sens[i][0];
            y += 1*sensy[i][1];
            if (isInBoard(x,y)) if(board[x][y].piece.couleur != this.couleur){
                for (let i = 0; i < pieceName.length; i++) if (board[x][y].piece.name == pieceName1) return 1;
            }
        }
    }

    isEnEcheque(x,y){
        if (verifier(["reine","fou"],[[1,1],[1,-1],[-1,1],[-1,-1]],x,y) ||
            verifier(["reine","tour"],[[1,0],[-1,0],[0,1],[0,-1]],x,y) ||
            verifier2(["pion"],[[1*Math.pow(-1,this.couleur + 1),1*Math.pow(-1,this.couleur + 1)],[1*Math.pow(-1,this.couleur + 1),-1*Math.pow(-1,this.couleur + 1)]],x,y) ||
            verifier2(["cavalier"],[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]],x,y)) return 1;
        
        return 0;
    }

    playable(){

        let X = this.x - 1;
        let Y = this.y - 1;

        let isPlayable = [];

        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                if(isInBoard(X + i, Y + i)){
                    if(!this.isEnEcheque(X + i, Y + i)){
                        if(X + i != this.x & Y + i != this.y){
                            isPlayable.push((X + i, Y + i));
                        }
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

    move(x,y){
        this.x = x;
        this.y = y;
        if (this.hasMoved == 0) this.hasMoved = 1;
    }

};

module.exports = Roi;