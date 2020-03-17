
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
            // déplacer dans la classe Plateau coté front ??

            let tmpl = []
            for(let i=0; i<8; i++){
                for(let j=0; j<8; j++){
                    if(this.echiquier.board[i][j].piece!=0){
                        tmpl.push(this.echiquier.board[i][j].piece)
                    }
                }
            }
            let tmpRendu = []
            for(let i=0; i<tmpl.length;i++){
                tmpRendu.push({name:tmpl[i].constructor.name, couleur:tmpl[i].couleur, x:tmpl[i].x, y:tmpl[i].y})
            }
            
            this.rendu = new RenduThreeJs(tmpRendu);
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