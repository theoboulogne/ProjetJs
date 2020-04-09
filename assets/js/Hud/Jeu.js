coups = new Array()
coups.push('B8')
let Nbtour = 0;
let Hud = (function(){
    return{
        Affichage_coups : (coups, Nbtour) => { 
            let div
            let cout = document.createElement("h2");
            cout.setAttribute("class","ecriture_coups");
            if(Nbtour % 2 == 0){
                div = document.getElementById("coups_blanc");
            }
            if(Nbtour % 2 == 1){
               div = document.getElementById("coups_noir");
            }
            var texte = document.createTextNode(coups[coups.length - 1]);
            div.append(cout);
            cout.appendChild(texte);
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
            reine.addEventListener("click",event => piece.choix = "reine");
            fou.addEventListener("click", event => piece.choix  = "fou");
            cheval.addEventListener("click",event => piece.choix = "cheval");
            tour.addEventListener("click",event => piece.choix = "tour");
        },
        /*Message_Alerte : (texte)=>{
            alert(texte);
            while(!confirm(texte)){}
            window.location.href = "./";
        }*/
    }
})();

Hud.Affichage_coups(coups,Nbtour);
Hud.Affichage_AquiDejouer(Nbtour);
coups.push('B3')
Nbtour = 1;
Hud.Affichage_coups(coups,Nbtour);

coups.push('B6')
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

coups.push('C3')
Nbtour = 1;
Hud.Affichage_coups(coups,Nbtour);

coups.push('C6')
Nbtour = 2;
Hud.Affichage_coups(coups,Nbtour);


//Hud.Message_Alerte("test");