
// Fonction jouée lors d'un clic de souris

function playEvent(morpion, x, y){
    if(morpion.getCaseState(x,y)==undefined && !morpion.isFinished()){

        console.log("Joueur " + (morpion.currentPlayer+1) + " a joué en " + x + "," + y);
        morpion.play(x,y);//Coût joué

        // Affichage Graphique
        image.Morpion(morpion.currentPlayer - 1, "img/x.png", "img/o.png", get.Case(x, y), "game") 
        // -1 car il vient d'être inversé et que la fonction compare à 0
        edit.Html(get.Id("player_number"), morpion.currentPlayer + 1); 
        // +1 pour avoir Joueur 1 et 2
        
        // Test de Fin
        if(!morpion.isFinished()) return; 
        else if (morpion.hasWinner()) {
            alerte.OpenWin(morpion.getWinner()+1);
            console.log("Joueur " + (morpion.getWinner()+1) + " a gagné la partie");
        }
        else {
            alerte.OpenFull();
        }

        // On reset la partie
        bouton.Reset(morpion);
    }
}