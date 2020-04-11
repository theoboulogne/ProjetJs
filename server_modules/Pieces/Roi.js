const Piece = require('./Piece');

class Roi extends Piece{
    constructor(couleur, x, y, id){
        super(couleur, x, y, id)
    }

    verifierboucle(pieceName,sens, plateau){  // vérification pour l'écheque par la reine, le fou et la tour
        for(let i = 0; i < sens.length; i++){
            let x = this.x + sens[i][0];
            let y = this.y + sens[i][1];
            let boucle = true;

            if (plateau.isInBoard(x,y)) while(boucle){
                if(plateau.check_piece(x,y)){
                    if(plateau.board[x][y].piece.couleur != this.couleur) for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.nom == pieceName[j]) return true;
                    boucle = false;
                }
                x += sens[i][0]
                y += sens[i][1]
                if(!plateau.isInBoard(x,y)) boucle = false;
            }
        }
        return false;
    }

    verifiercote(pieceName,sens, plateau){ // vérification pour l'écheque par le roi, le cavalier et le pion
        for(let i = 0; i < sens.length; i++){
            let x = this.x + sens[i][0];
            let y = this.y + sens[i][1];

            if(plateau.check_piece(x,y)){
                if(plateau.board[x][y].piece.couleur != this.couleur){
                    if (plateau.board[x][y].piece.nom == pieceName) return true;
                }
            }
        }
        return false;
    }

    echec(plateau){ // on a fait deux types de vérifications (pour l'échec) car pour le roi, le cavalier et le pion on vérifie directement des positions précises
    // tandis que pour la reine, le fou et la tour on vérifie sur toute une ligne, clonne ou diagonale

        if (this.verifierboucle(["Reine","Fou"],[[1,1],[1,-1],[-1,1],[-1,-1]], plateau)) return true;
        if (this.verifierboucle(["Reine","Tour"],[[1,0],[-1,0],[0,1],[0,-1]], plateau)) return true;
        if (this.verifiercote("Pion",[[-1,(-2*this.couleur) + 1],[1,(-2*this.couleur) + 1]], plateau)) return true;
        if (this.verifiercote("Cavalier",[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]], plateau)) return true;
        if (this.verifiercote("Roi", [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]], plateau)) return true;

        return false;
    }

    // méthode pour définir les cases jouable par le roi
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
        for (let k = 0; k < roque.length; k++){
            if (roque[k]) plateau.playable(this.x + (4*k-2), this.y, this);
        }
    }

    // méthode pour vérifier si on peu faire un roque
    roquePlayable(plateau){
        let renvoi = [false,false]; // tableau de retour (false = pas playable; true = playable)
        let valeurs = [-3,4]; // position en x des tours par rapport au roi
        
        let tempX = this.x; // pendant les tests, on bouje le roi et a la fin on le remet a sa place
        
        if(!this.echec(plateau)){ // on vérifie que le roi ne soit pas en echec a sa position initiale
            if(this.deplacements.length == 1){ // on vérifie qu'il n'est pas bougé
                for (let j = 0; j < valeurs.length; j++){
                    if(plateau.board[this.x + valeurs[j]][this.y].piece.nom == 'Tour' && plateau.board[this.x + valeurs[j]][this.y].piece.deplacements.length == 1){ // on vérifie que les tours sont bien en position initiale et qu'elles n'ont pas bougées
                        let i = 1;
                        let indiceR = true;
                        while (i < (Math.abs(valeurs[j])) && indiceR){ // on regarde les cases entre le roi et les tours
                            // si y'a une piece devant ton roi on coupe
                            if(plateau.board[this.x + (valeurs[j]/Math.abs(valeurs[j]))][this.y].piece != 0) indiceR = false;
                            else {
                                // si y'a pas de piece on décalle le roi
                                this.x += (valeurs[j]/Math.abs(valeurs[j]));
                                // si en echec on coupe (limite de 3 car le roi se déplace de max 2 cases)
                                if(i<3) if(this.echec(plateau)) indiceR = false;
                                // puis on passe a la case suivante
                                i++;
                            }
                        }
                        // on reset les coo de x, on enregistre si c'est bon et on passe au roque suivant
                        this.x = tempX;
                        if (indiceR){
                            renvoi[j] = true; // si l'indice n'est pas passé a false c'est que le roque avec la tour testée est possible
                        }
                    }
                }
            }
        }
        return renvoi;
    }

    move(x,y, plateau){ // on a une méthode spéciale pour le move du roi car on a deux types de déplacements, les déplacements normaux et le roque
        if(plateau.isInBoard(x,y)){ // on vérifie que les coordonées soit bien sur le plateau
            if(plateau.board[x][y].playable){ // on vérifie qu'on puisse vraiment jouer a ces coordonnées
                let diff = x - this.x;
                if(Math.abs(diff) == 2){ // si le déplacement est sur deux cases c'est qu'on fait un roque
                    plateau.jouer(x - (diff/Math.abs(diff)),y,plateau.board[3.5 + ((diff/Math.abs(diff))*3.5)][this.y].piece); // on bouge la tour
                    plateau.jouer(x,y,this); // on bouge le roi

                    plateau.Nbtour--; // chaque fonction jouer augmente de un le tour donc on le baisse pour garder un bon compte

                    plateau.coups.splice(plateau.coups.length - 2, 2);
                    if(diff == 2)  plateau.coups.push("G.R");          //au lieu d'afficher le déplacement du roi et de la tour, on affiche juste "grand ou petit roque"
                    else plateau.coups.push("P.R");
                }
                else plateau.jouer(x, y, this);//Déplacement normal
                //On enregistre les coo dans joueur pour pouvoir regarder echec depuis le plateau
                plateau.Joueurs[this.couleur].roi.x = x;
                plateau.Joueurs[this.couleur].roi.y = y;
            }
        }
    }
};


module.exports = Roi;