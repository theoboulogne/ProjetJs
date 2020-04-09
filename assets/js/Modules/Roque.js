let Roque = (function(){
    let check = deplacement => (deplacement.piece.nom == "Roi" && Math.abs(deplacement.x - deplacement.piece.x) == 2);
    let deplacementTour = (deplacement, board) => {
        let diff = deplacement.x - deplacement.piece.x
        return {
            piece:board[deplacement.piece.x + ((diff/Math.abs(diff))*3.5) + 0.5][deplacement.piece.y].piece,
            x:deplacement.x - (diff/Math.abs(diff)),
            y:deplacement.y
        }
    };
    return {
        getDeplacements : (deplacement, board) => {
            let deplacements = [deplacement];
            if(check(deplacement)) {
                deplacements.push(deplacementTour(deplacement, board))
            }
            return deplacements;
        },
    }
})();

//plateau.playable(this.x + (4*k-2), this.y, this);