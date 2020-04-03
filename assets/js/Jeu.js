
class Jeu{
    constructor(){


        //Dans le menu :
        // demander le pseudo du joueur pour l'enregistrement des scores

        function onclick(event) {

            if(this.echiquier.Nbtour%2 == this.couleur){//si son tour
                if(this.echiquier.select === {x:-1, y:-1}){ //Récup case de la piece pour dmd playable
                    let intersectPiece = this.rendu.getClickModels(event, this.rendu.pieces);
                    if(intersectPiece.length){
                        let Coo = this.rendu.getCooSelected(intersectPiece[0]);
                        if(this.echiquier.board[Coo.x][Coo.y].piece != 0) {
                            socket.emit('playable', this.echiquier.board[Coo.x][Coo.y].piece);
                        }
                    }
                }else { // Retirer playable et lancer move si sur case playable
                    let intersectCase = this.rendu.getClickModels(event, this.rendu.playableCases);
                    if(intersectCase.length){
                        let Coo = this.rendu.getCooSelected(intersectCase[0]);
                        if(this.echiquier.board[Coo.x][Coo.y].playable) {
                            socket.emit('move', {piece:this.echiquier.board[this.echiquier.select.x][this.echiquier.select.y].piece, 
                                                 x:Coo.x, 
                                                 y:Coo.y});
                        }
                    }
                    else this.echiquier.select = {x:-1, y:-1}
                    this.rendu.removeObjects(this.rendu.playableCases); 
                }
            }
        }

        this.play = false; // retirer ??????????????????????
    

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
            console.log(plateau)

        //Coté Gestion du Jeu
            this.play = true; // on lance le jeu (retirer si non utilisé)
            this.echiquier = plateau;

            console.log(this.echiquier)

        //Coté ThreeJS
            // Lancer le rendu graphique

        //Coté UI
            // Lancer l'affichage de l'UI


            //  TEST RENDU THREEJS
            let Rendu = this.rendu;

            let loadCheck = setInterval(function() {
                if (Rendu.pieces.length>=6) {
                    clearInterval(loadCheck);
                    console.log('check')
                    Rendu.loadBoardPieces(plateau.board);
                    //addeventlistener
                }
            }, 250); // interval set at 0.25 seconds
            


        });
        socket.on('playable', (plateau) => {
            console.log('Event - playable')

            this.echiquier = plateau;

        //Coté threejs :
            // Afficher les couts jouable (autre couleur ?) +  !!!!!!!!! piece selectionnée !!!!!!!!!

        //Coté Gestion du jeu
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

