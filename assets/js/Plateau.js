class Plateau{
    constructor(){
        console.log('Plateau instanciée');

        this.board = new Array(8)
        for(let i = 0; i<8; i++){
            this.board[i] = new Array(8)
            for(let j = 0; j<8; j++){
                this.board[i][j] = new Case();
            }
        }

        // Ajouter les différentes pièces ( méthode ? ou passer les joueurs en argument du constructeur ? 
                                        //  ou générer les joueurs dans le plateau directement)
    }
}

class Case{
    constructor(){ // Couleur de la case à gérer dans la partie graphique
        this.playable = false; // prévisualisation du coup jouable
        this.piece = 0; // undefined à mettre ?
    }
}
