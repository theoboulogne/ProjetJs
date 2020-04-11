function onClick(event, Game, socket) {
    if(Game.echiquier.Nbtour%2 == Game.couleur){//si son tour
        let intersectPiece = Game.rendu.getClickModels(event, Game.rendu.piecesObj);
        let intersectCase = Game.rendu.getClickModels(event, Game.rendu.playableCases);
        if(intersectPiece.length || intersectCase.length){
            let Coo;
            if(intersectPiece.length) Coo = Game.rendu.getCooSelected(intersectPiece[0]);
            else Coo = Game.rendu.getCooSelected(intersectCase[0]);
            if(Coo.x>-1 && Coo.y >-1 && Coo.x<8 && Coo.y<8) {
                if(Game.echiquier.select.x == -1 &&  Game.echiquier.select.y == -1){
                    if(Game.echiquier.board[Coo.x][Coo.y].piece != 0) {
                        if(Game.echiquier.board[Coo.x][Coo.y].piece.couleur == Game.couleur) {
                            socket.emit('playable', Game.echiquier.board[Coo.x][Coo.y].piece);
                        }
                    }
                }
                else {
                    if(Game.echiquier.board[Coo.x][Coo.y].playable) {
                        if(Game.echiquier.board[Game.echiquier.select.x][Game.echiquier.select.y].piece.nom == "Pion" &&
                           ((Game.echiquier.board[Game.echiquier.select.x][Game.echiquier.select.y].piece.couleur + 1) % 2)*7 == Coo.y){
                               //si le pion arrive au bout (promotion) :
                            let piece = Game.echiquier.board[Game.echiquier.select.x][Game.echiquier.select.y].piece;
                            Hud.choix_piece(piece);
                            let CheckPromotion = setInterval(function() { // On attend que l'utilisateur sélectionne sa pièce
                                if (piece.choix != undefined) {
                                    clearInterval(CheckPromotion);
                                    Hud.CloseAttente();
                                    socket.emit('move', {piece:piece, 
                                                        x:Coo.x, 
                                                        y:Coo.y});

                                    if(Game.mode) setTimeout(() => {  socket.emit('move', {}); }, 100);
                                    //si IA active on envoi un deuxième déplacement après un court délai
                                }
                            }, 500);
                        }
                        else {
                            socket.emit('move', {piece:Game.echiquier.board[Game.echiquier.select.x][Game.echiquier.select.y].piece, 
                                            x:Coo.x, 
                                            y:Coo.y});

                            if(Game.mode) setTimeout(() => {  socket.emit('move', {}); }, 100);
                            //si IA active on envoi un deuxième déplacement après un court délai
                        }
                    }
                    else Game.echiquier.select = {x:-1, y:-1};
                    Game.rendu.removePlayable();
                }
            }
        }
        else if(Game.echiquier.select.x != -1) {
            Game.echiquier.select = {x:-1, y:-1};
            Game.rendu.removePlayable();
        }
    }
}