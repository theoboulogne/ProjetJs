class RenduThreeJs{
    constructor(){
        //Pour appel du raycast des variables
        let Rendu = this;
        //Initialisation de la scène
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight);
        //Ajout du rendu
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        
        // auto game resize
        window.addEventListener( 'resize', function() {
            let width = window.innerWidth;
            let height = window.innerHeight;
            renderer.setSize( width, height );
            Rendu.camera.aspect = width / height;
            Rendu.camera.updateProjectionMatrix();
        });

        //Chargement et stockage des modèles réutilisés
        let objLoader = new THREE.OBJLoader();
        // Cases jouables
        this.playableCases = [];
        this.vert = new THREE.MeshBasicMaterial( {color: 0x00ff00, opacity: 0.5, transparent: true} )
        this.rouge = new THREE.MeshBasicMaterial( {color: 0xff0000, opacity: 0.5, transparent: true} )
        this.playableCase = new THREE.Mesh( new THREE.BoxGeometry( 0.5, 0.5, 0.02 ), this.vert);
        // Pièces
        this.pieces = [];
        // Pièces mangés
        this.piecesOut = [[], []];
        this.deplacement = [];

        this.models = [ // définition des nom de modèles en dur
            {nom:"Pion", obj:undefined},
            {nom:"Fou", obj:undefined},
            {nom:"Cavalier", obj:undefined},
            {nom:"Tour", obj:undefined},
            {nom:"Reine", obj:undefined},
            {nom:"Roi", obj:undefined}
        ];
        for(let i=0; i<this.models.length; i++){
            objLoader.load("../models/" + this.models[i].nom + ".obj", function(object) {
                Rendu.models[i].obj = (object);
            });
        }

        //Board
        this.GenerateBoard();
        //Gestion du rendu (lumière+camera+renderFunction)
        this.GenerateLight();
        this.camera.position.x = 3.5;
        this.camera.rotation.y = ( 40* (Math.PI / 180));
        this.camera.rotation.z = ( 90* (Math.PI / 180));
        this.camera.position.z = 4;
        this.camera.position.y = 0.5;

        function render() {
            requestAnimationFrame( render );
            TWEEN.update();
            renderer.render( Rendu.scene, Rendu.camera );
        }
        render();
        
        //Gestion de la détection des clicks (Events)
        this.raycaster = new THREE.Raycaster();
    }

    //Module a faire avec fonction interne + tile
    Tween(piece, targets, delai) {
        console.log('Piece Tween')
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

    /*animateSelectedPiece(piece, X, Y) {
        let tweenUp = this.Tween(piece, [{Axis:'y', Offset:40}], 1000)
        let tweenMove = this.Tween(piece, [{Axis:'x', Offset:20*X}, 
                                            {Axis:'z', Offset:20*Y}], 3000) // calcul delai en fonction distance ?
        let tweenDown = this.Tween(piece, [{Axis:'y', Offset:0}], 1000)
        tweenUp.chain(tweenMove);
        tweenMove.chain(tweenDown);
        tweenUp.start();
    }*/

    //entrée : tableau taille 2 avec deplacement dedans
        //deplacement : piece(x, y, couleur, nom), x, y


    movePiece(deplacement) {
        let pieceIdx = this.getPiece(deplacement.piece)
        if(pieceIdx>-1){
            this.animatePiece(this.pieces[pieceIdx], deplacement.y-deplacement.piece.y, deplacement.x-deplacement.piece.x);
        }// Gérer la gestion d'erreur !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
    moveOut(piece) {
        let pieceIdx = this.getPiece(piece)
        console.log("moveoutdebut");
        console.log(piece);
        console.log(pieceIdx);

        if(pieceIdx>-1){
            let tweenUp = this.Tween(this.pieces[pieceIdx], [{Axis:'z', Offset:3}], 1200); 
            tweenUp.start();            // on lève la pièce

            let Rendu = this;

            setTimeout(function(){
                Rendu.removePiece(piece);    // on supprime la piece mangé du plateau
                Rendu.LoadPieceOut(piece);   // on la recharge dans la scene
                let tweenDown = Rendu.Tween(Rendu.piecesOut[piece.couleur][Rendu.piecesOut[piece.couleur].length-1], [{Axis:'z', Offset:-3}],1200);
                tweenDown.start();           // on la fait redescendre sur le coté du plateau*/
            }, 1200);
        }
    }
    moveRoque(deplacement) {
        // ROI
        this.movePiece(deplacement[0].x, deplacement[0].y);
        // TOUR
        let tweenMove = this.Tween(piece, [{Axis:'x', Offset:0.5*this.deplacement[1].x}], 300*Math.max(Math.abs(X),Math.abs(Y))) // calcul delai en fonction distance ?
        tweenMove.start();           // on la fait redescendre sur le coté du plateau*/
    }
    removeObjects(array) {
        for (let i = 0; i < array.length; i++) this.removeObject(array[i])
        array.length = 0;
    }
    removePiece(Coo){
        let idx = this.getPiece(Coo);
        if(idx!=-1){
            this.removeObject(this.pieces[idx]);
            this.pieces.splice(idx, 1);
        }
    }
    removeObject(piece) {
        this.scene.remove(piece);
    }

    setPlayable(X, Y, playableType) {
        let tmpPlayableCase = this.playableCase.clone();
        if (playableType) { tmpPlayableCase.material = this.vert/*.color.setHex(0x00ff00);*/ }
        else { tmpPlayableCase.material = this.rouge/*.color.setHex(0xff0000);*/ }
        tmpPlayableCase.position.set( (Y-4)/2 + 0.25, (X-4)/2 + 0.25, 0 );
        this.playableCases.push(tmpPlayableCase) // on enregistre pour pouvoir les retirer
        this.scene.add( tmpPlayableCase );
    };
    //Suppr playables a deplacer

    setPlayables(board, couleur) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j].playable) {
                    this.setPlayable(i,j,(board[i][j].piece == 0));
                }
            }
        }
    };

    //Module avec arrowFunction a faire
    getPiece(Coo){
        for(let i=0, Cootmp; i<this.pieces.length; i++){ // on parcours toutes les pièces pour trouver la bonne à défault d'une meilleure méthode
            Cootmp = this.getCooObject(this.pieces[i]);
            if(Cootmp.x==Coo.x && Cootmp.y==Coo.y) return i;
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

    getClickModels(event, TabModels) {
        let mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.raycaster.setFromCamera(mouse, this.camera);
        return this.raycaster.intersectObjects(TabModels, true); //array avec objets
    }

    GenerateBoard(){
        let boardTexture = new THREE.ImageUtils.loadTexture("../../textures/board-pattern.png");
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


    loadBoardPieces(board){
        
        this.LoadPieces(this.getBoardPieces(board))
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

    LoadPieces(Pieces){
        for(let i=0; i<this.models.length; i++){
            for(let couleur=0; couleur<2; couleur++){
                let obj = (this.models[i].obj).clone()
                obj.traverse( function ( child ) {
                    if (child instanceof THREE.Mesh) {
                        // on définit la couleur
                        if(couleur) child.material = new THREE.MeshLambertMaterial({color: 0x555555});
                        else child.material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
                    }
                });
 
                for(let j=0; j<Pieces.length; j++){
                    if(Pieces[j].nom == this.models[i].nom && Pieces[j].couleur == couleur) {
                        let tmpobj = (obj).clone();
 
                        // la position / taille / orientation
                        tmpobj.position.set(-1.75 + (0.5 * Pieces[j].y),-1.75 + (0.5 * Pieces[j].x),0);
                        tmpobj.scale.set(.025, .025, .025);
                        tmpobj.rotation.x = 1.57;
 
                        //On enregistre pour la détection de click
                        this.pieces.push(tmpobj);
                        //Puis on l'affiche
                        this.scene.add(tmpobj);
                    }
 
                }
            }
        }
    }

    LoadPieceOut(piece){
        let idx = -1;
        for(let i=0; i<this.models.length; i++) if(this.models[i].nom == piece.nom) idx = i;

        let obj = (this.models[idx].obj).clone()
        obj.traverse( function ( child ) {
            if (child instanceof THREE.Mesh) {
                // on définit la couleur
                if(piece.couleur) child.material = new THREE.MeshLambertMaterial({color: 0x555555});
                else child.material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
            }
        });

        // add tableau
        this.piecesOut[piece.couleur].push(obj);
        if (piece.couleur) obj.position.set( 5-this.piecesOut.indexOf(obj), -2.3, 3);   // z hors champs de caméra
        else obj.position.set( 3+this.piecesOut.indexOf(obj), 2.3, 3);                  // z hors champs de caméra

        // taille / orientation
        obj.scale.set(.015, .015, .015);
        obj.rotation.x = 1.57;

        // on l'affiche
        this.scene.add(obj);
    }

    LoadPiecesOut(piecesOut) {
        for(let i=0; i<this.piecesOut.length; i++){
            let obj = (this.piecesOut[i].obj).clone()
            obj.traverse( function ( child ) {
                if (child instanceof THREE.Mesh) {
                    // on définit la couleur
                    if(couleur) child.material = new THREE.MeshLambertMaterial({color: 0x555555});
                    else child.material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
                }
            });

            for(let j=0; j<piecesOut.length; j++){
        
                if (piece.couleur) obj.position.set(5-this.piecesOut.indexOf(obj), -2.3, 3);   // z hors champs de caméra
                else obj.position.set( 3+this.piecesOut.indexOf(obj), 2.3, 3);                 // z hors champs de caméra

                // taille / orientation
                obj.scale.set(.015, .015, .015);
                obj.rotation.x = 1.57;

                // on l'affiche
                this.scene.add(obj);
            }
        }
    }

    reloadAll() {
        this.removePieces();
        this.removePlayables();
        this.LoadPieces(pieces);
        this.LoadPiecesOut(this.piecesOut);
    }
}


