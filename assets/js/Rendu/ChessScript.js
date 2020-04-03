class RenduThreeJs{
    constructor(){
        //Pour appel du raycast des variables
        let Rendu = this;
        //Initialisation de la scène
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
        //Ajout du rendu
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        
        window.addEventListener( 'resize', function() {
            var width = window.innerWidth;
            var height = window.innerHeight;
            renderer.setSize( width, height );
            Rendu.camera.aspect = width / height;
            Rendu.camera.updateProjectionMatrix();
        });

        //Chargement et stockage des modèles réutilisés
        let objLoader = new THREE.OBJLoader();
            // Cases jouables
        this.playableCases = [];
        this.playableCase = new THREE.Mesh( new THREE.BoxGeometry( 0.5, 0.5, 0.07 ), 
                                            new THREE.MeshBasicMaterial( {color: 0x00ff00, opacity: 0.7, transparent: true} ) );
        //Pièces
        this.pieces = [];
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
        this.camera.position.x = 5
        this.camera.rotation.y = ( 60* (Math.PI / 180))
        this.camera.rotation.z = ( 90* (Math.PI / 180))
        this.camera.position.z = 3;

        function render() {
            requestAnimationFrame( render );
            TWEEN.update();
            renderer.render( Rendu.scene, Rendu.camera );
        }
        render();
        
        //Test de case playable, fonction qui prend un board a faire

        this.setPlayable(6,5,0);

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
        let tweenUp = this.Tween(piece, [{Axis:'z', Offset:1}], 1000)
        let tweenMove = this.Tween(piece, [{Axis:'x', Offset:0.5*X}, 
                                           {Axis:'y', Offset:0.5*Y}], 3000) // calcul delai en fonction distance ?
        let tweenDown = this.Tween(piece, [{Axis:'z', Offset:0}], 1000)
        tweenUp.chain(tweenMove);
        tweenMove.chain(tweenDown);
        tweenUp.start();
    }

    animateSelectedPiece(piece, X, Y) {
        let tweenUp = this.Tween(piece, [{Axis:'y', Offset:40}], 1000)
        let tweenMove = this.Tween(piece, [{Axis:'x', Offset:20*X}, 
                                            {Axis:'z', Offset:20*Y}], 3000) // calcul delai en fonction distance ?
        let tweenDown = this.Tween(piece, [{Axis:'y', Offset:0}], 1000)
        tweenUp.chain(tweenMove);
        tweenMove.chain(tweenDown);
        tweenUp.start();
    }

    movePiece(piece, newX, newY) {
        Rendu.animateSelectedPiece(selectedPiece.object, newX-piece.x, newY-piece.y);
    }

    getPiece(Coo){
        for(let i=0, Cootmp; i<this.pieces.length; i++){ // on parcours toutes les pièces pour trouver la bonne à défault d'une meilleure méthode
            Cootmp = this.getCooObject(this.pieces[i]);
            if(Cootmp.x==Coo.x && Cootmp.y==Coo.y) return i;
        }
        return -1;
    }

    removeObjects(array) {
        for (let i = 0; i < array.length; i++) this.removeObject(array[i])
        array.length = 0;
    }
    removePiece(Coo){
        let idx = getPiece(Coo);
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
        if (!playableType) { tmpPlayableCase.material.color.setHex(0x00ff00); }
        else { tmpPlayableCase.material.color.setHex(0xff0000); }
        tmpPlayableCase.position.set( (Y-4)/2 + 0.25, (X-4)/2 + 0.25, 0 );
        this.playableCases.push(tmpPlayableCase) // on enregistre pour pouvoir les retirer
        this.scene.add( tmpPlayableCase );
    };
    //Suppr playables a deplacer

    setPlayables(board, couleur) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j].playable) {
                    this.setPlayable(i,j,(board[i][j].piece.couleur != couleur));
                }
            }
        }
    };

    //Module avec arrowFunction a faire
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
        let tmpPieces = []
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                if(board[i][j].piece!=0){
                    tmpPieces.push(board[i][j].piece)
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
}

