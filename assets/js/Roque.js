let Roque = (function(){
    let check = deplacement => (deplacement.piece.nom == "Roi" && Math.abs(deplacement.x - deplacement.piece.x) == 2);
    let deplacementTour = (deplacement, board) => {
        let diff = deplacement.x - deplacement.piece.x
        return {
            y:deplacement.y,
            x:deplacement.x - (diff/Math.abs(diff)),
            piece:board[3.5 + ((diff/Math.abs(diff))*3.5)][deplacement.piece.y].piece
        }
    };
    return {
        getDeplacements : (deplacement, board) => {
            let deplacements = [deplacement];
            if(check(deplacement)) deplacements.push(deplacementTour(deplacement, board))
            return deplacements;
        },
    }
})();