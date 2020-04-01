class RenduThreeJs{
    constructor(Pieces){
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
 
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
 
        var objLoader = new THREE.OBJLoader();
 
        var tile = {
            height: .25,
            width: .25,
            center: .125,
            translate: .475
        };
 
        var models = [
            {name: "Pion"},
            {name: "Fou"},
            {name: "Cavalier"},
            {name: "Tour"},
            {name: "Reine"},
            {name: "Roi"},
        ];
        var pieces = [];
        console.log(Pieces)
        //loadPieces(Pieces);
 
        var test;
        for(let k=0; k<2; k++){
            for(let i=0; i<models.length; i++){
                objLoader.load("../models/" + models[i].name + ".obj", function(object) {
                    object.traverse( function ( child ) {
                        if (child instanceof THREE.Mesh) {
                            // on définit la couleur
                            if(k) child.material = new THREE.MeshLambertMaterial({color: 0x555555});
                            else child.material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
                        }
                    });

                    let ATraiter = []
                    for(let j=0; j<Pieces.length; j++){
                        if(Pieces[j].name == models[i].name && Pieces[j].couleur == k) ATraiter.push(Pieces[j]); // push les indices pour réduire les couts ?
                    }

                    for(let j=0; j<ATraiter.length; j++){
                        let tmpobj = object.clone();

                        // la position / taille / orientation
                        tmpobj.position.set(-1.75 + (0.5 * ATraiter[j].y),-1.75 + (0.5 * ATraiter[j].x),0); // -1.2 -> -0.7 -> -0.25 -> 0.2 -> 0.65 | -1.62 -> -1.15 -> -0.7 -> -0.24 -> 0.23
                        tmpobj.scale.set(.025, .025, .025);
                        //$$tmpobj.rotation.z = -.1;
                        tmpobj.rotation.x = 1.6;
                        //tmpobj.rotation.y = 1.7;

                        //On enregistre pour la détection de click
                        pieces.push(tmpobj);
                        //Puis on l'affiche
                        scene.add(tmpobj);
                    }
                });
            }
        }

       
        var boardTexture = new THREE.ImageUtils.loadTexture("../../textures/board-pattern.png");
        boardTexture.repeat.set(4,4);
        boardTexture.wrapS = THREE.RepeatWrapping;
        boardTexture.wrapT = THREE.RepeatWrapping;
 
        var boardMaterials = [
 
            new THREE.MeshLambertMaterial({color: 0x555555}),
            new THREE.MeshLambertMaterial({color: 0x555555}),
            new THREE.MeshLambertMaterial({color: 0x555555}),
            new THREE.MeshLambertMaterial({color: 0x555555}),
            new THREE.MeshLambertMaterial({ map: boardTexture }),
            new THREE.MeshLambertMaterial({color: 0x555555})
 
        ];
 
        var geometry = new THREE.BoxGeometry( 4, 4, 0.01);
        var board = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(boardMaterials) );
        scene.add( board );
 
        var light = new THREE.AmbientLight( 0x555555 ); // soft white light
        scene.add( light );
 
        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 50, 100, 50 );
 
        spotLight.castShadow = true;
 
        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;
 
        spotLight.shadowCameraNear = 500;
        spotLight.shadowCameraFar = 4000;
        spotLight.shadowCameraFov = 30;
 
        scene.add( spotLight );
 
 
        camera.position.x = 5
        camera.rotation.y = ( 60* (Math.PI / 180))
        camera.rotation.z = ( 90* (Math.PI / 180))
        camera.position.z = 3;


        function render() {
            requestAnimationFrame( render );
            TWEEN.update();
            renderer.render( scene, camera );
        }
        render();

        // Cases jouables
        var geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.1 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var playableCase = new THREE.Mesh( geometry, material );
        var playableCases = [];
        
        function playable(X, Y) {
            playableCase.position.set( (X-4)/2 + 0.25, (Y-4)/2 + 0.25, 0 );
            let tmpPlayableCase = playableCase.clone();
            playableCases.push(tmpPlayableCase)
            scene.add( tmpPlayableCase );
        };

        playable(6,5);
        playable(7,5);
        playable(4,5);
        playable(7,7);
        playable(0,0);
    
        renderer.domElement.addEventListener("click", onclick, false);
        var raycaster = new THREE.Raycaster();

        function clickOnCase(playableCases) {
            var mouse = new THREE.Vector2();
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
            raycaster.setFromCamera(mouse, camera);
            return raycaster.intersectObjects(playableCases, true); //array
        }
 
        // clic sur piece ou case jouable
        function onclick(event) {

            var selectedPiece;
            var selectedCase;
            var intersectPiece = clickOnCase(pieces)
            var intersectCase = clickOnCase(playableCases);

            if (intersectPiece.length > 0) {
                selectedPiece = intersectPiece[0];
                     
                animatePiece(selectedPiece.object, 7, 7);
                
                let X = Math.trunc(2*(selectedPiece.point.x + 2));
                let Y = Math.trunc(2*(selectedPiece.point.y + 2));

                console.log(" ");
                console.log("X");
                console.log(X);
                console.log("Y");
                console.log(Y);
                //removeObject(Pieces);
            }

            if (intersectCase.length > 0) {
                selectedCase = intersectCase[0]
                                     
                let X = Math.trunc(2*(selectedCase.point.x + 2));
                let Y = Math.trunc(2*(selectedCase.point.y + 2));

                console.log(" ");
                console.log("X");
                console.log(X);
                console.log("Y");
                console.log(Y);
                removeObject(playableCases);
            }
        }


        function removeObject(array) {
                for (let i = 0; i < array.length; i++) {
                    scene.remove(array[i]);
                }
                array.length = 0;
        }
        


       
        var TweenUp = function(piece) {
            console.log('piece up')
            var position = piece.position;
            var target = {y: position.y + 40};
            var tween = new TWEEN.Tween(piece.position).to(target, 1000);
 
            tween.onUpdate(function() {
                piece.position.y = position.y;
            });
 
            return tween;
        };
 
        var TweenDown = function(piece) {
            console.log('piece down')
            var position = piece.position;
            var target = {y: position.y};
            var tween = new TWEEN.Tween(piece.position).to(target, 1000);
            tween.onUpdate(function() {
                piece.position.y = position.y;
            });
            return tween;
        };
 
        var TweenSpacesUp = function(piece, spaces) {
            var position = piece.position;
            var target = {y: position.y + tile.translate*spaces};
            var tween = new TWEEN.Tween(piece.position).to(target, 3000);
            tween.onUpdate(function() {
                piece.position.y = position.y;
            });
            return tween;
        };
        var TweenSpacesDiagonal = function(piece, spacesX, spacesZ) {
            var position = piece.position;
            var target = {z: position.z + tile.translate*spacesZ, x: position.x +tile.translate*spacesX};
            var tween = new TWEEN.Tween(piece.position).to(target, 3000);
            tween.onUpdate(function() {
                piece.position.z = position.z;
                piece.position.x = position.x;
            });
            return tween;
        };
 
        function animatePiece(piece, X, Y) {
            var tweenUp = TweenUp(piece);
            var tweenOneUp = TweenSpacesDiagonal(piece, X*42, Y*42);
            var tweenDown = TweenDown(piece);
            tweenUp.chain(tweenOneUp);
            tweenOneUp.chain(tweenDown);
            tweenUp.start();
        }
    }
}

