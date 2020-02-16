class Tour{
    constructor(player, x, y){
        console.log('Class instanciée');
        this.x = x;
        this.y = y;
        this.player;
    }

    playable() {

        scan = [[-1,0][1,0][0,-1][0,1][-1,1][1,1][1,-1][1,1]];

        for (let j=0; j<scan.length; j++){
            let i = 1;
            while(inTab((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i)) && (( this.x + (scan[j][0] * i),this.y + (scan[j][1] * i) ) != couleur) ){
                if (( board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece != this.couleur) || (board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece == 0) ) {
                    board.playable((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i),this.couleur);
                }
                i++
            }
        }




    }

    /*
    move(x, y) {

        board[x][y] = 
    }

    delete() {

    }

    */





}

module.exports = Class;