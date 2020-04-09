



// GARDER LA COULEUR ????????????????????????????????? utilité à vérifier
// pareil pour pieces


class Joueur{
    constructor(couleur, id, pseudo){
        this.id = id; // l'id correspond à l'id de la socket correspondante
        this.pseudo = pseudo // le pseudo est enregistré pour l'enregistrement des scores

        this.roi = {x:3, y:couleur*7}

        this.pieces_prises = new Array()
    }
    //Méthode pour le clonage du plateau, non utilisée finalement pour réduire le nombre d'opération lors du clone
    // (on se contente d'une recopie avec JSON.parse/stringlify car on a pas besoin des méthodes de la classe)
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