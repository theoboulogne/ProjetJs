module.exports = {
    Indice(echiquiers, id){
        let indiceEchiquier = undefined;
        let couleurSocket = undefined;
        for(let i=0; i<echiquiers.length; i++){
            for(let j=0; j<echiquiers[i].Joueurs.length; j++){
                if(echiquiers[i].Joueurs[j].id == id){ // si le bon id
                    indiceEchiquier = i;
                    couleurSocket = j;
                }
            }
        }
        return [indiceEchiquier, couleurSocket]
    }
};