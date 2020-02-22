class renderCss{
    constructor(plateau){
        for(let j=0; j<8; j++){
            for(let i=0; i<8; i++){
                let img = document.createElement("img");
                switch(plateau.board[i][j].piece){
                    case 0:
                        if((i+j)%2 == 0){
                            img.src="../img/blanc.png"
                        }
                        else img.src="../img/noir.png"
                        break;
                    default:
                        img.src=GetPath(plateau.board[i][j].piece.constructor.name, plateau.board[i][j].piece.couleur);
                }
                document.getElementById("board").firstElementChild.children[j].children[i].appendChild(img);
                document.getElementById("board").firstElementChild.children[j].children[i].addEventListener("click", function(){click(i, j, plateau)})
            }
        }
    }
}


function click(x, y, plateau){
    if (plateau.select.x==-1 && plateau.board[x][y].piece!=0){
        plateau.select.x = x;
        plateau.select.y = y;
        plateau.board[x][y].piece.playable(plateau)
    }
    else{
        if(plateau.board[x][y].playable){
            plateau.board[plateau.select.x][plateau.select.y].piece.move(x, y, plateau)
        }
        plateau.reset_playable();
        plateau.select.x = -1;
        plateau.select.y = -1;
    }
    
    for(let j=0; j<8; j++){
        for(let i=0; i<8; i++){
            if(plateau.board[i][j].playable & plateau.select.x != -1){
                if(plateau.check_piece(i,j)){
                    document.getElementById("board").firstElementChild.children[j].children[i].firstElementChild.src=GetPathPlay(plateau.board[i][j].piece.constructor.name);
                }
                else {
                    document.getElementById("board").firstElementChild.children[j].children[i].firstElementChild.src=GetPathPlay(plateau.board[plateau.select.x][plateau.select.y].piece.constructor.name);
                }
            }
            else{
                switch(plateau.board[i][j].piece){
                    case 0:
                        if((i+j)%2 == 0){
                            document.getElementById("board").firstElementChild.children[j].children[i].firstElementChild.src="../img/blanc.png"
                        }
                        else document.getElementById("board").firstElementChild.children[j].children[i].firstElementChild.src="../img/noir.png"
                        break;
                    default:
                        document.getElementById("board").firstElementChild.children[j].children[i].firstElementChild.src=GetPath(plateau.board[i][j].piece.constructor.name, plateau.board[i][j].piece.couleur);
                }
            }
        }
    }
}


function GetPath(nom, couleur){
    let img = "../img/" + nom
    if(couleur){
        img += "_blanc"
    } else img += "_noir"
    img += ".png"
    return img
}
function GetPathPlay(nom){
    return "../img/" + nom + "_play.png"
}