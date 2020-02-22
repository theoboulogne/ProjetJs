class TicTacToeView {
    constructor(game, a_voir){
        edit.Html(get.Id("player_number"), game.currentPlayer + 1); // +1 pour avoir joueur 1 ou 2  -> |||| a deplacer ||||
        this.initEvent(game);
    }

    initEvent(morpion){
        alerte.CloseAll(); // On ferme les alertes au début
        
        for(let i=0; i<3; i++) for(let j=0; j<3; j++) {
            edit.Event(get.Case(j, i), function(){playEvent(morpion, j, i);})
        }

        edit.Event(get.Id("reset"), function(){alerte.CloseAll(); bouton.Reset(morpion);})
        edit.Event(get.Id("closeWin"), function(){alerte.CloseWin();})
        edit.Event(get.Id("closeFull"), function(){alerte.CloseFull();})
    }
}