
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

test = new Array()
test.push("reine-noir")
test.push("reine-noir")
test.push("reine-noir")
test.push("reine-noir")
test.push("reine-noir")
test.push("reine-noir")

couts = new Array()
couts.push('B3')
couts.push('H4')
couts.push('B8')


document.getElementById('pieces').innerHTML = "";
for(let i = 0; i < test.length; i++){
    let img = document.createElement("img");
    img.src = "../textures/piece-chess/"+test[i]+".png";
    let src = document.getElementById("pieces");
    src.appendChild(img);
    img.className = "image";
}



document.getElementById('couts_blanc').innerHTML = "";
document.getElementById('couts_noir').innerHTML = "";
for(let i = 0; i < couts.length; i++){
    if(i % 2 == 1){
        let div = document.getElementById("couts_blanc");
        let cout = document.createElement("h2");
        cout.setAttribute("class","ecriture");
        var texte = document.createTextNode(couts[i]);
        div.append(cout);
        cout.appendChild(texte);
    }
    if(i % 2 == 0){
        let div = document.getElementById("couts_noir");
        let cout = document.createElement("h2");
        cout.setAttribute("class","ecriture");
        var texte = document.createTextNode(couts[i]);
        div.append(cout);
        cout.appendChild(texte);
    }
}



(function() {
	let game = new Jeu();
})();


//si pas de playable trouver un moyen de reset selected dans plateau