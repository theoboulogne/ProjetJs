module.exports = {
    ia(plateau, couleur){
        let tmpPlateau = plateau.clone(); // on clone le plateau en amount par sécurité
        let debut = new Date().getTime(); // On enregistre l'heure 


        let coup = evaluation_joueur(tmpPlateau, couleur, plateau.ia) 
        // on sélectionne les 3 meilleurs coups uniquement pour éviter un trop grand nombre d'appels 
        //(faire varier pour augmenter la puissance de l'ia au détriment de la vitesse

     
        while (debut + 3000 > new Date().getTime()); // pause pour éviter de renvoyer un coup trop rapidement
                                                    // et donc d'avoir des movements qui se lancent en meme temps

        let deplacement = { // On génère le déplacement comme un joueur normal
            piece: JSON.parse(JSON.stringify(coup.piece)),// par copie pour éviter les problèmes de portée de variable
            x: coup.Coo.x,
            y: coup.Coo.y
        };
        if(deplacement.piece.nom == "Pion" && (deplacement.y == 0 || deplacement.y == 7)) deplacement.piece.choix = "Reine" 
        // en cas de promotion on choisi toujours la reine pour l'ia
        return deplacement;
    },
    testcoup(plateau, piece, x, y){//fonction de test de l'évaluation sur les coups du joueur pour débug l'IA
        return evaluation_coup(plateau, piece, x, y);
    }
}

function evaluation_joueur(plateau, couleur, nb){ // nb = nombre de récursion
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
            meilleurs.push({ // On fait une copie car tmpEvaluation est suppr a chaque itération
                Coo: tmpEvaluation[i].Coo,
                piece: tmpEvaluation[i].piece,
                valeur: tmpEvaluation[i].valeur
                });
        }
    }
    meilleurs.sort((a, b) => b.valeur - a.valeur); // on trie en fonction de la valeur du coup

    if(nb == 1 || meilleurs.length==0) {
        if(meilleurs.length>0) return meilleurs[0]
        else return {valeur:-50} // -50 pour pénaliser le manque de coup (mat/pat)
    }
    let idx = 0; // si les premiers couts sont égaux en valeur on les test tous et pas juste les 5 premiers
    while(meilleurs[idx].valeur==meilleurs[0].valeur && idx+1<meilleurs.length) idx++;

    let coups = []
    for(let i=0; (i<5&&i<meilleurs.length)||i<idx; i++){ // on teste les 5 meilleurs coups ou plus si égaux
        let tmpPlateau = plateau.clone();
        let tmpPiece = meilleurs[i].piece.clone();
        tmpPiece.playable(tmpPlateau);
        tmpPiece.move(meilleurs[i].Coo.x, meilleurs[i].Coo.y, tmpPlateau);
        coups.push({
            Coo:JSON.parse(JSON.stringify(meilleurs[i].Coo)),
            piece:meilleurs[i].piece.clone(),
            valeur:meilleurs[i].valeur}) // on garde les coo et la piece a déplacer par rapport à ce coup en mémoire
        coups[coups.length-1].valeur -= (evaluation_joueur(tmpPlateau, (couleur+1)%2, nb-1).valeur); 
        // on retire la valeur du meilleur coup de l'ennemi pour calculer la valeur du coup initial 
        //(et ainsi permettre d'évaluer si un coup est profitable à l'adversaire)
    }
    coups.sort((a, b) => b.valeur - a.valeur);//On trie à nouveau en fonction de la valeur d'un coup

    if(coups.length>0 && coups[0].Coo!=undefined)return { // double sécurité pour éviter le crash
        Coo:JSON.parse(JSON.stringify(coups[0].Coo)),
        piece:coups[0].piece.clone(),
        valeur:JSON.parse(JSON.stringify(coups[0].valeur))
    }; // et on renvoi le meilleur coup
    else if(meilleurs.length>0 && meilleurs[0].Coo!=undefined) return meilleurs[0]; // sécurité si le tableau coups plante
    else return getCoupSecurite(plateau, couleur); // dernière sécurité si tout l'algo plante
}

function getCoupSecurite(plateau, couleur){ // Fonction de sécurité
    let pieces = []
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(plateau.board[i][j].piece != 0){
                if(plateau.board[i][j].piece.couleur = couleur) pieces.push(plateau.board[i][j].piece)
            }
        }
    }
    let tmpPlateau = plateau.clone();
    for(let k=0; k<pieces.length; k++){
        pieces[k].playable(tmpPlateau);
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                if(plateau.board[i][j].playable){
                    return {Coo:JSON.parse(JSON.stringify({x:i, y:j})), piece:pieces[k].clone()};
                }
            }
        }
    }
    return {valeur:-50} // pas de coup jouable on envoi -50 car mat
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

    let piece_prise = 0;
    if(plateau.board[x][y].piece!=0) piece_prise = plateau.board[x][y].piece.clone()

    tmpPiece.x = x
    tmpPiece.y = y
    tmpPlateau.board[x][y].piece = tmpPiece;
    tmpPlateau.board[piece.x][piece.y].piece = 0;
    // tmpPiece.move(x, y, tmpPlateau) // on effectue le déplacement -> ne marche pas ?? 
                                       // on ne prend donc pas en compte la prise en passant dans l'ia

    let aTraiter = [] 
    for(let i=0; i<8; i++){//on enregistre toutes les pièces du joueur dans un tableau
        for(let j=0; j<8; j++){
            if(tmpPlateau.board[i][j].piece != 0) if(tmpPlateau.board[i][j].piece.couleur == piece.couleur) aTraiter.push(tmpPlateau.board[i][j].piece);
        }
    }

    //On vient faire la somme de la valeur 'Menace' de toutes les pièces pour 
    //voir si notre déplacement influe sur la valeur d'une autre pièce également
    let valeur = 0;
    for(let i=0; i<aTraiter.length; i++) {
        valeur += AutresPieces.Menace(aTraiter[i], tmpPlateau);
    }

    //on renvoi la valeur de ce déplacement après avoir calculé l'influence du déplacement sur cette pièce spécifiquement
    return valeur + valeur_ia(tmpPiece, tmpPlateau, piece_prise);
}

function valeur_ia(piece, plateau, piecePrise){ //on vient calculer la valeur d'un déplacement
    let valeur = 0

    //On calcule en fonction de la pièce
    valeur += ValeursPiece.Pion(piece, plateau.board)
    valeur += ValeursPiece.Cavalier(piece, plateau)
    valeur += ValeursPiece.Fou(piece)
    valeur += ValeursPiece.Reine(piece)
    valeur += ValeursPiece.Tour(piece)
    valeur += ValeursPiece.Roi(piece)
    //On évalue la prise d'une autre pièce si il y a
    valeur += AutresPieces.Prise(piecePrise)

    //non utilisé ici car on doit tester toute les pièces, on l'execute donc en amount
    //valeur += AutresPieces.Menace(piece, plateau) 

    //Il faudrais rajouter des fonctions d'évaluation afin d'améliorer l'IA ainsi que potentiellement rajouter
    //plus de profondeur à l'évaluation (plus grand nombre de coup par joueur et plus grand nombre de tour par coup)
    //mais pour augmenter la profondeur il faudrait d'abord affiner l'algorithme de recherche pour éviter d'aller trop loin
    //tout en rajoutant des sécurités pour éviter la répétition de coup ou le sacrifice de pièce ou encore la possibilité de mat

    return valeur;
}



let ValeursPiece = (function(){
    //Fonctions du pion
    let avancement = piece =>{
        if(piece.y == ((piece.couleur+1)%2)*7) return 4 // promotion donc on renvoi une valeur importante
        else return 0.05*(Math.abs(piece.y-(1+(piece.couleur*5)))); // sinon on augmente la valeur au fur et a mesure de l'avancement
    }
    let direction_libre = (piece, board)=>{
        for(let i=0; i<8; i++){
            if(i!=piece.y){
                if(board[piece.x][i].piece!=0){
                    if(piece.couleur==board[piece.x][i].piece.couleur&&piece.nom==board[piece.x][i].piece.nom){
                        return -0.5; // doublage de pion
                    }
                }
            }
        }
        return 0; //sinon 0
    }
    //Fonction du fou/reine
    let valeursDiagonales = piece => {
        let valeur = 0;
        if(piece.x == 0 || piece.x == 7) valeur -= 1; // si sur les bord on retire de la valeur car moins d'echapatoires
        if(piece.y == 0 || piece.y == 7) valeur -= 1;
        if(piece.x > 1 && piece.x < 6) valeur += 0.5; // si au centre on augmente des points car + de possibilités
        if(piece.y > 1 && piece.y < 6) valeur += 0.5;
        return valeur;
    }
    //Conditions communes
    let checkPremiereLigne = piece => piece.y == piece.couleur*7;
    let checkDeuxièmeLigne = piece => piece.y == (piece.couleur * 5) + 1;

    return{
        Pion:(piece, board)=>{
            if(piece.nom=='Pion'){
                let valeur = 0;
                if(checkDeuxièmeLigne(piece)) valeur +=3 // on donne une bonne valeur à la position de départ pour favoriser le déplacement des autres pièces
                if((piece.x == 0 || piece.x == 7)){return valeur-10} // on baisse la valeur des pions sur les extrémités pour baisser la probabilité de leur utilisation
                if(piece.x > 2 && piece.x <5){
                    if(piece.y == (piece.couleur + 3)){
                        let check = true;
                        for(let j=-1; j<2; j+=2){
                            if(board[piece.x+j][piece.y+Math.pow(-1, piece.couleur)].piece != 0){
                                if(board[piece.x+j][piece.y+Math.pow(-1, piece.couleur)].piece != piece.couleur){
                                    check = false;
                                }
                            }
                        }
                        if(check) valeur+=5 // on favorise le déplacement des pions du milieu pour améliorer la défense
                        else return valeur-10;
                    } 
                }
                if(piece.y == (piece.couleur * 3) + 2) for(let i=0; i<4; i+=3) if(piece.x==2+i) valeur+=4.5 // on favorise le déplacement des pion d'une case sur les cotés du milieu pour améliorer la défense des pions centraux
                
                if(!(piece.x == 0 || piece.x == 7)) valeur+= avancement(piece); // pas sur les coté pour pénaliser le fait de les jouer (moins de cases a prendre)
                valeur+= direction_libre(piece, board);
                return valeur;
            }
            return 0;
        },
        Cavalier:(piece, plateau)=>{
            if(piece.nom=='Cavalier'){
                let tmpPlateau = plateau.clone(); // copie pour éviter d'influencer le reste des évaluations
                piece.playable(tmpPlateau);
                let compteur = 0;
                for(let i=0; i<8; i++){//on enregistre toutes les pièces du joueur dans un tableau
                    for(let j=0; j<8; j++){
                        if(tmpPlateau.board[i][j].playable) compteur++;
                    }
                }
                let valeur = ((8-compteur)/4)
                // en fonction du nombre de cases jouables par rapport aux cases jouables max on renvoi une valeur
                //on divise par 4 car c'est peu représentatif sachant que si le cavalier protège une pièce alliée la case est définie comme non jouable.
                if(piece.x == 0 || piece.x == 7) valeur -=2
                if(piece.y == 0 || piece.y == 7) valeur--
                return valeur;
            }
            return 0;
        },
        Fou:(piece)=>{
            if(piece.nom=='Fou') return valeursDiagonales(piece);
            return 0;
        },
        Tour:(piece)=>{
            if(piece.nom=='Tour') if(piece.x == 0 || piece.x == 7) if(piece.y > 1 && piece.y < 6) return -1 
            return 0
            // on retire 1 si la pièce est en dehors des lignes de départ(y=(0,1,6,7)) pour éviter qu'elle soit en danger
        },
        Reine:(piece)=>{
            if(piece.nom=='Reine') return (0.5 * valeursDiagonales(piece));
            return 0;
            // Comme le fou car les déplacements sont similaire globalement
            //(réduit afin que ça dépende surtout de la valeur de la pièce)
        },
        Roi:(piece)=>{
            if(piece.nom=='Roi'){
                if(checkPremiereLigne(piece)){ // valeur pour la dernière ligne
                    for(let i=-2; i<5; i+=4) if(piece.x == 3 + i) return 2 // si la position du roque +3 pour le favoriser
                }
            }
            return 0;
        }
    }
})();


let AutresPieces = (function(){
    //Valeurs des pièces
    let valeurPieces = [
        {name: 'Reine', valeur: 9},
        {name: 'Tour', valeur: 5},
        {name: 'Fou', valeur: 3},
        {name: 'Cavalier', valeur: 3},
        {name: 'Roi', valeur: 100}, // roi sur 100 pour que l'ia le protège au maximum (peut créer des incohérences par moment)
        {name: 'Pion', valeur: 1}
    ]
    let getValeur = NomPiece => {for(let i=0; i<valeurPieces.length; i++) if(valeurPieces[i].name == NomPiece) return valeurPieces[i].valeur}
    //Fonctions de test de prise
    let verifierboucle = (pieceName,sens, plateau, piece, piecesPortee) => { // fonction d'echec de noah réadaptée
        for(let i = 0; i < sens.length; i++){
            let x = piece.x + sens[i][0];
            let y = piece.y + sens[i][1];
            let boucle = true;
    
            if (plateau.isInBoard(x,y)) while(boucle){
                if(plateau.check_piece(x,y)){
                    for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.nom == pieceName[j]){
                        if(plateau.board[x][y].piece.couleur == piece.couleur) piecesPortee[0].push({piece:plateau.board[x][y].piece, valeur:getValeur(plateau.board[x][y].piece.nom)});
                        else piecesPortee[1].push({piece:plateau.board[x][y].piece, valeur:getValeur(plateau.board[x][y].piece.nom)});
                    }
                    boucle = false;
                }
                x += sens[i][0]
                y += sens[i][1]
                if(!plateau.isInBoard(x,y)) boucle = false;
            }
        }
        return piecesPortee;
    }
    
    let verifiercote = (pieceName,sens, plateau, piece, piecesPortee) => { // fonction d'echec de noah réadaptée
        for(let i = 0; i < sens.length; i++){
            let x = piece.x + sens[i][0];
            let y = piece.y + sens[i][1];
    
            if(plateau.check_piece(x,y)){
                for (let j = 0; j < pieceName.length; j++) if (plateau.board[x][y].piece.nom == pieceName[j]){
                    if(plateau.board[x][y].piece.couleur == piece.couleur) piecesPortee[0].push({piece:plateau.board[x][y].piece, valeur:getValeur(plateau.board[x][y].piece.nom)});
                    else piecesPortee[1].push({piece:plateau.board[x][y].piece, valeur:getValeur(plateau.board[x][y].piece.nom)});
                }
            }
        }
        return piecesPortee;
    }
    return{
        Prise:piecePrise=>{ 
            if(0!=piecePrise){
                //prise de la piece
                return (getValeur(piecePrise.nom))*3//*3 pour favoriser la prise de pièce à la protection
            }
            return 0
        },
        Menace:(piece, plateau)=>{
            let piecesPortee = [[],[]] // indice 0 allié / indice 1 ennemi

            piecesPortee = verifierboucle(["Reine","Fou"],[[1,1],[1,-1],[-1,1],[-1,-1]], plateau, piece, piecesPortee)
            piecesPortee = verifierboucle(["Reine","Tour"],[[1,0],[-1,0],[0,1],[0,-1]], plateau, piece, piecesPortee)
            piecesPortee = verifiercote("Pion",[[-1,(-2*piece.couleur) + 1],[1,(-2*piece.couleur) + 1]], plateau, piece, piecesPortee)
            piecesPortee = verifiercote("Cavalier",[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]], plateau, piece, piecesPortee)
            // piecesPortee = verifiercote("Roi", [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]], plateau, piece, piecesPortee)
            // pas le roi car sa valeur est trop importante, ça fausserait tout l'algo

            //Si on a une pièce menaçante
            if(piecesPortee[1].length){

                for(let i=0; i<2; i++) piecesPortee[i].sort((a, b) => a.valeur - b.valeur)

                let OrdrePrise = [{piece:piece, valeur:getValeur(piece.nom)}]
                for(let i=0; i<(piecesPortee[0].length + piecesPortee[1].length); i++){
                    if((Math.trunc(i/2))<(piecesPortee[(i+1)%2].length)) { // On push uniquement si la case existe
                        if(OrdrePrise[OrdrePrise.length-1].piece.couleur != (piecesPortee[(i+1)%2][Math.trunc(i/2)]).piece.couleur){ // On vient vérifier que la couleur de la pièce précédente
                                                                                    // est différente pour s'arreter au bon moment
                            OrdrePrise.push(piecesPortee[(i+1)%2][Math.trunc(i/2)])
                        }
                        else {
                            OrdrePrise.push(piecesPortee[(i+1)%2][Math.trunc(i/2)])
                            i = (piecesPortee[0].length + piecesPortee[1].length)
                        }
                    }
                }

                //Evaluation de la valeur approximative sinon l'algo prend beaucoup plus de temps
                
                let valPieces = [getValeur(piece.nom),0] // 0 couleur aliée / 1 couleur ennemi
                for(let i=1; i<OrdrePrise.length-1; i++){
                    valPieces[i%2]+=OrdrePrise[i].valeur; 
                }
                if(valPieces[1]>=valPieces[0]&&OrdrePrise[OrdrePrise.length-1].piece.couleur==piece.couleur){
                    return valPieces[1]-valPieces[0]; // gagnant
                }
                else {
                    return -valPieces[0];//perdant
                }
            }
            return  0
        }
    }
})();
