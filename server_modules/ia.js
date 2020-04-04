var valeurPieces = [
    {name: 'Reine', valeur: 9},
    {name: 'Tour', valeur: 5},
    {name: 'Fou', valeur: 3},
    {name: 'Cavalier', valeur: 3},
    {name: 'Roi', valeur: 0},
    {name: 'Pion', valeur: 1}
]
//pion
function direction_libre(piece, board){
    if(piece.nom=='Pion'){//module par piece ?
        for(let i=piece.y+Math.pow(-1,piece.couleur); i<8 && i>0; i+=Math.pow(-1,piece.couleur)){
            if(piece.couleur==board[i].piece.couleur&&piece.nom==board[i].piece.nom){
                return 2;
            }
        }
    }
    return 0;
}
function avancement(piece){
    if(piece.nom=='Pion'){//module par piece ?
        return 0.5*(Math.abs(piece.y-(1+(piece.couleur*5))));
    }
}


//tour
function Tour()





//Autre -> a mettre dans la classe ia directement
function Prise(piecePrise){ 
    if(0!=piecePrise){
        let valeur = 0
        //prise de la piece
        for(let i=0; i<valeurPieces; i++){if(valeurPieces[i].name == piecePrise.nom) valeur += valeurPieces[i].valeur;};
        return valeur;
    }
}

function verifierboucle(pieceName,sens, x, y, couleur, piecesDangeureuses, piecesAlliées, plateau){

    for(let i = 0; i < sens.length; i++){
        x += sens[i][0];
        y += sens[i][1];
        let boucle = true;

        if (plateau.isInBoard(x,y)) while(boucle){
            if(plateau.check_piece(x,y)){
                for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.nom == pieceName[j]){ 
                    if(plateau.board[x][y].piece.couleur == couleur) piecesAlliées.push(plateau.board[x][y].piece);
                    else piecesDangeureuses.push(plateau.board[x][y].piece);
                    boucle = false;
                }
            }
            x += sens[i][0]
            y += sens[i][1]
            if(!plateau.isInBoard(x,y)) boucle = false;
        }
    }
    return 1;
}

function verifiercote(pieceName,sens, plateau, x, y, couleur, piecesDangeureuses, piecesAlliées){

    for(let i = 0; i < sens.length; i++){
        x += sens[i][0];
        y += sens[i][1];

        if(plateau.check_piece(x,y)){
            for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.nom == pieceName[j]){
                if(plateau.board[x][y].piece.couleur == couleur) piecesAlliées.push(plateau.board[x][y].piece);
                else piecesDangeureuses.push(plateau.board[x][y].piece);
            }
        }
        
    }
    return 1;
}

function fontion(a,b){
    if(a.valeur > b.valeur) return 1;
    else return 0;
}

function Menace(piece, piecePrise){
    if(0!=piecePrise){

        let valeur = 0

        piecesDangeureuses = [];
        piecesAlliées = [];

        verifierboucle(["reine","fou"],[[1,1],[1,-1],[-1,1],[-1,-1]],piece.x,piece.y,piece.couleur,piecesDangeureuses,piecesAlliées,plateau);
        verifierboucle(["reine","tour"],[[1,0],[-1,0],[0,1],[0,-1]],piece.x,piece.y,piece.couleur,piecesDangeureuses,piecesAlliées,plateau);
        verifiercote(["pion"],[[1*Math.pow(-1,this.couleur + 1),1*Math.pow(-1,this.couleur + 1)],[1*Math.pow(-1,this.couleur + 1),-1*Math.pow(-1,this.couleur + 1)]],plateau,piece.x,piece.y,piece.couleur,piecesDangeureuses,piecesAlliées);
        verifiercote(["cavalier"],[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]],plateau,piece.x,piece.y,piece.couleur,piecesDangeureuses,piecesAlliées);

        //si notre piece peut être prise
        if(true){ // si echec a mettre
            for(let i=0; i<valeurPieces; i++){if(valeurPieces[i].name == piece.nom) valeur -= valeurPieces[i].valeur;};

            //Privilégier de continuer tant que nballie>nbennemi, ajouter dans le tableau à renvoyer directement ?

            /*                 A coder :

            classer ennemi en fonction de la valeur des pieces
                tant que Nbennemi > Nballie 
                    retirer Nbennemi le plus fort
            pareil en inversant la condition et en retirant Nballie le plus fort , methode a faire ?
            */
            
            piecesDangeureuses.sort(fonction());
            while (piecesDangeureuses.length() > piecesAlliées.length()){
                piecesDangeureuses.pop();
            }

            /*
            listeennemival = listeennemi*valeur de chaque(boucle a faire) 
            pareil pour listeallieval

            valeur += listeallieval-listeennemival

            */
        }
            
    }
}

function valeur_ia(piece, plateau, piecePrise){ // val par defaut de pieceprise  a mettre
    let valeur = 0
    
    for(let i=0; i<valeurPieces; i++){if(valeurPieces[i].name == piece.nom) valeur += valeurPieces[i].valeur;};

    valeur += direction_libre(piece, plateau.board)
    valeur += avancement(piece)

    valeur += Prise(piecePrise)
    valeur += Menace(piece, piecePrise) // potentiellement retirer piecePrise en déplacant la condition en amount

    //si peut prendre le roi methode a faire
    //valeur max +1 ?


}