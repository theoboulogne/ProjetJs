module.exports = {
    Indice(echiquiers){
        let indiceEchiquier = undefined;
        let couleurSocket = undefined;
        for(let i=0; i<echiquiers.length; i++){
            for(let j=0; j<echiquiers[i].Joueurs.length; j++){
                if(echiquiers[i].Joueurs[j].id == socket.id){ // si le bon id
                    indiceEchiquier = i;
                    couleurSocket = j;
                }
            }
        }
        return [indiceEchiquier, couleurSocket]
    }
};