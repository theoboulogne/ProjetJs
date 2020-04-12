
class Case{
    constructor(){ 
        this.playable = false; // prévisualisation du coup jouable
        this.piece = 0; // présence de piece
    }
    //Méthode pour le clonage du plateau, non utilisée finalement pour réduire le nombre d'opération lors du clone
    //clone(){
    //    let tmp = new Case();
    //    tmp.playable = this.playable;
    //    if(this.piece == 0) tmp.piece = 0;
    //    else tmp.piece = this.piece.clone();
    //    return tmp;
    //}
}

module.exports = Case;