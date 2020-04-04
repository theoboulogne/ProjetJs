



// GARDER LA COULEUR ????????????????????????????????? utilité à vérifier



class Joueur{
    constructor(couleur, id){
        this.id = id;

        this.pieces = 16; // 16 au debut de la partie   utilité aussi ????? 
        this.couleur = couleur // 0 ou 1, blanc/noir // utilité ???????? <------------------------------------------
        this.roi = {x:3, y:couleur*7}

        this.pieces_prises = new Array()
    }
    //clone(){
    //    let tmp = new Joueur();
    //    tmp.id = this.id
    //    tmp.pieces = this.pieces //utilité à vérifier < --------------------------------------------------
    //    tmp.couleur = this.couleur //utilité à vérifier aussi
    //
    //    tmp.roi = this.roi.x
    //    tmp.roi.y = this.roi.y
    //    
    //    tmp.pieces_prises = JSON.parse(JSON.stringify(this.pieces_prises)); 
    //      // récupération du tableau par copie (sans les méthodes des pièces car inutilisées)
    //
    //    return tmp;
    //}
}

module.exports = Joueur;