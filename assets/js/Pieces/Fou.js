class Fou extends Piece{
    constructor(couleur, x, y){
        super(couleur, x, y)
    }

    playable(plateau) {
        plateau.reset_playable()
<<<<<<< HEAD:server_modules/Pieces/Fou.js
        scan = [[-1,1][1,1][1,-1][1,1]];
        for (let j=0, i=1; j<scan.length; j++){
            while ( plateau.isInBoard( (this.x + (scan[j][0] * i)), (this.y + (scan[j][1] * i)) ) && (plateau.board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece != this.couleur) ){
                // tant que que la positionXY est sur le plateau et qu'il n'y a pas de pion de la couleur du joueur à cette case :
                    if (plateau.board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece == 0) {     
                        plateau.playable((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i),this.couleur);
                        i++;        // si la case est vide, le scan continue
                    }
                    else {
                        plateau.playable((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i),this.couleur);
                                    // si il y a un pion adverse, le scan dans cette direction s'arrête (on sort du WHILE)
                    }
                    
=======
        let scan = [[-1,1],[1,1],[1,-1],[1,1]];
        for (let j = 0, i = 1; j<scan.length; j++){
            while(plateau.isInBoard((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i)) && (( this.x + (scan[j][0] * i),this.y + (scan[j][1] * i) ) != this.couleur) ){
                if (( plateau.board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece != this.couleur) || (plateau.board[(this.x + (scan[j][0] * i))][this.y + (scan[j][1] * i)].piece == 0) ) {
                    plateau.playable((this.x + (scan[j][0] * i)),this.y + (scan[j][1] * i),this.couleur, this)
>>>>>>> Théo:assets/js/Pieces/Fou.js
                }
        }
    }

}