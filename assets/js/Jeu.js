
class Jeu{
    constructor(){

        //connection serveur a faire..

        this.echiquier = new Plateau();
        //Génération des events a faire ?
        //Génération de la partie graphique a faire

        //connection server
        const socket = io.connect('http://localhost:800');

        //socket.emit('connection', socket);
        socket.on('repconnection', (couleur) => {
            this.couleur = couleur;
            //this.render = new renderCss(this.echiquier); // ---> a modifier avec les nouvelles classes pour fonctionner avec le serveur
        });
        socket.on('playable', (piece,playables) => { //tableau de playable
            //Rajouter tout les playables dans l'affichage graphique du board en fonction de la pièce
        });
        socket.on('move', (piece,x,y,suppr) => { // piece et deplacer en x,y
            //lancer l'animation
            //si suppr different de 0 le retirer du board
            // board(x,y) = board[piece.x,piece.y]
            //changer les coordonnées de x,y avec le déplacement
        });
        socket.on('reset', (echiquierReset) => {
            //Parcourir tout le tableau, 
            //instancier toutes les pièces avec les classes client 
            //Actualiser l'affichage
        });
        
        
    }
}


(function() {
	let game = new Jeu();
})();


//si pas de playable trouver un moyen de reset selected dans plateau