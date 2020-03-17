/**
 * Created by justinmiller on 4/2/15.
 */

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
            {name: "Bishop"},
            {name: "CNC_Mill"},
            {name: "ConveverBelt_OBJ"},
            {name: "diesel_generator"},
            {name: "futuristic.heater.low"},
            {name: "King"},
            {name: "Knight"},
            {name: "Mixer01O"},
            {name: "Pawn"},
            {name: "Queen"},
            {name: "Rook"},
            {name: "SA_LD_Generatoe"},
            {name: "Vent2"},
        ];
        var pieces = [];
        console.log(Pieces)
        //loadPieces(Pieces);

        for(let i=0; i<Pieces.length; i++){
            objLoader.load("../models/" + Pieces[i].name + ".obj", function(object) {
                object.traverse( function ( child ) {
                    if (child instanceof THREE.Mesh) {
                        if(Pieces[i].couleur) child.material = new THREE.MeshLambertMaterial({color: 0x555555});
                        else child.material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
                        child.position.set(-1.75 + (0.5 * Pieces[i].y),-1.75 + (0.5 * Pieces[i].x),0); // -1.2 -> -0.7 -> -0.25 -> 0.2 -> 0.65 | -1.62 -> -1.15 -> -0.7 -> -0.24 -> 0.23
                        child.scale.set(.025, .025, .025);
                        child.rotation.z = -.1;
                        child.rotation.x = 1.6;
                        child.rotation.y = 1.7;
                        scene.add(child);
                        //animatePawn(pawn);
                    }
                });
            });
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

        var TweenUp = function(piece) {

            var position = piece.position;
            var target = {z: position.z + .6};
            var tween = new TWEEN.Tween(piece.position).to(target, 1000);

            tween.onUpdate(function() {
                piece.position.z = position.z;
            });

            return tween;
        };

        var TweenDown = function(piece) {
            var position = piece.position;
            var target = {z: position.z};
            var tween = new TWEEN.Tween(piece.position).to(target, 1000);
            tween.onUpdate(function() {
                piece.position.z = position.z;
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

        var TweenSpacesDiagonal = function(piece, spacesX, spacesY) {
            var position = piece.position;
            var target = {y: position.y + tile.translate*spacesY, x: position.x +tile.translate*spacesX};
            var tween = new TWEEN.Tween(piece.position).to(target, 3000);
            tween.onUpdate(function() {
                piece.position.y = position.y;
                piece.position.x = position.x;
            });
            return tween;
        };

        function animatePiece(piece) {
            var tweenUp = TweenUp(piece);
            var tweenOneUp = TweenSpacesDiagonal(piece, 3, 3);
            var tweenDown = TweenDown(piece);
            tweenUp.chain(tweenOneUp);
            tweenOneUp.chain(tweenDown);
            tweenUp.start();
        }
    }
}
