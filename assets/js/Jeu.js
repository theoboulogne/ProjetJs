
class Jeu{
    constructor(){


        //Dans le menu :
        // demander le pseudo du joueur pour l'enregistrement des scores

        this.play = false;
    

        //connection server
        const socket = io.connect('http://localhost:800');
        socket.on('repconnection', (couleur) => {
            console.log('Event - repconnection')

            //Coté Gestion du jeu
            this.couleur = couleur;

            //Coté UI:
            // indiquer l'attente d'un autre joueur
        });
        socket.on('start', (plateau) => {
            console.log('Event - start')
            console.log(plateau)

            //Coté Gestion du Jeu
            this.play = true; // on lance le jeu (retirer si non utilisé)
            this.echiquier = plateau;

            console.log(this.echiquier)

            //Coté ThreeJS
            // Lancer le rendu graphique

            //Coté UI
            // Lancer l'affichage de l'UI



            //  TEST RENDU THREEJS
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
                tmpRendu.push({name:tmpl[i].nom, couleur:tmpl[i].couleur, x:tmpl[i].x, y:tmpl[i].y})
            }
            console.log(tmpRendu[0])
            this.rendu = new RenduThreeJs(tmpRendu);
            


        });
        socket.on('playable', (plateau) => {
            console.log('Event - playable')

            this.echiquier = plateau;

            //Coté threejs :
            // Afficher les couts jouable (autre couleur ?) + piece selectionnée

            //Coté Gestion du jeu
            // implémenter l'utilisation de selected pour envoyer move ou playable au click en fonction

            
//si pas de playable trouver un moyen de reset selected dans plateau (coté serveur ou client ?)

        });
        socket.on('move', (plateau,deplacement,piece_prise) => { // piece et deplacer en x,y
            console.log('Event - move')

            //Coté threejs :
            //suppr les playable, deplacer la pièce et retirer la pièce prise en simultané

            //Coté Gestion du jeu
            // effectuer le déplacement de la pièce, supprimer la piece si !=0, enregist

            //Coté UI
            // Récupérer les couts joués et les pièces prises et actualiser l'ui en conséquence

            //Idée : Gérer la récupération de la 'piece_prise' coté client  ????
        });
        socket.on('reset', (echiquierReset, couleurReset) => {
            console.log('Event - reset')
            
            //Coté Gestion du jeu
            this.couleur = couleurReset;
            this.echiquier = echiquierReset;
            
            // Coté Threejs
            // Changer l'affichage en conséquence

            //Coté UI
            // montrer une alerte au joueur pour indiquer qu'il y a une erreur ??
        });
        socket.on('endGame', (couleurGagnant) => {

            //Coté gestion du Jeu :
            // enregistrer la partie dans la BDD

            //Coté UI :
            // afficher un message indiquant si gagné ou perdu
            // puis au click :
            //  rediriger vers menu
        });
        socket.on('menu', () => {
            console.log('Redirection vers le menu')
            window.location.href = "/menu"
        });
        
    }
}


(function() {
	let game = new Jeu();
})();

