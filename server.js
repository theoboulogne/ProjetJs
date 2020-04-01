//Serveur - Echec

//Constantes

const port = 800;
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io =  require('socket.io')(server);

//Import de classes
const Plateau = require('./server_modules/Plateau');
const Joueur = require('./server_modules/Joueur');

//Renvoi vers le fichier index client                           REDIRECTION A CHANGER APRES CREATION DU MENU
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
    
    console.log('Debut Connection Client (coté serveur)')

    //      Gestion de l'ajout de plateau      
    //On rajoute un plateau si nécessaire
    if(this.echiquiers.length==0) this.echiquiers.push(new Plateau());
    else if(this.echiquiers[this.echiquiers.length-1].Joueurs.length==2) this.echiquiers.push(new Plateau());

    //      Gestion de l'ajout de joueur      
    //On définit la couleur avec le nombre de joueur sur le plateau et on rajoute un joueur
    this.echiquiers[this.echiquiers.length-1].Joueurs.push(new Joueur(this.echiquiers[this.echiquiers.length-1].Joueurs.length, socket.id));
    // on informe le client que la connection est effectuée et on lui donne sa couleur
    socket.emit('repconnection', game.echiquiers[game.echiquiers.length-1].Joueurs.length-1)

    //Gestion du lancement de la partie
    if(game.echiquiers[game.echiquiers.length-1].Joueurs.length == 2) {
        console.log('start')
        for(let i=0; i<2; i++){ // on start le dernier echiquier si les deux joueurs sont tjr connectés
            console.log(game.echiquiers[game.echiquiers.length-1].Joueurs[i])
            io.sockets.sockets[game.echiquiers[game.echiquiers.length-1].Joueurs[i].id].emit('start', game.echiquiers[game.echiquiers.length-1]);
        }
    }

    //Définition des envois au serveur pour la partie
    socket.on('playable', (piece)=> {
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
            socket.emit('playable', game.echiquiers[indiceEchiquier]);
        }
        else socket.emit('reset', game.echiquiers[indiceEchiquier], couleurSocket);
    });

    socket.on('move', (deplacement)=> {

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

        if ((couleurSocket) == (game.echiquiers[indiceEchiquier].Nbtour%2)){ // si son tour alors :
            game.echiquiers[indiceEchiquier].board[deplacement.piece.x][deplacement.piece.y].piece.playable(game.echiquiers[indiceEchiquier])
            if(game.echiquiers[indiceEchiquier].board[deplacement.x][deplacement.y].playable){    
                
                let plateau = clone(game.echiquiers[indiceEchiquier]);
                game.echiquiers[indiceEchiquier].board[deplacement.piece.x][deplacement.piece.y].piece.move(deplacement.x,deplacement.y,game.echiquiers[indiceEchiquier])

    //regarder la bonne couleur a faire au lieu de la boucle
                let piece_prise = 0
                for(let i=0; i<2; i++) if(this.Joueurs[i].pieces_prises[this.Joueurs[i].pieces_prises.length - 1].Nbtour == Nbtour-1){ 
                    piece_prise = this.Joueurs[i].pieces_prises[this.Joueurs[i].pieces_prises.length - 1].piece;
                }

                plateau.reset_playable();
                for(let i=0; i<2; i++){ // on envoi le déplacement a tout le monde
                    io.sockets.sockets[game.echiquiers[indiceEchiquier].Joueurs[couleurSocket].id].emit('move', plateau, deplacement, piece_prise);
    //afficher/gérer la piece supprimée coté client ??
                }

    //check si echec et mat et envoyer le message si c'est le cas 
    //                                      -------------------------->    (pour quelle couleur ?)
                let CouleurGagnant = 0;
                if(true) for(let i=0; i<2; i++) socket.emit('endGame', CouleurGagnant)


            }
            else{
                game.echiquiers[echiquierNb].reset_playable(); // on reset avant de l'envoyer
                socket.emit('reset', game.echiquiers[indiceEchiquier], couleurSocket);
            }
        }
        else{
            game.echiquiers[echiquierNb].reset_playable(); // on reset avant de l'envoyer
            socket.emit('reset', game.echiquiers[indiceEchiquier], couleurSocket);
        }
    });
    socket.on('disconnect', ()=>{ // si le joueur demande une déconnection
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
            console.log("Déconnection d'un joueur + suppression du plateau correspondant");
        }
    });

    console.log('Fin Connection Client (coté serveur)')
});

server.listen(port);
console.log('server connected');
