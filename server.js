//Serveur - Echec

//Constantes
const port = 800;
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io =  require('socket.io')(server);
const mysql = require('mysql');

//Info de connection à la BDD
const InfoConnectionBDD = { 
  host: "localhost",
  user: "root",
  password: "",
  database: "echecs"
};

//Import des classes
const Plateau = require('./server_modules/Plateau');
const Joueur = require('./server_modules/Joueur');
const Chrono = require('./server_modules/Chrono');
//Import des Modules
const MYSQL = require('./server_modules/Mysql');
const IA = require('./server_modules/ia');

//Création de la table score dans la BDD si nécessaire
MYSQL.CreationScoreBDD(InfoConnectionBDD)

//Redirection des pages
app.use(express.static(__dirname + '/assets/'));
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/menu.html')
});
app.get('/jeu', (request, response, next) => {
    lastParam = request.query // on récupère les paramètres
    response.sendFile(__dirname + '/assets/views/jeu.html')
});

app.get("/scores", function(req,res){ // On est obligé de se connecter à la BDD dans le fichier server car la récupération des infos est asynchrone..
    let con = mysql.createConnection(InfoConnectionBDD);
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connecté à la mysql !");
        let sql = "SELECT `id`, `pseudo`, `pieces`, `chrono` FROM `scores` LIMIT 100" // On récupère les données, on limite à 100 scores pour 
        con.query(sql, function (err, result) {     // éviter les problèmes en cas de trop grand nombre d'infos
            if (err) throw err;
            return res.send(result);
        });
    });
  });
app.get("/jeu/replay", function(req,res){ // On est obligé de se connecter à la BDD dans le fichier server car la récupération des infos est asynchrone..
    if(lastParam!=undefined && lastParam.replay != undefined){
        let con = mysql.createConnection(InfoConnectionBDD);
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connecté à la mysql !");
            let sql = "SELECT `gagnant`, `coups`, `pieces_prises_blanc`, `pieces_prises_noir` FROM `scores` WHERE `id`="+String(lastParam.replay)+" LIMIT 1" // On récupère les données, on limite à 100 scores pour 
            con.query(sql, function (err, result) {     // éviter les problèmes en cas de trop grand nombre d'infos
                if (err) throw err;
                let envoi = {};
                envoi.data = result;
                let tmpPlateau = new Plateau();
                envoi.board = tmpPlateau.board;
                return res.send(envoi);
            });
        });
    }
});

//On stocke dans une variable tampon les paramètre du dernier client car on y accède uniquement depuis le app.get
let lastParam = undefined;
//On enregistre nos plateaux et nos joueurs avec leur socket
this.echiquiers = new Array();
// on stocke la variable pour pouvoir accéder de nos définitions d'event aux échiquiers
let game = this; 

io.sockets.on('connection',  (socket) =>{
    console.log('Nouvelle Connection Client')
    if(lastParam!=undefined){
        console.log('Pseudo du Client : ' + lastParam.pseudo)
    }

    //si un paramètre n'est pas définit on redirige au menu (au redémarrage du serveur principalement):
    if(lastParam == undefined || lastParam.pseudo == "") socket.emit('menu')
    else { // sinon on lance la partie

        if(lastParam.ia == 1){
            //Ajout de l'échiquier
            this.echiquiers.push(new Plateau);
            let indiceEchiquier = this.echiquiers.length-1
            this.echiquiers[indiceEchiquier].ia = 1;
            this.echiquiers[indiceEchiquier].ModeIA = true;


            //Gestion de l'ajout de joueur (Blanc toujours contre l'IA pour laisser le temps de charger les modèles)
            this.echiquiers[indiceEchiquier].Joueurs.push(new Joueur(0, socket.id, lastParam.pseudo));
            this.echiquiers[indiceEchiquier].Joueurs.push(new Joueur(1, "IA", "Ordinateur"));
            socket.emit('repconnection', 0)

            if(this.echiquiers.length>1) if(this.echiquiers[this.echiquiers.length-2].Joueurs.length == 1){
                // si l'avant dernier plateau n'est pas plein on le swap pour que le reste marche normalement
                let tmpPlateau = this.echiquiers[this.echiquiers.length-2]
                this.echiquiers[this.echiquiers.length-2] = this.echiquiers[this.echiquiers.length-1];
                this.echiquiers[this.echiquiers.length-1] = tmpPlateau;
                indiceEchiquier = this.echiquiers.length-2; // on change l'indice en conséquence
            }

            //On lance le chrono coté serveur pour enregistrer le temps de la partie.
            game.echiquiers[indiceEchiquier].chrono = new Chrono();
            socket.emit('start', game.echiquiers[indiceEchiquier]); 
            // on met le start à la fin pour éviter des conflits lors du déplacement de l'autre échiquier
        }else {

            //Gestion de l'ajout de plateau si nécessaire
            if(this.echiquiers.length==0) this.echiquiers.push(new Plateau());
            else if(this.echiquiers[this.echiquiers.length-1].Joueurs.length==2) this.echiquiers.push(new Plateau());

            //Gestion de l'ajout de joueur      
            this.echiquiers[this.echiquiers.length-1].Joueurs.push(new Joueur(this.echiquiers[this.echiquiers.length-1].Joueurs.length, socket.id, lastParam.pseudo));//On définit la couleur avec le nombre de joueur sur le plateau et on rajoute un joueur
            socket.emit('repconnection', game.echiquiers[game.echiquiers.length-1].Joueurs.length-1)// on informe le client que la connection est effectuée et on lui donne sa couleur

            //Gestion du lancement de la partie
            if(game.echiquiers[game.echiquiers.length-1].Joueurs.length == 2) {
                for(let i=0; i<2; i++){ 
                    //On lance le chrono coté serveur pour enregistrer le temps de la partie.
                    game.echiquiers[game.echiquiers.length-1].chrono = new Chrono();
                    io.sockets.sockets[game.echiquiers[game.echiquiers.length-1].Joueurs[i].id].emit('start', game.echiquiers[game.echiquiers.length-1]);
                }
            }
        }

    }
    //Définition des envois au serveur pour la partie
    socket.on('playable', (piece)=> {
        console.log("Génération des coups possibles")
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
        if(indiceEchiquier != undefined){
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
        }
    });

    socket.on('move', (deplacement)=> {
        console.log("Déplacement de pièce")
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
        if(indiceEchiquier != undefined){

            //On vient définir le déplacement de l'IA si nécessaire
            if((couleurSocket) != (game.echiquiers[indiceEchiquier].Nbtour%2) && game.echiquiers[indiceEchiquier].ia == 1){
                let moveIA = IA.ia(game.echiquiers[indiceEchiquier], (couleurSocket+1)%2);
                console.log('Move IA : ')
                console.log(moveIA)
                game.echiquiers[indiceEchiquier].select.x = moveIA.piece.x
                game.echiquiers[indiceEchiquier].select.y = moveIA.piece.y
                deplacement.piece = JSON.parse(JSON.stringify(moveIA.piece))
                deplacement.x = moveIA.Coo.x
                deplacement.y = moveIA.Coo.y
                game.echiquiers[indiceEchiquier].board[deplacement.x][deplacement.y].playable = true;
                if(deplacement.piece.nom == "Pion" && (deplacement.y == 0 || deplacement.y == 7)) deplacement.piece.choix = "Reine" // en cas de promotion on choisi toujours la reine pour l'ia
            }
            // else {
            //     console.log('Valeur Joueur : ' + String(IA.testcoup(game.echiquiers[indiceEchiquier], game.echiquiers[indiceEchiquier].board[deplacement.piece.x][deplacement.piece.y].piece, deplacement.x, deplacement.y)))
            // }

            //Si son tour ou IA actif et paramètres corrects alors
            if (((couleurSocket) == (game.echiquiers[indiceEchiquier].Nbtour%2)||(game.echiquiers[indiceEchiquier].ia == 1))&&
                (deplacement.piece.x == game.echiquiers[indiceEchiquier].select.x) &&
                (deplacement.piece.y == game.echiquiers[indiceEchiquier].select.y) &&
                (game.echiquiers[indiceEchiquier].board[deplacement.x][deplacement.y].playable)){
                
                //on clone le plateau pour l'envoyer avant le déplacement afin de l'effectuer graphiquement en front
                let plateau = (game.echiquiers[indiceEchiquier]).clone();
                if(deplacement.piece.choix != undefined) game.echiquiers[indiceEchiquier].board[deplacement.piece.x][deplacement.piece.y].piece.choix = deplacement.piece.choix;
                game.echiquiers[indiceEchiquier].board[deplacement.piece.x][deplacement.piece.y].piece.move(deplacement.x,deplacement.y,game.echiquiers[indiceEchiquier])

                if(deplacement.piece.choix != undefined){
                    if(game.echiquiers[indiceEchiquier].board[deplacement.x][deplacement.y].piece.nom == "Pion"&&
                    game.echiquiers[indiceEchiquier].board[deplacement.x][deplacement.y].piece.y == ((game.echiquiers[indiceEchiquier].board[deplacement.x][deplacement.y].piece.couleur + 1) % 2)*7 ){
                        let piecePromotion = game.echiquiers[indiceEchiquier].board[deplacement.x][deplacement.y].piece.promotion(deplacement.piece.choix);
                        game.echiquiers[indiceEchiquier].board[deplacement.x][deplacement.y].piece = piecePromotion;
                    }
                }

                //On détecte la pièce prise en faisant la différence par rapport au tour précédent
                let piece_prise = 0 
                if(game.echiquiers[indiceEchiquier].Joueurs[((plateau.Nbtour%2)+1)%2].pieces_prises.length!=plateau.Joueurs[((plateau.Nbtour%2)+1)%2].pieces_prises.length){
                    piece_prise = game.echiquiers[indiceEchiquier].Joueurs[((plateau.Nbtour%2)+1)%2].pieces_prises[game.echiquiers[indiceEchiquier].Joueurs[((plateau.Nbtour%2)+1)%2].pieces_prises.length - 1].piece
                }
                // On envoi le déplacement a tout le monde
                for(let i=0; i<(2-game.echiquiers[indiceEchiquier].ia); i++) io.sockets.sockets[game.echiquiers[indiceEchiquier].Joueurs[i].id].emit('move', plateau, deplacement, piece_prise);
                
                if(game.echiquiers[indiceEchiquier].echecEtMat(((plateau.Nbtour%2)+1)%2)){//Detection fin de partie
                    console.log('Echec et Mat')
                    //Enregistrement du score dans la BDD mysql
                    MYSQL.EnvoiScoreBDD(game.echiquiers[indiceEchiquier], (plateau.Nbtour%2), InfoConnectionBDD);
                    //Envoi de l'event aux client pour rediriger vers le menu
                    for(let i=0; i<(2-game.echiquiers[indiceEchiquier].ia); i++) io.sockets.sockets[game.echiquiers[indiceEchiquier].Joueurs[i].id].emit('endGame', (plateau.Nbtour%2));
                    //On désactive l'IA au cas où pour éviter que le serveur crash lors d'une victoire
                    game.echiquiers[indiceEchiquier].ia = 0;
                }


            }
            else{
                if(!(game.echiquiers[indiceEchiquier].ModeIA && game.echiquiers[indiceEchiquier].ia == 0)){ // on reset pas si modeIA actif alors que ia désactivée ( fin de partie contre IA )
                    console.log("Réinitialisation d'un client - Move");
                    game.echiquiers[indiceEchiquier].reset_playable(); // on reset les playables avant de l'envoyer
                    game.echiquiers[indiceEchiquier].select = {x:-1, y:-1}; // aussi le select car on est dans l'event move donc il est assigné
                    socket.emit('reset', game.echiquiers[indiceEchiquier], couleurSocket);
                }
            }
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
                if(game.echiquiers[indiceEchiquier].Joueurs[j].id != socket.id && game.echiquiers[indiceEchiquier].Joueurs[j].id != "IA"){
                    io.sockets.sockets[game.echiquiers[indiceEchiquier].Joueurs[j].id].emit('deconnection'); // on change de page 
                }
            }
            game.echiquiers.splice(indiceEchiquier, 1); // on retire le plateau
            console.log("Redirection du deuxième joueur sur le menu et suppression de son echiquier");
        }
    });

    console.log("Fin de l'initialisation d'un client")
});

server.listen(port);
console.log('Serveur en Ligne');
