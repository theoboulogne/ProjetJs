class renderCss{
    constructor(board){
        for(let j=0; j<8; j++){
            for(let i=0; i<8; i++){
                let img = document.createElement("img");
                switch(board[i][j].piece.img){
                    case 0:
                        img.src="Vide.png"
                        break;
                    default:
                        img.src=board[i][j].piece.img;
                }
                document.getElementbyId("board").firstElementChild.children[j].children[i].appendChild(img);
                document.getElementbyId("board").firstElementChild.children[j].children[i].addEventListener("click", function(){click(i, j, board)})
            }
        }
        this.select.x = -1;
        this.select.y = -1;
    }

    click(x, y, board){
        if (this.select.x==-1){
            this.select.x = x;
            this.select.y = y;
        }
        else{
            deplacement(xo, yo, xa, ya, piece)
        }
    }

    deplacement(xo, yo, xa, ya, piece){ //origine | arrive | board[xa][ya].piece
        document.getElementbyId("board").firstElementChild.children[yo].children[xo].firstElementChild.src = "Vide.png"
        document.getElementbyId("board").firstElementChild.children[ya].children[xa].firstElementChild.src = piece.img
    }
    retirer(x, y){
        document.getElementbyId("board").firstElementChild.children[y].children[x].firstElementChild.src = "Vide.png"
    }
    
}

