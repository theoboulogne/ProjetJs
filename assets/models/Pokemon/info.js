// Non utilisé actuellement, uniquement pour la production (pour utiliser PI dans le calcul)

let info = {
    chemin : 'Pokemon', 
    scale : .011, 
    couleur : 1,
    Offset: [
        //Blancs
        { position: {x:0, y:0}, rotation: {x:0, y:0, z:0} },//Pion
        { position: {x:0, y:0}, rotation: {x:0, y:0, z:0} },//Fou
        { position: {x:0, y:0}, rotation: {x:0, y:0, z:0} },//Cavalier
        { position: {x:0, y:0}, rotation: {x:0, y:0, z:0} },//Tour
        { position: {x:0, y:0}, rotation: {x:0, y:0, z:0} },//Reine
        { position: {x:0, y:0}, rotation: {x:0, y:0, z:0} },//Roi
        //Noirs
        { position: {x:0, y:0}, rotation: {x:0, y:( 180* (Math.PI / 180)), z:0} },//Pion
        { position: {x:0, y:0}, rotation: {x:0, y:( 180* (Math.PI / 180)), z:0} },//Fou
        { position: {x:0, y:0}, rotation: {x:0, y:( 180* (Math.PI / 180)), z:0} },//Cavalier
        { position: {x:0, y:0}, rotation: {x:0, y:( 180* (Math.PI / 180)), z:0} },//Tour
        { position: {x:0, y:0}, rotation: {x:0, y:( 180* (Math.PI / 180)), z:0} },//Reine
        { position: {x:0, y:0}, rotation: {x:0, y:( 180* (Math.PI / 180)), z:0} }//Roi
    ]
};

//Rotation par x : vers le bas a gauche
//Rotation par y : Circulaire sens anti-horaire
//Rotation par z : Inclinaison vers le board (noir -> blanc)
// ( 180* (Math.PI / 180))

//Position par x : déplacement vers le bas ( blanc -> noir )
//Position par y : déplacement vers la droite
// 0.5 par case