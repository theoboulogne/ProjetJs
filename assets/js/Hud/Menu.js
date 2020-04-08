
let BoutonPlay = document.getElementById("play");
BoutonPlay.addEventListener("click", event=> Menu.Play());
console.log("Dans le menu.js")
let Bouton_page_precedente = document.getElementById("tableau_page_precedente");
Bouton_page_precedente.addEventListener("click", event=>Menu.AjoutTableauScore(tableau, -6));
let Bouton_page_suivante = document.getElementById("tableau_page_suivante");
Bouton_page_suivante.addEventListener("click", event=>Menu.AjoutTableauScore(tableau, 6));

let Menu = (function(){
    let i = 0;
    return{
        Play : () => {  
            event.preventDefault();
            let pseudo = document.getElementById("pseudo").value;
            let affichage = document.getElementById("pieces_choix").value;
            window.location.href = "jeu?pseudo=" + pseudo + "&affichage=" + affichage
        },
        AjoutScore : (pseudo, nbpiece_restante, temps) =>{
            let tableau = document.getElementById("tableau_score_affichage");
            //add tr
            var tr = document.createElement('tr');
            tableau.appendChild(tr);
            let pseudo_Tabableau = document.createElement('td');
            tr.appendChild(pseudo_Tabableau);
            let pseudo_Tabableau_valeur = document.createTextNode(pseudo);
            pseudo_Tabableau.appendChild(pseudo_Tabableau_valeur);
            let nbpiece_restante_Tabableau = document.createElement('td');
            tr.appendChild(nbpiece_restante_Tabableau);
            let nbpiece_restante_Tabableau_valeur = document.createTextNode(nbpiece_restante);
            nbpiece_restante_Tabableau.appendChild(nbpiece_restante_Tabableau_valeur); 
            let temps_Tabableau = document.createElement('td');
            tr.appendChild(temps_Tabableau);
            let temps_Tabableau_valeur = document.createTextNode(temps);
            temps_Tabableau.appendChild(temps_Tabableau_valeur);
            
        },
        AjoutTableauScore : (tableau, i_suplementaire) =>{
            if(i+i_suplementaire < tableau.length && i+i_suplementaire > -1){
                i += i_suplementaire;
                if(i_suplementaire != 0){
                    $( "#tableau_score_affichage" ).empty()
                }
                for(let j = i; j < i + 6; j++){
                    if(j < tableau.length){
                        Menu.AjoutScore(tableau[j].pseudo, tableau[j].piece, tableau[j].temps);
                    }
                }
            }
        },
    }
})();

tableau = new Array()
tableau.push({})
tableau.push({})
tableau.push({})
tableau.push({})
tableau.push({})
tableau.push({})
tableau.push({})
tableau.push({})
tableau.push({})
tableau.push({})
tableau.push({})
tableau.push({})
tableau.push({})
tableau.push({})

tableau[0].pseudo = "daniel1"
tableau[0].piece = "10"
tableau[0].temps = "00:55"

tableau[1].pseudo = "daniel2"
tableau[1].piece = "10"
tableau[1].temps = "00:55"

tableau[2].pseudo = "daniel3"
tableau[2].piece = "10"
tableau[2].temps = "00:55"

tableau[3].pseudo = "daniel4"
tableau[3].piece = "10"
tableau[3].temps = "00:55"

tableau[4].pseudo = "daniel5"
tableau[4].piece = "10"
tableau[4].temps = "00:55"

tableau[5].pseudo = "daniel6"
tableau[5].piece = "10"
tableau[5].temps = "00:55"


tableau[6].pseudo = "test7"
tableau[6].piece = "10"
tableau[6].temps = "00:55"

tableau[7].pseudo = "daniel8"
tableau[7].piece = "10"
tableau[7].temps = "00:55"

tableau[8].pseudo = "daniel9"
tableau[8].piece = "10"
tableau[8].temps = "00:55"

tableau[9].pseudo = "daniel10"
tableau[9].piece = "10"
tableau[9].temps = "00:55"

tableau[10].pseudo = "daniel11"
tableau[10].piece = "10"
tableau[10].temps = "00:55"

tableau[11].pseudo = "daniel12"
tableau[11].piece = "10"
tableau[11].temps = "00:55"

tableau[12].pseudo = "daniel13"
tableau[12].piece = "10"
tableau[12].temps = "00:55"

tableau[13].pseudo = "daniel14"
tableau[13].piece = "10"
tableau[13].temps = "00:55"
//console.log(tableau)

Menu.AjoutTableauScore(tableau, 0);