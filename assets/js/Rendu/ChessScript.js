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
 
        function roundDecimal(nombre, precision){
            var precision = precision || 2;
            var tmp = Math.pow(10, precision);
            return Math.round( nombre*tmp )/tmp;
        }

        function render() {
            requestAnimationFrame( render );
            TWEEN.update();
            renderer.render( scene, camera );
        }
        render();
    
        renderer.domElement.addEventListener("click", onclick, false);
        var selectedObject;
        var raycaster = new THREE.Raycaster();
 
        function onclick(event) {
            var mouse = new THREE.Vector2();
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(pieces, true); //array
            if (intersects.length > 0) {
                selectedObject = intersects[0]; // 40 * le déplacement,
                                                // z correspond à x, x -> y, y -> z
                                                
                animatePiece(selectedObject.object, 140, 0);
                
                let X = Math.trunc(2*(selectedObject.point.x + 2));
                let Y = Math.trunc(2*(selectedObject.point.y + 2));

                console.log(" ");
                console.log("X");
                console.log(X);
                console.log("Y");
                console.log(Y);
            }
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
            var tweenOneUp = TweenSpacesDiagonal(piece, X, Y);
            var tweenDown = TweenDown(piece);
            tweenUp.chain(tweenOneUp);
            tweenOneUp.chain(tweenDown);
            tweenUp.start();
        }
    }
}

