
// Modules des éléments spécifiques

let alerte =  (function(){
    
    function ouvrir(id, messagelog){       // ouvrir une alerte 
        let alert = get.Id(id);                                    // on recupere une alerte par son ID
        if(alert.style.display === "none"){                        // si elle n'est pas affiche / visible
            if (messagelog != undefined) console.log(messagelog)   // alors on l'affiche avec le message 
            alert.style.display = "block";                         // si il a ete ecrit (dans le console)
        }
    }

    function fermer(id, messagelog){     // fermer une alerte
        alert = get.Id(id);                                       // on recupere une alerte par son ID
        if(alert.style.display != "none") {                       // si elle n'est pas cache
            if (messagelog != undefined ) console.log(messagelog); // alors on cache l'alerte 
            alert.style.display = "none";                         // et on montre le message dans la console
        }
    }
    return{
        OpenWin : (nb) => {                                      // creer une alerte pour la victoire
            ouvrir("gagner", "- Affichage de l'alerte gagnant");
            fermer("plein", "- Fermeture de l'alerte carte pleine");
            edit.Html(get.Id("gagnant"), nb);
        },

        OpenFull : () => {                                         // creer une alerte pour quand la carte est pleine
            ouvrir("plein", "- Affichage de l'alerte carte pleine")
            fermer("gagner", "- Fermeture de l'alerte gagnant");
        },

        CloseWin : () => {                                      // on ferme l'alerte de victoire
            fermer("gagner", "- Fermeture de l'alerte gagnant");
        }, 

        CloseFull : () => {                                        // on ferme l'alerte de carte pleine
            fermer("plein", "- Fermeture de l'alerte carte pleine");
        },

        CloseAll : () => { //Version avec un seul message pour ne pas trop surchager la console
            fermer("gagner", "- Fermeture de toutes les alertes");
            fermer("plein");
        },
    }
})();

let bouton =  (function(){
    function boutonload(){
        //Affichage du bouton de chargement
        let reset = get.Id("reset"); // reccuperation du bouton
        edit.Html(reset, "Chargement..    ", true); // modification de l'affichage dans le bouton
        edit.Attribute(reset, "class", "btn btn-primary"); 
        
        reset.appendChild(create.Spinner("load"));//Ajout du spinner
    }

    function boutonreset(){
        edit.Remove("game");//Reset du jeu graphiquement
        
        //Affichage du bouton de reset
        let reset = get.Id("reset"); // reccuperation du bouton
        edit.Html(reset, "Réinitialisation", false); // modification de l'affichage dans le bouton
        edit.Attribute(reset, "class", "btn btn-danger");

        edit.Remove("load");//On retire le spinner
    }

    return{
        Reset : (morpion) =>
        {   //Timeout de 1800 pour laisser un délai à la fin de la partie 
            //et laisser le bouton "Chargement" en cours
            boutonload();
            console.log("- Réinitialisation en cours");
            setTimeout(() => {
                morpion.reset()
                boutonreset()
                edit.Html(get.Id("player_number"), morpion.currentPlayer + 1);
            }, 1800);
        },
    }
})();

let image =  (function(){
    function Src(img, lastPlayer, srcx, srco){
        if(lastPlayer==0) img.src = srcx;
        else img.src = srco;
        return img; // pour éviter la création d'une variable tampon
    }

    return{
        Morpion : (lastPlayer, srcx, srco, parent, id) => {
            parent.appendChild(Src(create.Element("img", id), lastPlayer, srcx, srco));
        },
    }
})();