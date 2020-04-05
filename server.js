//Serveur - Echec

//Constantes
/*
const mysql = require('mysql');
let con = mysql.createConnection({ //Info de connection à la BDD
  host: "localhost",
  user: "root",
  password: "",
  database: "echecs"
});*/

const port = 800;
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io =  require('socket.io')(server);

//Import des classes
const Plateau = require('./server_modules/Plateau');
const Joueur = require('./server_modules/Joueur');

//Redirection des pages
app.use(express.static(__dirname + '/assets/'));
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/menu.html')
});
app.get('/jeu', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/jeu.html')
});

//On enregistre nos plateaux et nos joueurs avec leur socket
this.echiquiers = new Array();
let game = this; // on stocke la variable pour pouvoir accéder de nos définitions d'event aux échiquiers

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
        
        game.echiquiers[indiceEchiquier].select = {x:-1, y:-1}; //Reset si les conditions sont pas bonnes / si pas de cases playable
        if ((couleurSocket) == (game.echiquiers[indiceEchiquier].Nbtour%2) && 
            game.echiquiers[indiceEchiquier].board[piece.x][piece.y].piece.nom == piece.nom &&
            couleurSocket == game.echiquiers[indiceEchiquier].board[piece.x][piece.y].piece.couleur
            ){ // si son tour et pas d'erreur
            
            game.echiquiers[indiceEchiquier].reset_playable();
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
            (deplacement.piece.x == game.echiquiers[indiceEchiquier].select.x) &&
            (deplacement.piece.y == game.echiquiers[indiceEchiquier].select.y) &&
            (game.echiquiers[indiceEchiquier].board[deplacement.x][deplacement.y].playable)){
                    

            //on clone le plateau pour l'envoyer avant le déplacement afin de l'effectuer graphiquement en front
            let plateau = (game.echiquiers[indiceEchiquier]).clone();
            game.echiquiers[indiceEchiquier].board[deplacement.piece.x][deplacement.piece.y].piece.move(deplacement.x,deplacement.y,game.echiquiers[indiceEchiquier])
            game.echiquiers[indiceEchiquier].select = {x:-1, y:-1};

            let piece_prise = 0 //On détecte la pièce prise,
            if(game.echiquiers[indiceEchiquier].Joueurs[(couleurSocket+1)%2].pieces_prises.length!=plateau.Joueurs[(couleurSocket+1)%2].pieces_prises.length){
                piece_prise = game.echiquiers[indiceEchiquier].Joueurs[(couleurSocket+1)%2].pieces_prises[game.echiquiers[indiceEchiquier].Joueurs[(couleurSocket+1)%2].pieces_prises.length - 1].piece
            }
            
            for(let i=0; i<2; i++){ // On envoi le déplacement a tout le monde
                io.sockets.sockets[game.echiquiers[indiceEchiquier].Joueurs[i].id].emit('move', plateau, deplacement, piece_prise);
            }
            
            if(game.echiquiers[indiceEchiquier].echecEtMat((couleurSocket+1)%2)){//Detection fin de partie
                console.log('Echec et Mat')
                
                //Enregistrement dans la BDD mysql
                /*con.connect(function(err) {
                    if (err) throw err;
                    console.log("Connecté à la mysql !");
                    var sql = "INSERT INTO `scores`(`pseudo`, `pieces`, `chrono`) VALUES ('" + 
                            "Pseudo" + "'," +
                            String(16 - game.echiquiers[indiceEchiquier].Joueurs[(couleurSocket+1)%2].pieces_prises.length) + "," +
                            String(0) + ")";
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("Score inséré");
                    });
                });
                con.end();*/

                //Envoi de l'event aux client pour rediriger vers le menu
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
console.log('Serveur en Ligne');
