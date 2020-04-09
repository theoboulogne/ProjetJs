/*document.getElementById('pieces').innerHTML = "";
for(let i = 0; i < test.length; i++){
    let img = document.createElement("img");
    img.src = "../textures/piece-chess/"+test[i]+".png";
    let src = document.getElementById("pieces");
    src.appendChild(img);
    img.className = "image";
}*/



//coups = new Array()
//coups.push('B8')
let Nbtour = 0;
let Hud = (function(){
    return{
        reloadAll:(plateau)=>{
            let elem = document.getElementById('Affichage_coups');
            while(elem != undefined){
                elem.parentNode.removeChild(elem);
                elem = document.getElementById('Affichage_coups');
            }
            for(let i=0; i<plateau.coups.length; i++){
                this.Affichage_coups(plateau.coups[i], i);
            }
            this.Affichage_AquiDejouer(plateau.Nbtour)
            //this.Affichage_SetChrono(plateau.chrono.Chrono) 
            //On ne reset pas le chrono pour éviter de devoir le réactualiser inutilement coté serveur
        },
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
        },
        Affichage_coups : (coupTour, Nbtour) => { 
            let div;
            let coup = document.createElement("h2");
            coup.setAttribute("class","ecriture_coups");
            coup.setAttribute("id", "Affichage_coups")
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

            var texte = document.createTextNode(coupString);
            div.append(coup);
            coup.appendChild(texte);
            var x = div.childElementCount; 
        },

        Affichage_AquiDejouer : (Nbtour) => {
            document.getElementById("AquiDejouer").innerHTML = "";
            let div = document.getElementById("AquiDejouer");
            let cout = document.createElement("h1");
            cout.setAttribute("class","ecriture_titre");
            if(Nbtour % 2 == 0){
                var texte = document.createTextNode("C'est aux blancs de jouer !");
            }
            if(Nbtour % 2 == 1){
                var texte = document.createTextNode("C'est aux noirs de jouer !");
            }
            div.append(cout);
            cout.appendChild(texte);
        },
        choix_piece : (piece) =>{
            $("#choix_piece").modal({
                escapeClose: false,
                clickClose: false,
                showClose: false
            });
            let reine = document.getElementById("bouton_reine");
            let fou = document.getElementById("bouton_fou");
            let cheval = document.getElementById("bouton_chevalier");
            let tour = document.getElementById("bouton_tour");
            reine.addEventListener("click",event => piece.choix = "Reine");
            fou.addEventListener("click", event => piece.choix  = "Fou");
            cheval.addEventListener("click",event => piece.choix = "Cavalier");
            tour.addEventListener("click",event => piece.choix = "Tour");
        }
        /*Message_Alerte : (texte)=>{
            alert(texte);
            while(!confirm(texte)){}
            window.location.href = "./";
        }*/
    }
})();
/*
Hud.Affichage_coups(coups,Nbtour);
Hud.Affichage_AquiDejouer(Nbtour);


coups.push('C3')
Nbtour = 1;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C6')
Nbtour = 2;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C3')
Nbtour = 1;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C6')
Nbtour = 2;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C3')
Nbtour = 1;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C6')
Nbtour = 2;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C3')
Nbtour = 1;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C6')
Nbtour = 2;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C3')
Nbtour = 1;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C6')
Nbtour = 2;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C3')
Nbtour = 1;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C6')
Nbtour = 2;
Hud.Affichage_coups(coups,Nbtour);
*/
