

/*TO-DO :

+ methode pour indiceechiquier/couleursocket
+ arreter de crash qd pas de BDD
+ deplacer toutes les requetes sql en methode avec res en argument
+ test difficulte ia avec menu thomas


A vérifier :
récupération du plateau nécessaire au debut de move ????
*/


class Jeu{
    constructor(){
        let Game = this; // pour accéder depuis les fonctions
        //On regarde si le mode IA est enclenché et si oui on le définit dans une 
        //variable pour éviter de devoir acceder aux paramètres à chaque fois

        this.mode = 0
        if(getParams(window.location.href).ia!=undefined) this.mode = 1;

        
    

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
                    document.getElementById('RenduThreeJs').addEventListener("click", function(){onClick(event, Game, socket)}, false); // On active les events
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
            console.log(deplacement)
            Game.echiquier = plateau; // On récupère le nouveau plateau (sans les cases playable)
            //Détermination du roque
            let deplacements = Roque.getDeplacements(deplacement, plateau.board);

            //Affichage graphique
            if(piece_prise != 0) {
                Game.rendu.moveOut(piece_prise); // On affiche la suppression 
                setTimeout(function(){//on attend la fin de la suppression
                    Game.rendu.movePieces(JSON.parse(JSON.stringify(deplacements))); 
                }, 750);
            }
            else Game.rendu.movePieces(JSON.parse(JSON.stringify(deplacements))); 
            // on lance le déplacement de la ou des pièces en cas de roque
            // on effectue une copie du déplacement car le déplacement est asynchrone et que l'on veut garder les bonnes infos

            Game.Move(deplacements, piece_prise);

            //Détermination de la promotion de pion
            if(deplacement.piece.nom == "Pion" && ((deplacement.piece.couleur + 1) % 2)*7 == deplacement.y){
                if(deplacement.piece.choix != undefined){
                    Game.echiquier.board[deplacement.x][deplacement.y].piece.nom = deplacement.piece.choix;
                    Game.rendu.switchPawn(Game.echiquier.board[deplacement.x][deplacement.y].piece)//Lancement de la promotion graphiquement
                }
            }
            
            //On actualise l'interface
            Hud.Affichage_coups(Game.echiquier.coups[Game.echiquier.coups.length-1],plateau.Nbtour-1);
            Hud.Affichage_AquiDejouer(Game.echiquier.Nbtour)
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
            this.echiquier.board[deplacements[i].x][deplacements[i].y].piece = this.echiquier.board[deplacements[i].piece.x][deplacements[i].piece.y].piece;
            this.echiquier.board[deplacements[i].piece.x][deplacements[i].piece.y].piece = 0;

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
    let game;
    if(getParams(window.location.href).replay!=undefined){
        let Rendu = new RenduThreeJs(0);
        Rendu.replay();
    }
    else game = new Jeu();
})();

