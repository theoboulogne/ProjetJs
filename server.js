//Serveur - Echec

//Constantes

const port = 800;
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io =  require('socket.io')(server);

//Import des classes
const Plateau = require('./server_modules/Plateau');
const Joueur = require('./server_modules/Joueur');

//Redirection des pages                                 REDIRECTION A CHANGER APRES CREATION DU MENU
app.use(express.static(__dirname + '/assets/'));
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/jeu.html')
});
app.get('/menu', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/menu.html')
});

//On enregistre nos plateaux et nos joueurs avec leur socket
this.echiquiers = new Array();
let game = this;


io.sockets.on('connection',  (socket) =>{
    console.log('Nouvelle Connection Client')

    //Gestion de l'ajout de plateau si nécessaire
    if(this.echiquiers.length==0) this.echiquiers.push(new Plateau());
    else if(this.echiquiers[this.echiquiers.length-1].Joueurs.length==2) this.echiquiers.push(new Plateau());

    //Gestion de l'ajout de joueur      
    this.echiquiers[this.echiquiers.length-1].Joueurs.push(new Joueur(this.echiquiers[this.echiquiers.length-1].Joueurs.length, socket.id));//On définit la couleur avec le nombre de joueur sur le plateau et on rajoute un joueur
    socket.emit('repconnection', game.echiquiers[game.echiquiers.length-1].Joueurs.length-1)// on informe le client que la connection est effectuée et on lui donne sa couleur

    //Gestion du lancement de la partie
    if(game.echiquiers[game.echiquiers.length-1].Joueurs.length == 2) {
        for(let i=0; i<2; i++){ 
            io.sockets.sockets[game.echiquiers[game.echiquiers.length-1].Joueurs[i].id].emit('start', game.echiquiers[game.echiquiers.length-1]);
        }
    }

    //Définition des envois au serveur pour la partie
    socket.on('playable', (piece)=> {
        console.log("Génération des coups possibles")
        let indiceEchiquier;
        let couleurSocket;
        for(let i=0; i<game.echiquiers.length; i++){
            for(let j=0; j<game.echiquiers[i].Joueurs.length; j++){
                if(game.echiquiers[i].Joueurs[j].id == socket.id){ // si le bon id
                    indiceEchiquier = i;
                    couleurSocket = j;
                }
            }
        }

        if ((couleurSocket) == (game.echiquiers[indiceEchiquier].Nbtour%2) && game.echiquiers[indiceEchiquier].board[piece.x][piece.y].piece == piece){ // si son tour et pas d'erreur
            game.echiquiers[indiceEchiquier].board[piece.x][piece.y].piece.playable(game.echiquiers[indiceEchiquier]);
            for(let i = 0; i < 8; i++){
                for(let j = 0; j < 8; j++){
                    if(game.echiquiers[indiceEchiquier].board[i][j].playable) {
                        game.echiquiers[indiceEchiquier].select = {x:piece.x, y:piece.y};
                    }
                }
            }
            socket.emit('playable', game.echiquiers[indiceEchiquier]);
        }
        else {
            console.log("Réinitialisation d'un client - Playable");
            game.echiquiers[indiceEchiquier].reset_playable(); // on reset les playables avant de l'envoyer
            socket.emit('reset', game.echiquiers[indiceEchiquier], couleurSocket);
        }
    });

    socket.on('move', (deplacement)=> {
        console.log("Déplacement de pièce")
        let indiceEchiquier;
        let couleurSocket;
        for(let i=0; i<game.echiquiers.length; i++){
            for(let j=0; j<game.echiquiers[i].Joueurs.length; j++){
                if(game.echiquiers[i].Joueurs[j].id == socket.id){ // si le bon id
                    indiceEchiquier = i;
                    couleurSocket = j;
                }
            }
        }
        // si son tour et les bonnes infos alors :
        if ((couleurSocket) == (game.echiquiers[indiceEchiquier].Nbtour%2) &&
            (deplacement.x == game.echiquiers[indiceEchiquier].select.x) && 
            (deplacement.y == game.echiquiers[indiceEchiquier].select.y) &&
            (game.echiquiers[indiceEchiquier].board[deplacement.x][deplacement.y].playable)){    
                    
            game.echiquiers[indiceEchiquier].select = {x:-1, y:-1};

            //on clone le plateau pour l'envoyer avant le déplacement afin de l'effectuer graphiquement en front
            let plateau = clone(game.echiquiers[indiceEchiquier]); 
            game.echiquiers[indiceEchiquier].board[deplacement.piece.x][deplacement.piece.y].piece.move(deplacement.x,deplacement.y,game.echiquiers[indiceEchiquier])

            let piece_prise = 0 //On détecte la pièce prise
            if(game.echiquiers[indiceEchiquier].Joueurs[couleurSocket].pieces_prises[game.echiquiers[indiceEchiquier].Joueurs[couleurSocket].pieces_prises.length - 1].Nbtour == Nbtour-1){ 
                piece_prise = game.echiquiers[indiceEchiquier].Joueurs[couleurSocket].pieces_prises[game.echiquiers[indiceEchiquier].Joueurs[couleurSocket].pieces_prises.length - 1].piece;
            }

            plateau.reset_playable();
            for(let i=0; i<2; i++){ // On envoi le déplacement a tout le monde
                io.sockets.sockets[game.echiquiers[indiceEchiquier].Joueurs[couleurSocket].id].emit('move', plateau, deplacement, piece_prise);
            }
            
            if(game.echiquiers[indiceEchiquier].echecEtMat(couleurSocket)){//Detection fin de partie
                console.log('Echec et Mat')
                for(let i=0; i<2; i++) io.sockets.sockets[game.echiquiers[indiceEchiquier].Joueurs[i].id].emit('endGame', couleurSocket);
            }
        }
        else{
            console.log("Réinitialisation d'un client - Move");
            game.echiquiers[indiceEchiquier].reset_playable(); // on reset les playables avant de l'envoyer
            socket.emit('reset', game.echiquiers[indiceEchiquier], couleurSocket);
        }
    });
    socket.on('disconnect', ()=>{ // si le joueur demande une déconnection
        console.log("Déconnection d'un joueur")
        let indiceEchiquier = undefined;
        let couleurSocket;
        for(let i=0; i<game.echiquiers.length; i++){
            for(let j=0; j<game.echiquiers[i].Joueurs.length; j++){
                if(game.echiquiers[i].Joueurs[j].id == socket.id){ // si le bon id
                    indiceEchiquier = i;
                    couleurSocket = j;
                }
            }
        }

        if(indiceEchiquier != undefined) { // si le plateau existe toujours alors on redirige
            for(let j=0; j<game.echiquiers[indiceEchiquier].Joueurs.length; j++){
                if(game.echiquiers[indiceEchiquier].Joueurs[j].id != socket.id){
                    io.sockets.sockets[game.echiquiers[indiceEchiquier].Joueurs[j].id].emit('menu'); // on change de page 
                }
            }
            game.echiquiers.splice(indiceEchiquier, 1); // on retire l'échiquier
            console.log("Redirection du deuxième joueur sur le menu et suppression de son echiquier");
        }
    });

    console.log("Fin de l'initialisation d'un client")
});

server.listen(port);
console.log('server connected');
