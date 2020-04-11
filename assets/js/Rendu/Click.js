function onClick(event, Game, socket) {
    if(Game.echiquier.Nbtour%2 == Game.couleur){//si son tour
        let intersectPiece = Game.rendu.getClickModels(event, Game.rendu.piecesObj); // Récupère l'intersection du click sur les pieces
        let intersectCase = Game.rendu.getClickModels(event, Game.rendu.playableCases); // pareil sur les cases
        if(intersectPiece.length || intersectCase.length){ // si il y a une intersection
            let Coo;
            if(intersectPiece.length) Coo = Game.rendu.getCooSelected(intersectPiece[0]); // on récupère les coordonnées de la pièce
            else Coo = Game.rendu.getCooSelected(intersectCase[0]); // ou case sélectionnée
            if(Coo.x>-1 && Coo.y >-1 && Coo.x<8 && Coo.y<8) { // si la case est dans le tableau
                if(Game.echiquier.select.x == -1 &&  Game.echiquier.select.y == -1){ // si aucune piece n'est selectionnée
                    if(Game.echiquier.board[Coo.x][Coo.y].piece != 0) { // et si il y a une une piece aux coordonées selectionnées
                        if(Game.echiquier.board[Coo.x][Coo.y].piece.couleur == Game.couleur) { // et si la piece est de la meme couleur que le joueur
                            socket.emit('playable', Game.echiquier.board[Coo.x][Coo.y].piece); // alors on envoie les cases jouables pour cette piece
                        }
                    }
                }
                else {// si une piece est selectionnée
                    if(Game.echiquier.board[Coo.x][Coo.y].playable) { // et si les coordonnées pointent une case jouable
                        if(Game.echiquier.board[Game.echiquier.select.x][Game.echiquier.select.y].piece.nom == "Pion" &&
                           ((Game.echiquier.board[Game.echiquier.select.x][Game.echiquier.select.y].piece.couleur + 1) % 2)*7 == Coo.y){
                               //si le pion arrive au bout (promotion) :
                            let piece = Game.echiquier.board[Game.echiquier.select.x][Game.echiquier.select.y].piece; // on sélectionne le pion
                            Hud.choix_piece(piece);//on ouvre l'interface de choix de piece
                            let CheckPromotion = setInterval(function() { // On attend que l'utilisateur sélectionne sa pièce
                                if (piece.choix != undefined) {
                                    clearInterval(CheckPromotion); //on annule la boucle quand c'est bon
                                    Hud.CloseAttente(); // on ferme l'interface de choix
                                    socket.emit('move', {piece:piece, 
                                                        x:Coo.x, 
                                                        y:Coo.y});

                                    if(Game.mode) setTimeout(() => {  socket.emit('move', {}); }, 100);
                                    //si IA active on envoi un deuxième déplacement après un court délai
                                }
                            }, 500);
                        }
                        else { // si c'est un déplacement normal
                            socket.emit('move', {piece:Game.echiquier.board[Game.echiquier.select.x][Game.echiquier.select.y].piece, 
                                            x:Coo.x,                                                                                 // on envoie la piece et les coordonnées
                                            y:Coo.y});

                            if(Game.mode) setTimeout(() => {  socket.emit('move', {}); }, 100);
                            //si IA active on envoi un deuxième déplacement après un court délai
                        }
                    }
                    else Game.echiquier.select = {x:-1, y:-1};// et si les coordonnées ne pointent pas une case jouable
                    Game.rendu.removePlayable(); // on efface les cases playables
                }
            }
        }
        else if(Game.echiquier.select.x != -1) { // si il n'y a pas d'intersection
            Game.echiquier.select = {x:-1, y:-1}; // on reinitialise la selection
            Game.rendu.removePlayable(); // on efface les cases playables
        }
    }
}