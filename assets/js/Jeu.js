

/*TO-DO :
(3D : )
CHANGEMENT DU PION A LA DERNIERE LIGNE (HUD + JEU + 3D)


ECHEC BUG AVEC PION EN ARRIERE
ROQUE MARCHE AVEC PIECE ENTRE DEUX + SI EN ECHEC


+ Changer le système de récupération des infos sur les modèles (avec JQuery) :

+ methode pour indiceechiquier/couleursocket

$.getJSON("test.json", function(json) {
    console.log(json); // this will show the info it in firebug console
});


+ Rajouter l'envoi de la bdd dans le menu avec express + jquery aussi



A vérifier :
récupération du plateau nécessaire au debut de move ????
*/


class Jeu{
    constructor(){
        let Game = this; // pour accéder depuis les fonctions

        function onClick(event) {
            console.log('click')
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
                                    let CheckPromotion = setInterval(function() { // On attend que toutes nos pièces soient 
                                        if (piece.choix != undefined) {  // chargées avant de commencer à les afficher
                                            clearInterval(CheckPromotion);
                                            Hud.CloseAttente();
                                            socket.emit('move', {piece:piece, 
                                                                x:Coo.x, 
                                                                y:Coo.y});
                                        }
                                    }, 500);
                                }
                                else socket.emit('move', {piece:Game.echiquier.board[Game.echiquier.select.x][Game.echiquier.select.y].piece, 
                                                    x:Coo.x, 
                                                    y:Coo.y});
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
    

        //connection au serveur
        const socket = io.connect('http://localhost:800');

        socket.on('repconnection', (couleur) => {
            console.log('Event - repconnection')
            Game.couleur = couleur;//on stocke la couleur du joueur
            if(Game.rendu != undefined) Game.rendu.remove(); //On retire le renderer du DOM + infos des modèles pour reset proprement en cas de reset du serveur sans redirection
            Game.rendu = new RenduThreeJs(couleur); // on lance l'affichage graphique (uniquement le board pour le moment pour signaler l'attente)
            Hud.OpenAttente();
        });

        socket.on('start', (plateau) => {
            console.log('Event - start')
            Game.echiquier = plateau; // On récupère le plateau à afficher
            SetInt() // On lance l'affichage du chrono
            let loadCheck = setInterval(function() { // On attend que toutes nos pièces soient 
                if (Game.rendu.checkLoadModels()) {  // chargées avant de commencer à les afficher
                    clearInterval(loadCheck);
                    Game.rendu.loadBoardPieces(Game.echiquier.board); // On charge les pièces
                    document.getElementById('RenduThreeJs').addEventListener("click", onClick, false); // On active les events
                    Hud.Affichage_AquiDejouer(0) // On affiche c'est à qui de jouer
                    Hud.CloseAttente();
                }
            }, 100);
        });

        socket.on('playable', (plateau) => {
            console.log('Event - playable')
            Game.echiquier = plateau; // On récupère le nouveau plateau (avec les cases playable)
            if(Game.echiquier.select.x != -1) Game.rendu.setPlayables(Game.echiquier.board, Game.echiquier.select)
        }); // si il y a au moins une case à afficher on l'affiche

        socket.on('move', (plateau,deplacement,piece_prise) => { // piece et deplacer en x,y
            console.log('Event - move')
            Game.echiquier = plateau; // On récupère le nouveau plateau (sans les cases playable)
            //Détermination du roque
            let deplacements = Roque.getDeplacements(deplacement, plateau.board);
            
            Game.Move(deplacements, piece_prise);

            //Affichage graphique
            if(piece_prise != 0) Game.rendu.moveOut(piece_prise); // On affiche la suppression 
            Game.rendu.movePieces(deplacements); // on lance le déplacement de la ou des pièces en cas de roque

            //Détermination de la promotion de pion
            if(deplacement.piece.nom == "Pion" && ((deplacement.piece.couleur + 1) % 2)*7 == deplacement.y){
                if(deplacement.piece.choix != undefined){
                    Game.echiquier.board[deplacement.x][deplacement.y].piece.nom = deplacement.piece.choix;
                    //Lancement de la promotion graphiquement
                }
            }
            
            //On actualise l'interface
            Hud.Affichage_coups(Game.echiquier.coups[Game.echiquier.coups.length-1],plateau.Nbtour-1);
            Hud.Affichage_AquiDejouer(Game.echiquier.Nbtour)
            Hud.Affichage_SetChrono(Game.echiquier.chrono)//On rafraichit le chrono en fonction du serveur afin de palier aux problèmes de synchronisation
        });

        socket.on('reset', (echiquierReset, couleurReset) => {
            console.log('Event - reset') // On réinitialise en cas d'incohérence dans les envois au serveur
            Game.couleur = couleurReset; // Les infos de gestion de jeu
            Game.echiquier = echiquierReset;
            Game.rendu.reloadAll(echiquierReset);//Le coté graphique 3D
            Hud.reloadAll(echiquierReset);//Le coté HUD
        });

        socket.on('endGame', (couleurGagnant) => { 
            console.log('Partie terminée')// Fin de partie

            let infos;
            if(couleurGagnant == Game.couleur) infos = "Vous avez gagné !"    
            else infos = "Vous avez perdu."

            Hud.OpenMenu(infos)
        });

        socket.on('deconnection', () => {
            console.log('Redirection vers le menu') // car déconnection de l'adversaire
            Hud.OpenMenu("Votre adversaire s'est déconnecté.")
        });
        
        socket.on('menu', () => {
            console.log('Redirection vers le menu') // manque de paramètres
            Hud.OpenMenu('Il y a au moins un paramètre manquant..')
        });
    }
    Move(deplacements, piece_prise){
        if(piece_prise != 0){
            this.echiquier.board[piece_prise.x][piece_prise.y].piece = 0; // on applique les transformations au plateau 
            this.echiquier.Joueurs[piece_prise.couleur].pieces_prises.push(piece_prise); //pour sélectionner derrière
        }
        
        // on lance le déplacement de la ou des pièces en cas de roque
        for(let i = 0; i < deplacements.length; i++){ // on applique les transformations pour sélectionner derrière
            //Déplacement dans le board de la pièce
            this.echiquier.board[deplacements[i].x][deplacements[i].y].piece = this.echiquier.board[deplacements[i].piece.x][deplacements[i].piece.y];
            this.echiquier.board[deplacements[i].piece.x][deplacements[i].piece.y] = 0;

            //Changement des Coo de la pièce dans l'objet
            this.echiquier.board[deplacements[i].x][deplacements[i].y].piece.x = deplacements[i].x;
            this.echiquier.board[deplacements[i].x][deplacements[i].y].piece.y = deplacements[i].y;
        }

        //Enregistrement des coups pour l'affichage
        if(deplacements.length == 2){//si roque on détermine lequel pour l'affichage
            if(deplacements[0].x - deplacements[0].piece.x == 2) this.echiquier.coups.push("G.R");
            else this.echiquier.coups.push("P.R");
        }
        else this.echiquier.coups.push(this.echiquier.board[deplacements[0].x][deplacements[0].y].piece);
        
        //On augmente le nombre de tour pour indiquer que l'on change de joueur et pour l'affichage des coups
        this.echiquier.Nbtour++;
    }
}


(function() {
    let game = new Jeu();
})();

