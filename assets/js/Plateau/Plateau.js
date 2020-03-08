class Plateau{
    constructor(){
        console.log('Plateau instanciée');

        //Coté Client
        this.Nbtour = 0;
        this.board = new Array(8)
        for(let i = 0; i<8; i++){
            this.board[i] = new Array(8)
            for(let j = 0; j<8; j++){
                this.board[i][j] = new Case();
            }
        }
        for(let j=0; j<2; j++){
            for(let i=0; i<8; i++) this.board[i][1 + (j*5)].piece = new Pion(j, i, 1 + (j*5));
            for(let i=0; i<2; i++) this.board[i*7][j*7].piece = new Tour(j, i*7, j*7);
            for(let i=0; i<2; i++) this.board[1 + (i*5)][j*7].piece = new Cavalier(j, 1 + (i*5), j*7);
            for(let i=0; i<2; i++) this.board[2 + (i*3)][j*7].piece = new Fou(j, 2+ (i*3), j*7);
            this.board[3 + j][j*7].piece = new Reine(j, 3+j, j*7);
            this.board[4 - j][j*7].piece = new Roi(j, 4-j, j*7); // mettre la coordonnée du roi depuis joueur ?
        }
    }
}
