
class Jeu{
    constructor(){

        //connection serveur a faire..
        this.play = false;
        //Génération des events a faire ?
        //Génération de la partie graphique a faire

        //connection server
        const socket = io.connect('http://localhost:800');
        socket.on('repconnection', (couleur) => {
            console.log('Event - repconnection')
            this.couleur = couleur;
            //this.render = new renderCss(this.echiquier); // ---> a modifier avec les nouvelles classes pour fonctionner avec le serveur
        });
        socket.on('start', () => {
            console.log('Event - start')
            this.play = true;
            this.echiquier = new Plateau();
            for(let i=0; i<2; i++) this.echiquier.Joueurs.push(new Joueur(i)); // déplacer dans la classe Plateau coté front ??
        });
        socket.on('playable', (piece,playables) => { //tableau de playable, passer en coordonnées ?
            console.log('Event - playable')
            //Rajouter tout les playables dans l'affichage graphique du board en fonction de la pièce
        });
        socket.on('move', (piece,x,y,suppr) => { // piece et deplacer en x,y
            console.log('Event - move')
            //lancer l'animation
            //si suppr different de 0 le retirer du board
            // board(x,y) = board[piece.x,piece.y]
            //changer les coordonnées de x,y avec le déplacement
        });
        socket.on('reset', (echiquierReset) => {
            console.log('Event - reset')
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