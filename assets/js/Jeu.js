
class Jeu{
    constructor(){


        //Dans le menu :
        // demander le pseudo du joueur pour l'enregistrement des scores

        function onClick(event) {
            console.log('onClick')
            if(Game.echiquier.Nbtour%2 == Game.couleur){//si son tour
                console.log('Bon-Tour')
                console.log(Game.echiquier)
                if(Game.echiquier.select.x == -1 &&  Game.echiquier.select.y == -1){ //Récup case de la piece pour dmd playable
                    console.log('Playable')
                    let intersectPiece = Game.rendu.getClickModels(event, Game.rendu.pieces);
                    if(intersectPiece.length){
                        let Coo = Game.rendu.getCooSelected(intersectPiece[0]);
                        if(Game.echiquier.board[Coo.x][Coo.y].piece != 0) {
                            if(Game.echiquier.board[Coo.x][Coo.y].piece.couleur == Game.couleur) {
                                console.log('Dmd Playable')
                                socket.emit('playable', Game.echiquier.board[Coo.x][Coo.y].piece);
                            }
                        }
                    }
                }else { // Retirer playable et lancer move si sur case playable
                    console.log('disable-playable')
                    let intersectCase = Game.rendu.getClickModels(event, Game.rendu.playableCases);
                    if(intersectCase.length){
                        console.log('dmd-move')
                        let Coo = Game.rendu.getCooSelected(intersectCase[0]);
                        if(Game.echiquier.board[Coo.x][Coo.y].playable) {
                            socket.emit('move', {piece:Game.echiquier.board[Game.echiquier.select.x][Game.echiquier.select.y].piece, 
                                                 x:Coo.x, 
                                                 y:Coo.y});
                        }
                    }
                    else Game.echiquier.select = {x:-1, y:-1} 
                        // reset coté client pour prochain click
                    Game.rendu.removeObjects(Game.rendu.playableCases); 
                }
            }
            console.log('End-onClick')
        }


        let Game = this;
    

        //connection server
        const socket = io.connect('http://localhost:800');
        socket.on('repconnection', (couleur) => {
            console.log('Event - repconnection')

        //Coté Gestion du jeu
            Game.couleur = couleur;

            //On retire le renderer du DOM pour reset proprement en cas de reset du serveur
            if(Game.rendu != undefined) document.body.removeChild(document.body.lastChild)
            Game.rendu = new RenduThreeJs(); // prendre la couleur en entrée pour définir la caméra ?
                                             // la déplacer au moment du start ?

        //Coté UI:
            // indiquer l'attente d'un autre joueur
        });
        socket.on('start', (plateau) => {
            console.log('Event - start')
        //Coté Gestion du Jeu
            Game.echiquier = plateau;

        //Coté UI
            // Lancer l'affichage de l'UI


        //Coté ThreeJS          -   DEPLACER LE CHECK COTE CHESSSCRIPT <--------------------------------------------
            let i, check;
            let loadCheck = setInterval(function() {
                check = true;
                for(i=0; i<Game.rendu.models.length; i++) if(Game.rendu.models[i].obj == undefined) check = false;
                if (check) {
                    clearInterval(loadCheck);
                    Game.rendu.loadBoardPieces(Game.echiquier.board);
                    document.body.lastChild.addEventListener("click", onClick, false);
                }
            }, 250);
            


        });
        socket.on('playable', (plateau) => {
            console.log('Event - playable')

            Game.echiquier = plateau;

        //Coté threejs :
            // Afficher les couts jouable (autre couleur ?) +  !!!!!!!!! piece selectionnée !!!!!!!!!
            if(Game.echiquier.select.x != -1) Game.rendu.setPlayables(Game.echiquier.board, Game.couleur)

        //Coté Gestion du jeu
            // implémenter l'utilisation de selected pour envoyer move ou playable au click en fonction
            

        });
        socket.on('move', (plateau,deplacement,piece_prise) => { // piece et deplacer en x,y
            console.log('Event - move')

            Game.echiquier = plateau;

            deplacements = [deplacement];
            let diff = deplacement.y - deplacement.piece.y
            if(deplacement.piece.name == "Roi" && Math.abs(diff) == 2){
                deplacements.push({ x:deplacement.x,
                                    y:deplacement.y + diff/Math.abs(diff),
                                    piece:plateau.board[deplacement.x][deplacement.piece.y + (diff/Math.abs(diff)) * 3.5 - 0.5]
                                    });
            }

        //Coté threejs :
            Game.rendu.movePiece(deplacement)
            //deplacer la pièce et retirer la pièce prise en simultané

        //Coté Gestion du jeu

            //On supprime la pièce si nécessaire
            if(piece_prise != 0){ 
                Game.echiquier.board[piece_prise.x][piece_prise.y].piece = 0;
                Game.echiquier.Joueurs[piece_prise.couleur].pieces_prises.push(piece_prise);
            }

            // on déplace une piece (ou deux si on fait un roque)
            for(let i = 0; i < deplacements.length(); i++){
                //Déplacement dans le board de la pièce
                Game.echiquier.board[deplacements[i].x][deplacements[i].y].piece = Game.echiquier.board[deplacements[i].piece.x][deplacements[i].piece.y];
                Game.echiquier.board[deplacements[i].piece.x][deplacements[i].piece.y] = 0;

                //Changement des Coo de la pièce
                plateau.board[deplacements[i].x][deplacements[i].y].piece.x = deplacements[i].x;
                plateau.board[deplacements[i].x][deplacements[i].y].piece.y = deplacements[i].y;
            }

            //Enregistrement des couts pour l'affichage
            plateau.couts.push(plateau.board[deplacement.x][deplacement.y].piece);

            //On augmente le nombre de tour pour indiquer que l'on change de joueur et pour l'affichage des couts
            plateau.Nbtour++;

        //Coté UI
            // Récupérer les couts joués et les pièces prises et actualiser l'ui en conséquence

        });
        socket.on('reset', (echiquierReset, couleurReset) => {
            console.log('Event - reset')
            
        //Coté Gestion du jeu
            Game.couleur = couleurReset;
            Game.echiquier = echiquierReset;
            
        // Coté Threejs
            // Changer l'affichage en conséquence :
            //Vider le board des pieces + des playables
            //appeller LoadBoardPieces

        //Coté UI
            //Refresh l'UI
            // montrer une alerte au joueur pour indiquer qu'il y a une erreur ??
        });
        socket.on('endGame', (couleurGagnant) => {

        //Coté gestion du Jeu :
            // enregistrer la partie dans la BDD

        //Coté UI :
            // afficher un message indiquant si gagné ou perdu
            // puis au click :
            //  rediriger vers menu
        });
        socket.on('menu', () => {
            console.log('Redirection vers le menu')
            window.location.href = "./"
        });
    }
}


(function() {
	let game = new Jeu();
})();

