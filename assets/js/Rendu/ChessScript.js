class RenduThreeJs{
    constructor(Pieces){
        //Pour appel du raycast des variables
        let Rendu = this;
        //Initialisation de la scène
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
        //Ajout du rendu
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
 

        //Chargement et stockage des modèles réutilisés
        let objLoader = new THREE.OBJLoader();
            // Cases jouables
        this.playableCases = [];
        this.playableCase = new THREE.Mesh( new THREE.BoxGeometry( 0.5, 0.5, 0.1 ), 
                                            new THREE.MeshBasicMaterial( {color: 0x00ff00} ) );
            //Pièces
        let models = [ // définition des nom de modèles en dur
            "Pion",
            "Fou",
            "Cavalier",
            "Tour",
            "Reine",
            "Roi",
        ];
        this.pieces = [];
        for(let couleur=0; couleur<2; couleur++){
            for(let i=0; i<models.length; i++){
                objLoader.load("../models/" + models[i] + ".obj", function(object) {
                    object.traverse( function ( child ) {
                        if (child instanceof THREE.Mesh) {
                            // on définit la couleur
                            if(couleur) child.material = new THREE.MeshLambertMaterial({color: 0x555555});
                            else child.material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
                        }
                    });

                    //Initialisation du plateau, prise d'un board en entrée à faire directement avec sous methode pour reset si nécessaire
                    let ATraiter = []
                    for(let j=0; j<Pieces.length; j++){
                        if(Pieces[j].name == models[i] && Pieces[j].couleur == couleur) ATraiter.push(Pieces[j]); // push les indices pour réduire les couts ?
                    }

                    for(let j=0; j<ATraiter.length; j++){
                        let tmpobj = object.clone();

                        // la position / taille / orientation
                        tmpobj.position.set(-1.75 + (0.5 * ATraiter[j].y),-1.75 + (0.5 * ATraiter[j].x),0); // -1.2 -> -0.7 -> -0.25 -> 0.2 -> 0.65 | -1.62 -> -1.15 -> -0.7 -> -0.24 -> 0.23
                        tmpobj.scale.set(.025, .025, .025);
                        tmpobj.rotation.x = 1.6;

                        //On enregistre pour la détection de click
                        Rendu.pieces.push(tmpobj);
                        //Puis on l'affiche
                        Rendu.scene.add(tmpobj);
                    }
                });
            }
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
        this.setPlayable(6,5);
        this.setPlayable(7,5);
        this.setPlayable(4,5);
        this.setPlayable(7,7);
        this.setPlayable(0,0);





        //Gestion de la détection des clicks (Events)
        renderer.domElement.addEventListener("click", onclick, false);
        this.raycaster = new THREE.Raycaster();

        function onclick(event) {
            //Rendu.animatePiece(Rendu.getPiece({x:1, y:1}), 2, 2 ) // test de déplacement d'une pièce par Coo

            let intersectPiece = Rendu.getClickModels(event, Rendu.pieces)
            let intersectCase = Rendu.getClickModels(event, Rendu.playableCases);

            if (intersectPiece.length > 0) {
                let selectedPiece = intersectPiece[0];
                
                let Coo = Rendu.getCooSelected(selectedPiece);
                console.log("X : " + (Coo.x).toString() + ", Y : " + (Coo.y).toString());
                
                Rendu.animateSelectedPiece(selectedPiece.object, 2, 2); // test deplacement
            }

            if (intersectCase.length > 0) {
                let selectedCase = intersectCase[0]

                let Coo = Rendu.getCooSelected(selectedCase);
                console.log("X : " + (Coo.x).toString() + ", Y : " + (Coo.y).toString());

                removeObject(Rendu.playableCases); //test removeplayables
            }
        }

        function removeObject(array) {
                for (let i = 0; i < array.length; i++) Rendu.scene.remove(array[i]);
                array.length = 0;
        }
 
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
        console.log('animateSelectedPiece')
        let tweenUp = this.Tween(piece, [{Axis:'z', Offset:1}], 1000)
        let tweenMove = this.Tween(piece, [{Axis:'x', Offset:0.5*X}, 
                                            {Axis:'y', Offset:0.5*Y}], 3000) // calcul delai en fonction distance ?
        let tweenDown = this.Tween(piece, [{Axis:'z', Offset:0}], 1000)
        tweenUp.chain(tweenMove);
        tweenMove.chain(tweenDown);
        tweenUp.start();
    }
    animateSelectedPiece(piece, X, Y) {
        console.log('animateSelectedPiece')
        let tweenUp = this.Tween(piece, [{Axis:'y', Offset:40}], 1000)
        let tweenMove = this.Tween(piece, [{Axis:'x', Offset:20*X}, 
                                            {Axis:'z', Offset:20*Y}], 3000) // calcul delai en fonction distance ?
        let tweenDown = this.Tween(piece, [{Axis:'y', Offset:0}], 1000)
        tweenUp.chain(tweenMove);
        tweenMove.chain(tweenDown);
        tweenUp.start();
    }



    getPiece(Coo){
        for(let i=0, Cootmp; i<this.pieces.length; i++){ // on parcours toutes les pièces pour trouver la bonne à défault d'une meilleure méthode
            Cootmp = this.getCooObject(this.pieces[i]);
            if(Cootmp.x==Coo.x && Cootmp.y==Coo.y) return this.pieces[i];
        }
    }//Gestion d'erreur à rajouter ?




    setPlayable(X, Y) {
        let tmpPlayableCase = this.playableCase.clone();
        tmpPlayableCase.position.set( (X-4)/2 + 0.25, (Y-4)/2 + 0.25, 0 );
        this.playableCases.push(tmpPlayableCase) // on enregistre pour pouvoir les retirer
        this.scene.add( tmpPlayableCase );
    };
    //Suppr playables a deplacer




    //Module avec arrowFunction a faire
    getCooObject(Objet){
        return this.getCoo(Objet.position);
    }
    getCooSelected(selectedObject){
        return this.getCoo(selectedObject.point);
    }
    getCoo(position){
        let Coo = new THREE.Vector2();
        Coo.x = Math.trunc(2*(position.x + 2)); // Calcul coo
        Coo.y = Math.trunc(2*(position.y + 2));
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
}

