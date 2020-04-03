/*document.getElementById('pieces').innerHTML = "";
for(let i = 0; i < test.length; i++){
    let img = document.createElement("img");
    img.src = "../textures/piece-chess/"+test[i]+".png";
    let src = document.getElementById("pieces");
    src.appendChild(img);
    img.className = "image";
}*/

let Hud = (function(){
    return{
        Affichage_coups : (coups, Nbtour) => { 
            document.getElementById('coups_blanc').innerHTML = "";
            document.getElementById('coups_noir').innerHTML = "";
            for(let i = 0 + Nbtour % 2; i < coups.length; i++){
                if(i % 2 == 0){
                    let div = document.getElementById("coups_blanc");
                    let cout = document.createElement("h2");
                    cout.setAttribute("class","ecriture");
                    var texte = document.createTextNode(coups[i]);
                    div.append(cout);
                    cout.appendChild(texte);
                }
                if(i % 2 == 1){
                    let div = document.getElementById("coups_noir");
                    let cout = document.createElement("h2");
                    cout.setAttribute("class","ecriture");
                    var texte = document.createTextNode(coups[i]);
                    div.append(cout);
                    cout.appendChild(texte);
                }
            } 
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



