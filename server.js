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

//Renvoi vers le fichier index client
app.use(express.static(__dirname + '/assets/'));
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/index.html')
});

//On enregistre nos plateaux et nos joueurs avec leur socket
this.echiquiers = new Array();
this.JoueursSockets = new Array();
game = this;


io.sockets.on('connection',  (socket) =>{
    
    console.log('Debut Connection Client (coté serveur)')
    console.log(socket)
    //console.log(game.echiquiers)
    //console.log(game.JoueursSockets)
        //Connection 

    //On rajoute un plateau si nécessaire
    if(this.echiquiers.length==0) this.echiquiers.push(new Plateau());
    else if(this.echiquiers[this.echiquiers.length-1].Joueurs.length==2) this.echiquiers.push(new Plateau());

    //on définit la couleur avec le nombre de joueur sur le plateau et on rajoute un joueur
    this.echiquiers[this.echiquiers.length-1].Joueurs.push(new Joueur(this.echiquiers[this.echiquiers.length-1].Joueurs.length));
    
    //On enregistre notre socket pour repérer son plateau par la suite
    game.JoueursSockets.push([socket, game.echiquiers.length-1])

    // on informe le client que la connection est effectuée et on lui donne sa couleur
    socket.emit('repconnection', game.echiquiers[game.echiquiers.length-1].Joueurs.length-1) 
    //on envoi la couleur pour détecter si on lance la partie ou non 
    //(1 on lance car 2 joueurs)

    //Définition des envois au serveur pour la partie




    //playable a rajouter
    //--> tout changer en coordonéees



    socket.on('move', (socket, deplacement)=> {

        let i = 0
        while(game.JoueursSockets[i][0]!=socket) i++;
        let echiquierNb = game.JoueursSockets[i][1];
        //Récupérer echiquierNb et couleur grace a la socket

        if ((i%2) == (game.echiquiers[echiquierNb].Nbtour%2)){
            game.echiquiers[echiquierNb].board[deplacement.piece.x][deplacement.piece.y].piece.playable(game.echiquiers[echiquierNb])
            if(game.echiquiers[echiquierNb].board[deplacement.x][deplacement.y].playable){
                game.echiquiers[echiquierNb].board[deplacement.piece.x][deplacement.piece.y].piece.move(deplacement.x,deplacement.y,game.echiquiers[echiquierNb])
                socket.emit('repmove', 1);

                for(let j=0; j<2; j++) game.JoueursSockets[i+j][0].emit('move', deplacement); // on confirme le déplacement
            }
            else{
                socket.emit('repmove', 0); // on refuse le déplacement et on reset pour le joueur
                socket.emit('reset', game.echiquiers[echiquierNb], i%2);
            }
            game.echiquiers[echiquierNb].reset_playable();
            //check si echec et mat et envoyer le message si c'est le cas
        }
        else{
            socket.emit('repmove', 0); // on refuse le déplacement et on reset pour le joueur
            socket.emit('reset', game.echiquiers[echiquierNb], i%2);
        }
        //sinon renvoyer erreur pour que le client corrige son erreur
    });
    socket.on('disconnect', (socket)=>{
        let i = 0
        console.log('socket')
        console.log(socket)
        console.log('enregistré')
        console.log(game.JoueursSockets[0][0])
        while(game.JoueursSockets[i][0]!=socket) i++;

        let j = i;
        //parcourir joueursocket retirer après ce plateau

        if((i%2)!=0) i--; // on se met sur le premier joueur
        //split de 2 a faire
        //suppression de l'échiquier correspondant aussi
        

        console.log('Fin de la partie..');
    });

    console.log('Fin Connection Client (coté serveur)')
});

server.listen(port);
console.log('server connected');
