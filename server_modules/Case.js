
class Case{
    constructor(){ // Couleur de la case à gérer dans la partie graphique
        this.playable = false; // prévisualisation du coup jouable
        this.piece = 0; // undefined à mettre ?
    }
    //clone(){
    //    let tmp = new Case();
        //tmp.playable = this.playable;
    //    if(this.piece == 0) tmp.piece = 0;
    //    else tmp.piece = this.piece.clone();
    //    return tmp;
    //}
}

module.exports = Case;