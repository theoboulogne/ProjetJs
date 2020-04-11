let Nbtour = 0;
let Hud = (function(){
    return{
        OpenAttente:()=>{
            $("#attente").modal({
                escapeClose: false,
                clickClose: false,
                showClose: false
            });
        },
        CloseAttente:()=> {$.modal.close();},
        OpenMenu:(info) => {
            document.getElementById('contenu-popup').innerHTML = info;
            $("#popup").modal({
                fadeDuration: 100,
                showClose: false
            });
            $('#popup').on($.modal.BEFORE_CLOSE, function(event, modal) {
                window.location.href = "./"
            });
            setTimeout(function(){ // on redirige au bout de 5 secondes
                window.location.href = "./"
            }, 5000);
        },
        //fonction permettant d'afficher les positions des couts joués dans l'endroit prevu a cet effets
        Affichage_coups : (coupTour, Nbtour) => { 
            //donne tous les atribut necessaire a l'ecriture de ce couts
            let div;
            let coup = document.createElement("h2");
            coup.setAttribute("class","ecriture_coups");
            coup.setAttribute("id", "Affichage_coups")
            //choisit dans quelle colone mettre
            if(Nbtour % 2 == 0){
                div = document.getElementById("coups_blanc");
            }
            if(Nbtour % 2 == 1){
               div = document.getElementById("coups_noir");
            }

            //Génération du coup à afficher :
            let piece = coupTour;
            let coupString = "";
            if(typeof(piece) == "string") coupString = piece; // gestion de l'affichage des roques
            else {
                coupString += String.fromCharCode(("A").charCodeAt(0) + (7-piece.x))
                coupString += String(1+piece.y)
            }

            let texte = document.createTextNode(coupString);
            div.append(coup);
            coup.appendChild(texte);
            let x = div.childElementCount; 
        },
        //affichages a qui c'est de jouer dans la case prevu a cette effet
        Affichage_AquiDejouer : (Nbtour) => {
            let span = document.getElementById("AquiDejouer");
            let texte;
            if(Nbtour % 2 == 0){
                texte = "blancs";
            }
            if(Nbtour % 2 == 1){
                texte = "noirs";
            }
            span.innerHTML = texte;
        },
        //lorsque un piont arrive au bout du plateau, je joueur a le choix de changer ce point
        //affiche la demande "quelle pieces choisir ?"
        choix_piece : (piece) =>{
            //affiche le modal ecrit en html
            $("#choix_piece").modal({
                escapeClose: false,
                clickClose: false,
                showClose: false
            });
            //affiche les 4 choix
            let reine = document.getElementById("bouton_reine");
            let fou = document.getElementById("bouton_fou");
            let cheval = document.getElementById("bouton_chevalier");
            let tour = document.getElementById("bouton_tour");
            reine.addEventListener("click",event => piece.choix = "Reine");
            fou.addEventListener("click", event => piece.choix  = "Fou");
            cheval.addEventListener("click",event => piece.choix = "Cavalier");
            tour.addEventListener("click",event => piece.choix = "Tour");
        }
    }
})();

//en cas de bug bloquant cette fonction permet de "relancer" le plateau
let reloadAll = plateau =>{
    let elem = document.getElementById('Affichage_coups');
    while(elem != undefined){
        elem.parentNode.removeChild(elem);
        elem = document.getElementById('Affichage_coups');
    }
    for(let i=0; i<plateau.coups.length; i++){
        Hud.Affichage_coups(plateau.coups[i], i);
    }
    Hud.Affichage_AquiDejouer(plateau.Nbtour)
}