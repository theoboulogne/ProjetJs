

module.exports = {
    ia(plateau, couleur){
    let tmpPlateau = plateau.clone(); // on clone le plateau en amount par sécurité

    let coup = evaluation_joueur(tmpPlateau, couleur, couleur, 2) 
    // on sélectionne les 3 meilleurs coups uniquement pour éviter un trop grand nombre d'appels 
    //(faire varier pour augmenter la puissance de l'ia au détriment de la vitesse
    return coup;
    }
}
//Prendre couleur initiale pour savoir si + ou -
function evaluation_joueur(plateau, couleur, couleurorigine, nb){

    let aTraiter = []
    for(let i=0; i<8; i++){ // On sélectionne toutes les pièces à traiter
        for(let j=0; j<8; j++){
            if(plateau.board[i][j].piece != 0) if(plateau.board[i][j].piece.couleur == couleur) aTraiter.push({x:i, y:j});
        }
    }

    let meilleurs = []
    for(let i=0; i<aTraiter.length; i++){ // évalue les coups possibles de nos pièces et on les stocke dans notre tableau 'meilleurs'
        let tmpEvaluation = evaluation_coups_piece(plateau, plateau.board[aTraiter[i].x][aTraiter[i].y].piece)
        for(let i=0; i<tmpEvaluation.length; i++) {
            meilleurs.push({
                Coo: JSON.parse(JSON.stringify(tmpEvaluation[i].Coo)),
                piece: tmpEvaluation[i].piece.clone(),
                valeur:JSON.parse(JSON.stringify(tmpEvaluation[i].valeur))
                });
        }
    }
    meilleurs.sort((a, b) => b.valeur - a.valeur); // on trie en fonction de la valeur du coup

    if(nb == 1) {
        // console.log('renvoi meilleur 0 :')
        // console.log(meilleurs[0])
        // console.log('--------')
        if(meilleurs.length>0)return meilleurs[0]
        else return 0
    }

    let coups = []
    for(let i=0; i<(nb) && i<meilleurs.length; i++){ // on teste les nb meilleurs coups
        let tmpPlateau = plateau.clone();
        let tmpPiece = meilleurs[i].piece.clone();
        tmpPiece.playable(tmpPlateau);
        tmpPiece.move(meilleurs[i].Coo.x, meilleurs[i].Coo.y, tmpPlateau);
        coups.push({
            Coo:JSON.parse(JSON.stringify(meilleurs[i].Coo)),
            piece:meilleurs[i].piece.clone(),
            valeur:meilleurs[i].valeur}) // on garde les coo et la piece a déplacer par rapport à ce coup en mémoire
        // console.log('boucle-meilleur')
        // console.log(coups[coups.length-1].valeur)
        // console.log('evaluation, couleur : '+String((couleur+1)%2)+"/"+String(couleurorigine)+" , nb : "+String(nb-1))
        if(couleur == couleurorigine) coups[coups.length-1].valeur -= (evaluation_joueur(tmpPlateau, (couleur+1)%2, couleurorigine, nb-1).valeur); 
        else coups[coups.length-1].valeur += (evaluation_joueur(tmpPlateau, (couleur+1)%2, couleurorigine, nb-1).valeur); 
        // console.log('fin evaluation, couleur : '+String((couleur+1)%2)+"/"+String(couleurorigine)+" , nb : "+String(nb-1))
        // console.log(coups[coups.length-1].valeur)
        // console.log('--')
        // on retire la valeur du meilleur coup de l'ennemi pour calculer la valeur du coup initial 
        //(et ainsi permettre d'évaluer si un coup est profitable à l'adversaire)
    }
    coups.sort((a, b) => b.valeur - a.valeur);//On trie à nouveau en fonction de la valeur d'un coup
    // console.log('renvoi')
    // console.log(coups[0].valeur)
    // console.log('fin renvoi')
    return {
        Coo:JSON.parse(JSON.stringify(coups[0].Coo)),
        piece:coups[0].piece.clone(),
        valeur:JSON.parse(JSON.stringify(coups[0].valeur))
        }; // et on renvoi le meilleur coup
}

function evaluation_coups_piece(plateau, piece){//On récupère les déplacements possibles de la pièce
    let renvoi = []
    let tmpPlateau = plateau.clone()
    tmpPlateau.reset_playable()
    piece.playable(tmpPlateau); // On calcule les cases jouables de la pièce
    let aTraiter = []
    for(let i=0; i<8; i++){//on enregistre les cases jouables dans un tableau
        for(let j=0; j<8; j++){
            if(tmpPlateau.board[i][j].playable) aTraiter.push({x:i, y:j});
        }
    }
    //On vient évaluer les coups possibles de notre pièce
    for(let i=0; i<aTraiter.length; i++) renvoi.push({Coo:JSON.parse(JSON.stringify(aTraiter[i])), piece:piece.clone(), valeur:JSON.parse(JSON.stringify(evaluation_coup(tmpPlateau, piece, aTraiter[i].x, aTraiter[i].y)))});
    tmpPlateau.reset_playable(); // on reset les playables avant de passer à la pièce suivante dans 'evaluation_joueur'
    return renvoi;
}

function evaluation_coup(plateau, piece, x, y){ //On effectue le déplacement avant d'évaluer les modifications
    let tmpPlateau = plateau.clone(); // on clone le plateau car on déplace la pièce pour évaluer le coup
    let tmpPiece = piece.clone()
    tmpPiece.move(x, y, tmpPlateau) // on effectue le déplacement
    
    //On détecte la pièce prise en faisant la différence par rapport au tour précédent (avant le déplacement)
    let piece_prise = 0 
    if(plateau.Joueurs[(tmpPiece.couleur+1)%2].pieces_prises.length!=tmpPlateau.Joueurs[(tmpPiece.couleur+1)%2].pieces_prises.length){
        piece_prise = tmpPlateau.Joueurs[(tmpPiece.couleur+1)%2].pieces_prises[tmpPlateau.Joueurs[(tmpPiece.couleur+1)%2].pieces_prises.length - 1].piece.clone()
    }

    //on renvoi la valeur de ce déplacement
    return valeur_ia(tmpPiece, tmpPlateau, piece_prise);
}

function valeur_ia(piece, plateau, piecePrise){ //on vient calculer la valeur d'un déplacement
    let valeur = 0

    //for(let i=0; i<valeurPieces; i++){if(valeurPieces[i].name == piece.nom) valeur += valeurPieces[i].valeur;};
    //Utilité ?

    valeur += direction_libre(piece, plateau.board)
    valeur += avancement(piece)

    valeur += Prise(piecePrise)

    valeur += Menace(piece, plateau) // potentiellement retirer piecePrise en déplacant la condition en amount

    //Il faudrais rajouter des fonctions d'évaluation afin d'améliorer l'IA ainsi que potentiellement rajouter
    //plus de profondeur à l'évaluation (plus grand nombre de coup par joueur et plus grand nombre de tour par coup)
    //mais pour augmenter la profondeur il faudrait d'abord affiner l'algorithme de recherche pour éviter d'aller trop loin

    return valeur;
}
//pion
function direction_libre(piece, board){
    if(piece.nom=='Pion'){
        for(let i=piece.y+Math.pow(-1,piece.couleur); i<8 && i>0; i+=Math.pow(-1,piece.couleur)){
            if(piece.couleur==board[piece.x][i].piece.couleur&&piece.nom==board[piece.x][i].piece.nom){
                return 1;
            }
        }
    }
    return 0;
}
function avancement(piece){
    if(piece.nom=='Pion'){
        return 0.4*(Math.abs(piece.y-(1+(piece.couleur*5))));
    }
    return 0;
}





let valeurPieces = [
    {name: 'Reine', valeur: 9},
    {name: 'Tour', valeur: 5},
    {name: 'Fou', valeur: 3},
    {name: 'Cavalier', valeur: 3},
    {name: 'Roi', valeur: 100}, // roi sur 100 pour que l'ia le protège au maximum
    {name: 'Pion', valeur: 1}
]


function Prise(piecePrise){ 
    if(0!=piecePrise){
        //prise de la piece
        for(let i=0; i<valeurPieces.length; i++){if(valeurPieces[i].name == piecePrise.nom) return valeurPieces[i].valeur;};
    }
    return 0
}

function verifierboucle(pieceName,sens, plateau, piece, piecesPortee){
    for(let i = 0; i < sens.length; i++){
        let x = piece.x + sens[i][0];
        let y = piece.y + sens[i][1];
        let boucle = true;

        if (plateau.isInBoard(x,y)) while(boucle){
            if(plateau.check_piece(x,y)){
                for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.nom == pieceName[j]){
                    for(let i=0; i<valeurPieces.length; i++) { if(valeurPieces[i].name == pieceName[j]) {
                        if(plateau.board[x][y].piece.couleur == piece.couleur) piecesPortee[0].push({piece:plateau.board[x][y].piece, valeur:valeurPieces[i].valeur});
                        else piecesPortee[1].push({piece:plateau.board[x][y].piece, valeur:valeurPieces[i].valeur});
                    }}
                }
                if(plateau.board[x][y].piece.couleur == piece.couleur) boucle = false;
            }
            x += sens[i][0]
            y += sens[i][1]
            if(!plateau.isInBoard(x,y)) boucle = false;
        }
    }
    return piecesPortee;
}

function verifiercote(pieceName,sens, plateau, piece, piecesPortee){
    for(let i = 0; i < sens.length; i++){
        let x = piece.x + sens[i][0];
        let y = piece.y + sens[i][1];

        if(plateau.check_piece(x,y)){
            for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.nom == pieceName[j]){
                for(let i=0; i<valeurPieces.length; i++) { if(valeurPieces[i].name == pieceName[j]) {
                    if(plateau.board[x][y].piece.couleur == piece.couleur) piecesPortee[0].push({piece:plateau.board[x][y].piece, valeur:valeurPieces[i].valeur});
                    else piecesPortee[1].push({piece:plateau.board[x][y].piece, valeur:valeurPieces[i].valeur});
                }}
            }
        }
    }
    return piecesPortee;
}


function Menace(piece, plateau){
    return 0

    let piecesPortee = [[],[]] // indice 0 allié / indice 1 ennemi
    let valPieces = [0,0]

    piecesPortee = verifierboucle(["Reine","Fou"],[[1,1],[1,-1],[-1,1],[-1,-1]], plateau, piece, piecesPortee)
    piecesPortee = verifierboucle(["Reine","Tour"],[[1,0],[-1,0],[0,1],[0,-1]], plateau, piece, piecesPortee)
    piecesPortee = verifiercote("Pion",[[-1,(-2*piece.couleur) + 1],[1,(-2*piece.couleur) + 1]], plateau, piece, piecesPortee)
    piecesPortee = verifiercote("Cavalier",[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]], plateau, piece, piecesPortee)
    //piecesPortee = verifiercote("Roi", [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]], plateau, piece, piecesPortee)

    for(let i=0; i<2; i++) piecesPortee[i].sort((a, b) => a.valeur - b.valeur)

    if(piecesPortee[0].length !=0 || piecesPortee[1].length !=0){
        console.log('-  -  -')
        console.log(piecesPortee[0])
        console.log('-')
        console.log(piecesPortee[1])
        console.log('-  -')
    }


    for(let i=0; i<Math.min(piecesPortee[1].length, piecesPortee[0].length); i++) {
        for(let j=0; j<2; j++) valPieces[j]+= piecesPortee[j][i].valeur
    }
    let valeur = valPieces[1]-valPieces[0]

    if(valPieces[0]>=valPieces[1] || (piecesPortee[1].length>0&&piecesPortee[0].length==0)){
        if(piecesPortee[0].length<=piecesPortee[1].length) for(let i=0; i<valeurPieces.length; i++){if(valeurPieces[i].name == piece.nom) valeur += valeurPieces[i].valeur;};
    }
    else {
        if(piecesPortee[0].length>=piecesPortee[1].length) for(let i=0; i<valeurPieces.length; i++){if(valeurPieces[i].name == piece.nom) valeur -= valeurPieces[i].valeur;};
    }
    if(piecesPortee[0].length !=0 || piecesPortee[1].length !=0){ console.log('Menace : '+String(valeur)) }
    return valeur
}
