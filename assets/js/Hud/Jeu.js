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
        Affichage_coups : (coups, Nbtour) => { 
            let div
            //document.getElementById('coups_blanc').innerHTML = "";
            //document.getElementById('coups_noir').innerHTML = "";
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
            cout.setAttribute("class","ecriture");
            if(Nbtour % 2 == 0){
                var texte = document.createTextNode("C'est aux blancs de jouer !");
            }
            if(Nbtour % 2 == 1){
                var texte = document.createTextNode("C'est aux noirs de jouer !");
            }
            div.append(cout);
            cout.appendChild(texte);
        },
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
