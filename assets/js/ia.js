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
    if(piece.constructor.name=='Pion'){//module par piece ?
        for(let i=piece.y+Math.pow(-1,piece.couleur); i<8 && i>0; i+=Math.pow(-1,piece.couleur)){
            if(piece.couleur==board[i].piece.couleur&&piece.constructor.name==board[i].piece.constructor.name){
                return 2;
            }
        }
    }
    return 0;
}
function avancement(piece){
    if(piece.constructor.name=='Pion'){//module par piece ?
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
        for(let i=0; i<valeurPieces; i++){if(valeurPieces[i].name == piecePrise.constructor.name) valeur += valeurPieces[i].valeur;};
        return valeur;
}

function verifierboucle(pieceName,sens, x, y, couleur, piecesDangeureuses, piecesAlliées, plateau){

    for(let i = 0; i < sens.length; i++){
        x += sens[i][0];
        y += sens[i][1];
        let boucle = true;

        if (plateau.isInBoard(x,y)) while(boucle){
            if(plateau.check_piece(x,y)){
                for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.constructor.name == pieceName[j]){ 
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
            for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.constructor.name == pieceName[j]){
                if(plateau.board[x][y].piece.couleur != couleur) piecesAlliées.push(plateau.board[x][y].piece);
                else piecesDangeureuses.push(plateau.board[x][y].piece);
            }
        }
        
    }
    return 1;
}

function Menace(piece, piecePrise){
    if(0!=piecePrise){
        let valeur = 0
        //methode de echec a récupérer et mettre la couleur en argument + récupérer la liste ennemi menaçant et allie qui protegent

        //si notre piece peut être prise
        if(true){ // si echec a mettre
            for(let i=0; i<valeurPieces; i++){if(valeurPieces[i].name == piece.constructor.name) valeur -= valeurPieces[i].valeur;};

            //Privilégier de continuer tant que nballie>nbennemi, ajouter dans le tableau à renvoyer directement ?

/*                 A coder :

            classer ennemi en fonction de la valeur des pieces
                tant que Nbennemi > Nballie 
                    retirer Nbennemi le plus fort
            pareil en inversant la condition et en retirant Nballie le plus fort , methode a faire ?
            


            listeennemival = listeennemi*valeur de chaque(boucle a faire) 
            pareil pour listeallieval

            valeur += listeallieval-listeennemival

*/
            
    }
}

function valeur_ia(piece, plateau, piecePrise){ // val par defaut de pieceprise  a mettre
    let valeur = 0
    
    for(let i=0; i<valeurPieces; i++){if(valeurPieces[i].name == piece.constructor.name) valeur += valeurPieces[i].valeur;};

    valeur += direction_libre(piece, plateau.board)
    valeur += avancement(piece)

    valeur += Prise(piecePrise)
    valeur += Menace(piece, piecePrise) // potentiellement retirer piecePrise en déplacant la condition en amount

    //si peut prendre le roi methode a faire
    //valeur max +1 ?


}