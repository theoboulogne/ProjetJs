
// Modules de modification de la page

let create =  (function(){
    return{
        Element : (type, id) => {                                       //pour nous eviter d'utiliser plein de ligne 
            let renvoi = document.createElement(type);                  //pour creer de nouveau element a chaque fois
            if (id != undefined) edit.Attribute(renvoi, "id", id);
            return renvoi
        },

        Spinner : (id) => {                                                         // pour ajouter un spinner
            let spinner = create.Element("span", id);                               // par exemple dans le bouton reset
            edit.Attribute(spinner, "class", "spinner-border spinner-border-sm");   // pendant un chargement
            edit.Attribute(spinner, "role", "status");
            edit.Attribute(spinner, "aria-hidden", "true");
            return spinner;
        },
    }
})();

let get =  (function(){
    return{
        Case : (x, y) => {                                                       // on recupere la valeur d'une case (x,y)
            return get.Id("morpion").firstElementChild.children[y].children[x];
        },
        
        Id : (id) => {                                  // on s'evite de retaper la longue phrase a chaque fois
            return document.getElementById(id);
        },
    }
})();

let edit =  (function(){
    return{
        Remove : (id) => {                 // on supprime tout les element ayant "l'ID" demande
            while(get.Id(id)!=undefined){
                get.Id(id).remove();
            }
        },

        Attribute : (elem, Attributetype, Attributecontent) => {  // raccourci pour "setAttribute"
            elem.setAttribute(Attributetype, Attributecontent);
        },

        Html : (elem, Htmlcontent, disable) => {                 // modifier du texte HTML
            elem.innerHTML = Htmlcontent;                        // par exemple changer le nom du joueur a chaque coup
            if (disable != undefined) elem.disabled = disable;
        },

        Event : (elem, callback) => {                  // raccourci pour "addEventListener"
            elem.addEventListener("click", callback);
        },
    }
})();