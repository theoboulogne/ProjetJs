
class Jeu{
    constructor(){


        //Dans le menu :
        // demander le pseudo du joueur pour l'enregistrement des scores

        function onClick(event) {
            console.log('click')
            if(Game.echiquier.Nbtour%2 == Game.couleur){//si son tour
                console.log('bon-tour')
                console.log(Game.echiquier)
                if(Game.echiquier.select.x == -1 &&  Game.echiquier.select.y == -1){ //Récup case de la piece pour dmd playable
                    console.log('dmd-playable')
                    let intersectPiece = Game.rendu.getClickModels(event, Game.rendu.pieces);
                    if(intersectPiece.length){
                        let Coo = Game.rendu.getCooSelected(intersectPiece[0]);
                        if(Game.echiquier.board[Coo.x][Coo.y].piece != 0) {
                            console.log('emit playable')
                            console.log(Game)
                            console.log(Coo)
                            console.log(Game.echiquier.board[Coo.x][Coo.y].piece)
                            socket.emit('playable', Game.echiquier.board[Coo.x][Coo.y].piece);
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
                    Game.rendu.removeObjects(Game.rendu.playableCases); 
                }
            }
            console.log('end-click')
        }


        let Game = this;
    

        //connection server
        const socket = io.connect('http://localhost:800');
        socket.on('repconnection', (couleur) => {
            console.log('Event - repconnection')

        //Coté Gestion du jeu
            this.couleur = couleur;
            this.rendu = new RenduThreeJs(); // prendre la couleur en entrée pour définir la caméra ?
                                             // la déplacer au moment du start ?

        //Coté UI:
            // indiquer l'attente d'un autre joueur
        });
        socket.on('start', (plateau) => {
            console.log('Event - start')
        //Coté Gestion du Jeu
            this.echiquier = plateau;

        //Coté ThreeJS
            // Lancer le rendu graphique

        //Coté UI
            // Lancer l'affichage de l'UI


            //  TEST RENDU THREEJS
            let i, check;
            let loadCheck = setInterval(function() {
                check = true;
                for(i=0; i<Game.rendu.models.length; i++) if(Game.rendu.models[i].obj == undefined) check = false;
                if (check) {
                    clearInterval(loadCheck);
                    Game.rendu.loadBoardPieces(Game.echiquier.board);
                    document.body.lastChild.addEventListener("click", onClick, false);
                    //addeventlistener
                }
            }, 250); // interval set at 0.25 seconds
            


        });
        socket.on('playable', (plateau) => {
            console.log('Event - playable')

            this.echiquier = plateau;
            console.log(this.echiquier)

        //Coté threejs :
            // Afficher les couts jouable (autre couleur ?) +  !!!!!!!!! piece selectionnée !!!!!!!!!

        //Coté Gestion du jeu
            if(Game.echiquier.select.x != -1) Game.rendu.setPlayables(Game.echiquier.board, Game.couleur)
            // implémenter l'utilisation de selected pour envoyer move ou playable au click en fonction
            

        });
        socket.on('move', (plateau,deplacement,piece_prise) => { // piece et deplacer en x,y
            console.log('Event - move')

            this.echiquier = plateau;

        //Coté threejs :
            //deplacer la pièce et retirer la pièce prise en simultané

        //Coté Gestion du jeu (Voir pour intégrer le roque à faire)

            //On supprime la pièce si nécessaire
            if(piece_prise != 0){ 
                this.echiquier.board[piece_prise.x][piece_prise.y].piece = 0;
                this.echiquier.Joueurs[piece_prise.couleur].pieces_prises.push(piece_prise);
            }

            //Déplacement dans le board de la pièce
            this.echiquier.board[deplacement.x][deplacement.y].piece = this.echiquier.board[deplacement.piece.x][deplacement.piece.y];
            this.echiquier.board[deplacement.piece.x][deplacement.piece.y] = 0;

            //Changement des Coo de la pièce
            plateau.board[deplacement.x][deplacement.y].piece.x = deplacement.x;
            plateau.board[deplacement.x][deplacement.y].piece.y = deplacement.y;

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
            this.couleur = couleurReset;
            this.echiquier = echiquierReset;
            
        // Coté Threejs
            // Changer l'affichage en conséquence

        //Coté UI
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
            //window.location.href = "/menu"
        });
        
    }
}


(function() {
	let game = new Jeu();
})();

