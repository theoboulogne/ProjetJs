class Cavalier extends Piece{
    constructor(couleur, x, y){
        super(couleur, x, y)
 // TOTALEMENT A FAIRE, CLASSE TEST POUR RENDERCSS
    }

    playable(plateau) {
        plateau.reset_playable()
        let scan = [[-1,0],[1,0],[0,-1],[0,1]];
        for (let j=0, i=1; j<scan.length; j++){
            while(plateau.isInBoard((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i)) && (( this.x + (scan[j][0] * i),this.y + (scan[j][1] * i) ) != this.couleur) ){
                if (( plateau.board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece != this.couleur) || (plateau.board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece == 0) ) {
                    plateau.playable((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i),this.couleur)
                }
                i++
            }
        }
    }

}
