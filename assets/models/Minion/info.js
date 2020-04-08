let info = {
    chemin : 'Minion', 
    scale : .18, 
    couleur : 0,
    Offset: [
        //Blancs
        { position: {x:0, y:0}, rotation: {x:0, y:( 90* (Math.PI / 180)), z:0} },//Pion
        { position: {x:0, y:0}, rotation: {x:0, y:( 90* (Math.PI / 180)), z:0} },//Fou
        { position: {x:0, y:0}, rotation: {x:( 5* (Math.PI / 180)), y:( 90* (Math.PI / 180)), z:0} },//Cavalier
        { position: {x:0, y:0}, rotation: {x:0, y:( 90* (Math.PI / 180)), z:0} },//Tour
        { position: {x:0, y:0}, rotation: {x:0, y:( 90* (Math.PI / 180)), z:0} },//Reine
        { position: {x:0, y:0}, rotation: {x:0, y:( 90* (Math.PI / 180)), z:0} },//Roi
        //Noirs
        { position: {x:0, y:0}, rotation: {x:0, y:( 270* (Math.PI / 180)), z:0} },//Pion
        { position: {x:0, y:0}, rotation: {x:0, y:( 270* (Math.PI / 180)), z:0} },//Fou
        { position: {x:0, y:0}, rotation: {x:( 0* (Math.PI / 180)), y:( 270* (Math.PI / 180)), z:0} },//Cavalier
        { position: {x:0, y:0}, rotation: {x:0, y:( 270* (Math.PI / 180)), z:0} },//Tour
        { position: {x:0, y:0}, rotation: {x:0, y:( 270* (Math.PI / 180)), z:0} },//Reine
        { position: {x:0, y:0}, rotation: {x:0, y:( 270* (Math.PI / 180)), z:0} },//Roi
    ]
}

//Rotation par x : vers le bas a gauche
//Rotation par y : Circulaire sens anti-horaire
//Rotation par z : Inclinaison vers le board (noir -> blanc)
// ( 90* (Math.PI / 180))

//Position par x : déplacement vers le bas ( blanc -> noir )
//Position par y : déplacement vers la droite
// 0.5 par case