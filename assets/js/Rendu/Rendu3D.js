class RenduThreeJs{
    constructor(couleur){
        //Pour appel du raycast des variables
        let Rendu = this;
        //Initialisation de la scène
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight);
        this.PositionCamera(couleur); // On positionne la caméra en fonction de la couleur
        //Ajout du rendu
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.domElement.id = 'RenduThreeJs';
        document.body.appendChild( renderer.domElement );
        // Redimensionnement du jeu auto
        window.addEventListener( 'resize', function() {
            let width = window.innerWidth;
            let height = window.innerHeight;
            renderer.setSize( width, height );
            Rendu.camera.aspect = width / height;
            Rendu.camera.updateProjectionMatrix();
        });

        //Gestion des objets
        let objLoader = new THREE.OBJLoader(); // Chargement des modèles
        this.raycaster = new THREE.Raycaster(); //Gestion de la détection des clicks (Events)
        
        // Cases jouables
        this.materialCases = [
            new THREE.MeshBasicMaterial( {color: 0x000000, opacity: 0, transparent: true} ),   // transparent
            new THREE.MeshBasicMaterial( {color: 0x4ca3dd, opacity: 0.8, transparent: true} ), // select (bleu)
            new THREE.MeshBasicMaterial( {color: 0x00ff00, opacity: 0.5, transparent: true} ), // vert
            new THREE.MeshBasicMaterial( {color: 0xff0000, opacity: 0.5, transparent: true} )  // rouge
        ]
        this.playableCases = [];
        this.playableCase = new THREE.Mesh( new THREE.BoxGeometry( 0.5, 0.5, 0.02 ), this.materialCases[0]);
        
        // Pièces
        this.models = [ // définition des nom de modèles en dur
            {nom:"Pion", obj:undefined},
            {nom:"Fou", obj:undefined},
            {nom:"Cavalier", obj:undefined},
            {nom:"Tour", obj:undefined},
            {nom:"Reine", obj:undefined},
            {nom:"Roi", obj:undefined}
        ];
        //Récupération du type de modèles utilisé :
        let ModelType = getParams(window.location.href).affichage;
        if(ModelType == "" || ModelType == undefined) ModelType = "Classic"; // on redéfinit par sécurité si l'argument est manquant
        console.log("Affichage : " + ModelType)
        //On charge les infos sur les modèles utilisés dynamiquement
        let script = document.createElement('script');
        script.id = "infos"
        script.src = "../../models/"+ModelType+"/info.js"
        script.onload = function () {
            if(info.couleur){ // si on a un modèle différent pour les blancs et les noirs
                for(let i=0; i<6; i++){// on vient doubler le nombre de modèle à charger et on change les noms
                    Rendu.models.push({nom:Rendu.models[i].nom+"Noir", obj:undefined}) 
                    Rendu.models[i].nom += "Blanc"
                }
            }
            for(let i=0; i<Rendu.models.length; i++){
                objLoader.load("../models/"+ info.chemin + "/" + Rendu.models[i].nom + ".obj", function(object) {
                    Rendu.models[i].obj = (object);
                });
            }
        };
        document.head.appendChild(script)
        //Stockages des pièces de la scène
        this.piecesId = [];
        this.piecesObj = [];
        // Pièces mangées (blanc, noir)
        this.piecesOut = [[], []];

        //Board
        this.GenerateBoard();
        //Gestion des lumières
        this.GenerateLight();
        //Gestion des animations
        function render() {
            requestAnimationFrame( render );
            TWEEN.update();
            renderer.render( Rendu.scene, Rendu.camera );
        }
        render();
    }

    //Méthode commune d'utilisation de Tween pour déplacer une pièce
    Tween(piece, targets, delai) {
        let position = piece.position;
        let target = new Object;
        for(let i=0; i<targets.length; i++) target[targets[i].Axis] = position[targets[i].Axis] + targets[i].Offset;
        let tween = new TWEEN.Tween(piece.position).to(target, delai);

        tween.onUpdate(function() { // fonction d'update (lié à la cible)
            for(let i=0; i<targets.length; i++) piece.position[targets[i].Axis] = position[targets[i].Axis];
        });

        return tween;
    };
    animatePiece(piece, X, Y) {
        let tweenUp = this.Tween(piece, [{Axis:'z', Offset:1}], 800)
        let tweenMove = this.Tween(piece, [{Axis:'x', Offset:0.5*X}, 
                                           {Axis:'y', Offset:0.5*Y}], 300*Math.max(Math.abs(X),Math.abs(Y))) // calcul delai en fonction distance ?
        let tweenDown = this.Tween(piece, [{Axis:'z', Offset:0}], 800)
        tweenUp.chain(tweenMove);
        tweenMove.chain(tweenDown);
        tweenUp.start();
    }

    //Utilisée lors des tests pour déplacer une pièce au click directement
    /*animateSelectedPiece(piece, X, Y) {
        let tweenUp = this.Tween(piece, [{Axis:'y', Offset:40}], 1000)
        let tweenMove = this.Tween(piece, [{Axis:'x', Offset:20*X}, 
                                            {Axis:'z', Offset:20*Y}], 3000) // calcul delai en fonction distance ?
        let tweenDown = this.Tween(piece, [{Axis:'y', Offset:0}], 1000)
        tweenUp.chain(tweenMove);
        tweenMove.chain(tweenDown);
        tweenUp.start();
    }*/

    //Méthodes de déplacement de pièce
    movePieces(deplacements) {
        let Rendu = this;
        let loadCheck = setInterval(function() { // On attend que toutes nos pièces soient 
            if (Rendu.checkLoadModels()) {  // chargées avant de commencer à les déplacer afin 
                clearInterval(loadCheck);   // d'éviter les bugs liés à la synchronisation

                if(deplacements.length == 1) Rendu.movePiece(deplacements[0]); // si pas de roque
                else Rendu.moveRoque(deplacements);
            }
        }, 100);
    }
    movePiece(deplacement) {
        let pieceIdx = this.getPieceIdx(deplacement.piece)

        if(pieceIdx>-1){
            this.animatePiece(this.piecesObj[pieceIdx], deplacement.y-deplacement.piece.y, deplacement.x-deplacement.piece.x);
        }// Gérer la gestion d'erreur !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
    moveOut(piece) {
        let pieceIdx = this.getPieceIdx(piece)
        if(pieceIdx>-1){
            let tweenUp = this.Tween(this.piecesObj[pieceIdx], [{Axis:'z', Offset:3}], 1200); 
            tweenUp.start();            // on lève la pièce

            let Rendu = this;

            setTimeout(function(){
                Rendu.removePiece(pieceIdx);    // on supprime la piece mangé du plateau
                Rendu.LoadPieceOut(piece, 3);   // on la recharge dans la scene en hauteur pour faire croire qu'on l'a juste déplacée
                let tweenDown = Rendu.Tween(Rendu.piecesOut[piece.couleur][Rendu.piecesOut[piece.couleur].length-1], [{Axis:'z', Offset:-3}],1200);
                tweenDown.start();           // on la fait redescendre sur le coté du plateau*/
            }, 1200);
        }
    }
    moveRoque(deplacements) {
        let Rendu = this;
        // ROI
        Rendu.movePiece(deplacements[0]);
        // TOUR
        setTimeout(function(){
            Rendu.movePiece(deplacements[1]);
        }, 1400); // on prend le temps de déplacement du roi moins le temps de descente
    }

    //Méthodes de suppression de pièce
    removePiecesOut() {
        for(let i=0; i<2; i++){
            for(let j=0; j<this.piecesOut[i].length; j++){
                this.removeObject(this.piecesOut[i][j]);
            }
            this.piecesOut[i].length = 0;
        }
    }
    removePieces() {
        for(let i=0; i<this.piecesObj.length; i++){
            this.removePiece(0); // pas i mais 0 car on le retire du tableau au fur et a mesure
        }
    }
    removePiece(idx){//idx = emplacement de l'objet dans piecesId et piecesObj
        if(idx!=-1){
            this.removeObject(this.piecesObj[idx]);
            this.piecesObj.splice(idx, 1);
            this.piecesId.splice(idx, 1);
        }
    }
    removeObject(piece) {
        this.scene.remove(piece);
    }

    //Gestion des Cases
    removePlayable() {
        for (let i = 0; i < this.playableCases.length; i++) this.playableCases[i].material = this.materialCases[0]
    }
    setPlayables(board, CooSelect) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j].playable) {
                    this.setPlayable(i,j,(board[i][j].piece == 0));
                }
            }
        }
        if(board[CooSelect.x][CooSelect.y].piece.nom == "Pion"){//On gère la prise en passant
            for(let i=-1; i<2; i+=2) {
                if(CooSelect.x+i>-1&&CooSelect.x+i<8&&CooSelect.y+(Math.pow(-1,board[CooSelect.x][CooSelect.y].piece.couleur))>-1&&CooSelect.y+(Math.pow(-1,board[CooSelect.x][CooSelect.y].piece.couleur))<8){
                    if(board[CooSelect.x+i][CooSelect.y+(Math.pow(-1,board[CooSelect.x][CooSelect.y].piece.couleur))].piece == 0 && board[CooSelect.x+i][CooSelect.y+(Math.pow(-1,board[CooSelect.x][CooSelect.y].piece.couleur))].playable){
                        this.setPlayable(CooSelect.x+i,CooSelect.y+(Math.pow(-1,board[CooSelect.x][CooSelect.y].piece.couleur)), false);
                    }
                }
            }
        }
        this.setSelect(CooSelect.x, CooSelect.y);
    };
    setPlayable(X, Y, playableType) {
        let materiel;
        if (playableType) { materiel = this.materialCases[2]/*.color.setHex(0x00ff00);*/ }
        else { materiel = this.materialCases[3]/*.color.setHex(0xff0000);*/ }
        this.setCase(X, Y, materiel)
    };
    setSelect(X, Y) {
        this.setCase(X, Y, this.materialCases[1]);
    };
    setTransparent(X, Y){
        this.setCase(X, Y, this.materialCases[0]);
    }
    setCase(X, Y, materiel){
        let CooCheck = (this.getCooObject(this.playableCases[(8*X) + Y]))
        if(CooCheck.x != X || CooCheck.y != Y) this.ResetCases()//reset playables

        this.playableCases[(8*X)+Y].material = materiel;
    }
    createCase(X, Y){
        let tmpPlayableCase = this.playableCase.clone();

        tmpPlayableCase.material = this.materialCases[0]
        tmpPlayableCase.position.set( (Y-4)/2 + 0.25, (X-4)/2 + 0.25, 0 );

        this.playableCases.push(tmpPlayableCase) // on enregistre pour pouvoir les retirer
        this.scene.add( tmpPlayableCase );
    }

    //Méthodes de sélection d'objets
    getPieceIdx(piece){
        for(let i=0; i<this.piecesId.length; i++){ // on parcours toutes les pièces pour trouver la bonne à défault d'une meilleure méthode
            if(this.piecesId[i] == piece.id){
                return i;
            }
        }
        return -1;
    }
    getCooObject(Objet){
        return this.getCoo(Objet.position);
    }
    getCooSelected(selectedObject){
        return this.getCoo(selectedObject.point);
    }
    getCoo(position){
        let Coo = new THREE.Vector2();
        Coo.x = Math.trunc(2*(position.y + 2)); // Calcul coo
        Coo.y = Math.trunc(2*(position.x + 2));
        return Coo;
    }
    //Méthode du RayCast
    getClickModels(event, TabModels) {
        let mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.raycaster.setFromCamera(mouse, this.camera);
        return this.raycaster.intersectObjects(TabModels, true); //array avec objets
    }

    //Génération du terrain de jeu (Board+Light+Camera)
    GenerateBoard(){
        let boardTexture = new THREE.ImageUtils.loadTexture("../../img/board-pattern.png");
        boardTexture.repeat.set(4,4);
        boardTexture.wrapS = THREE.RepeatWrapping;
        boardTexture.wrapT = THREE.RepeatWrapping;
        let board = new THREE.Mesh(
            new THREE.BoxGeometry( 4, 4, 0.01),
            new THREE.MeshFaceMaterial([
                new THREE.MeshLambertMaterial({color: 0x555555}),
                new THREE.MeshLambertMaterial({color: 0x555555}),
                new THREE.MeshLambertMaterial({color: 0x555555}),
                new THREE.MeshLambertMaterial({color: 0x555555}),
                new THREE.MeshLambertMaterial({ map: boardTexture }),
                new THREE.MeshLambertMaterial({color: 0x555555})
            ])
        );
        this.scene.add( board );
    }
    GenerateLight(){
        let light = new THREE.AmbientLight( 0x555555 ); // soft white light
        this.scene.add( light );
 
        let spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 50, 100, 50 );
        spotLight.castShadow = true;
        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;
        spotLight.shadowCameraNear = 500;
        spotLight.shadowCameraFar = 4000;
        spotLight.shadowCameraFov = 30;
        this.scene.add( spotLight );
    }
    PositionCamera(couleur){
        if(couleur){
            this.camera.position.x = 3.5;
            this.camera.position.z = 3;
            this.camera.rotation.y = ( 50* (Math.PI / 180));
            this.camera.rotation.z = ( 90* (Math.PI / 180));
        }
        else{
            this.camera.position.x = -3.5;
            this.camera.position.z = 3;
            this.camera.rotation.y = ( 310* (Math.PI / 180));
            this.camera.rotation.z = ( 270* (Math.PI / 180));
        }
    }

    /*PositionCamera(couleur){
        if(couleur){
            this.camera.position.x = 2;
            this.camera.position.z = 5;
            this.camera.rotation.y = ( 20* (Math.PI / 180));
            this.camera.rotation.z = ( 90* (Math.PI / 180));
        }
        else{
            this.camera.position.x = -2;
            this.camera.position.z = 5;
            this.camera.rotation.y = ( 350* (Math.PI / 180));
            this.camera.rotation.z = ( 270* (Math.PI / 180));
        }
    }*/

    //Méthodes de gestion d'erreurs des cases
    ResetCases(){ // Suppression + Regénération des cases pour garder l'ordre des indices
        for (let i = 0; i < this.playableCases.length; i++) this.removeObject(this.playableCases[i])
        this.playableCases.length = 0;
        this.GenerateCases();
    }
    GenerateCases(){
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                this.createCase(i,j);
            }
        }
        //On récupère donc les coo des case avec 8*x + y selon l'ordre de génération
    }

    //Méthodes de génération du board (coté modèle)
    loadBoardPieces(board){
        this.LoadPieces(this.getBoardPieces(board))
        this.GenerateCases();
    }
    getBoardPieces(board){
        let tmpPieces = [];
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                if(board[i][j].piece!=0){
                    tmpPieces.push(board[i][j].piece);
                }
            }
        }
        return tmpPieces
    }

    checkLoadModels(){ // fonction de vérification de l'état de chargement des modèles
        for(let i=0; i<this.models.length; i++) if(this.models[i].obj == undefined) return false;
        return true;
    }

    //Méthode de génération des pièces du board
    LoadPieces(Pieces){
        console.log(JSON.stringify(info)) // on récupère les infos en format JSON
        for(let i=0; i<6; i++){
            for(let couleur=0; couleur<2; couleur++){


                //On rajoute un décallage de 6 en fonction de la couleur si nécessaire
                let obj = (this.models[i + (info.couleur * couleur * 6)].obj).clone()
                obj.traverse( function ( child ) {
                    if (child instanceof THREE.Mesh) {
                        // on définit la couleur
                        if(couleur) child.material = new THREE.MeshLambertMaterial({color: 0x555555});
                        else child.material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
                    }
                });
                //On récupère le bon nom si nécessaire
                let NomPiece = this.models[i].nom;
                if(info.couleur) NomPiece = NomPiece.slice(0, NomPiece.length-5); 
                
                for(let j=0; j<Pieces.length; j++){
                    // si on gère les couleurs on retire le 'blanc' à la fin du nom de la pièce pour comparer au nom original

                    if(Pieces[j].nom == NomPiece && Pieces[j].couleur == couleur) {
                        let tmpobj = (obj).clone();
                        let OffSet = info.Offset[i + (couleur * 6)];
 
                        // la position / taille / orientation
                        tmpobj.position.set(-1.75 + (0.5 * Pieces[j].y) + OffSet.position.x,
                                            -1.75 + (0.5 * Pieces[j].x) + OffSet.position.y
                                            ,0);
                        tmpobj.scale.set(info.scale, info.scale, info.scale);
                        tmpobj.rotation.x = 1.57 + OffSet.rotation.x;
                        tmpobj.rotation.y = OffSet.rotation.y;
                        tmpobj.rotation.z = OffSet.rotation.z;
 
                        //On enregistre pour la détection de click
                        this.piecesId.push(Pieces[j].id)
                        this.piecesObj.push(tmpobj)
                        //Puis on l'affiche
                        this.scene.add(tmpobj);
                    }
 
                }
            }
        }
    }

    //Méthodes de génération des pièces supprimées
    LoadPiecesOut(plateau) {
        for(let i=0; i<2; i++){
            for(let j=0; j<plateau.Joueurs[i].pieces_prises.length; j++){
                this.LoadPieceOut(plateau.Joueurs[i].pieces_prises[j].piece, 0)
            }
        }
    }
    LoadPieceOut(piece, hauteur){
        let idx = -1;
        for(let i=0; i<this.models.length; i++) {
            let NomPiece = this.models[i].nom;
            if(info.couleur) NomPiece = NomPiece.slice(0, NomPiece.length-5); 
            if(NomPiece == piece.nom) idx = i;
        }

        let obj = (this.models[idx + (info.couleur * piece.couleur * 6)].obj).clone()
        obj.traverse( function ( child ) {
            if (child instanceof THREE.Mesh) {
                // on définit la couleur
                if(piece.couleur) child.material = new THREE.MeshLambertMaterial({color: 0x555555});
                else child.material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
            }
        });

        let OffSet = info.Offset[idx + (piece.couleur * 6)];
        
        obj.position.set((Math.pow(-1, piece.couleur) * (-1.7 + (0.4 * (this.piecesOut[piece.couleur].length/2)))) + OffSet.position.x,
                        (Math.pow(-1, piece.couleur+1)*(2.6 + (0.4 * (this.piecesOut[piece.couleur].length%2)))) + OffSet.position.y,
                        hauteur);
        obj.scale.set(info.scale*0.6, info.scale*0.6, info.scale*0.6);
        
        // taille / orientation
        obj.rotation.x = 1.57 + OffSet.rotation.x;
        obj.rotation.y = OffSet.rotation.y;
        obj.rotation.z = OffSet.rotation.z;

        // add tableau
        this.piecesOut[piece.couleur].push(obj);
        // on l'affiche
        this.scene.add(obj);
    }

    //Méthode de reset entier du coté graphique
    reloadAll(plateau) {
        this.removePieces();
        this.removePiecesOut();
        this.ResetCases();
        this.LoadPieces(this.getBoardPieces(plateau.board))
        this.LoadPiecesOut(plateau); // A REFAIRE
    }	

    //Méthode de suppression du rendu
    remove(){
        document.body.removeChild(document.body.lastChild)//on supprime le rendu
        document.getElementById('infos').parentNode.removeChild(document.getElementById('infos'));//on supprime l'import des infos sur les modèles
    }
}