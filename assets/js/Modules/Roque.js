let Roque = (function(){  // modules pour le roque
    let check = deplacement => (deplacement.piece.nom == "Roi" && Math.abs(deplacement.x - deplacement.piece.x) == 2);
    let deplacementTour = (deplacement, board) => { // Méthode pour créer le déplacement de la tour
        let diff = deplacement.x - deplacement.piece.x
        return {
            piece:board[deplacement.piece.x + ((diff/Math.abs(diff))*3.5) + 0.5][deplacement.piece.y].piece, // on réccupere la bonne tour en fonction du sens du déplacement du roi
            x:deplacement.x - (diff/Math.abs(diff)), // la tour se déplace de plus ou moins une case par rapport au roi
            y:deplacement.y                          // elle reste sur la meme ligne
        }
    };
    return {
        getDeplacements : (deplacement, board) => {
            let deplacements = [deplacement]; 
            if(check(deplacement)) {
                deplacements.push(deplacementTour(deplacement, board)) // si on déplace le roi de deux case alors on enregistre de 
            }                                                          // déplacement pour la tour correspondante car on fait un roque
            return deplacements; //on retourne le tableau de déplacement qui contient deux cases si on fait un roque et une seule sinon
        },
    }
})();

//plateau.playable(this.x + (4*k-2), this.y, this);