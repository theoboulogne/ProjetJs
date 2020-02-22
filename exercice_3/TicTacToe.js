class TicTacToe extends Observable {
    constructor(){
        super();

        this.grid = [];// Déclaration du tableau
        for(let i=0; i<3; i++) this.grid[i] = [];

        this.reset(); // Reset pour définir le currentPlayer ainsi que pour initialiser la grid
    }
    
    switchCurrentPlayer(){
        if(this.getCurrentPlayer()==0) this.currentPlayer = 1;
        else this.currentPlayer = 0;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }
    
    getCaseState(x, y) {
        return this.grid[x][y];
    }

    setGridUndefined(){//Init Grid sur undefined
        for(let i=0; i<3; i++) for(let j=0; j<3; j++){
            this.grid[i][j]=undefined; //On définit toutes les cases sur undefined
        }
    }

    reset(){
        this.currentPlayer = 0;//Init CurrentPlayer
        this.setGridUndefined();//Init Grid
    }

    play(x, y){//On joue le coût et on change le joueur actuel
        this.grid[x][y] = this.getCurrentPlayer();
        this.switchCurrentPlayer();
    }
    
    hasWinner(){
        if(this.getWinner()!=undefined) return true;
        else return false;
    }

    getWinner() {
        return test.Fin(this.grid);
    }

    isFinished(){
        if(this.hasWinner()) return true; // si joueur a gagné
        return test.CaseLibre(this.grid);
    }

}