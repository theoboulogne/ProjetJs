
$( document ).ready(function() {

    let BoutonPlay = document.getElementById("play");
    BoutonPlay.addEventListener("click", event=> Menu.Play());

    $.ajax({//Reprise avec modification de : https://grokonez.com/node-js/integrate-nodejs-express-jquery-ajax-post-get-bootstrap-view
      type : "GET",
      url : window.location + "scores",
      success: function(result){
        
        //Afficher tableau
        Menu.setScores(result)
        Menu.AjoutTableauScore(6)
        
        let Bouton_page_precedente = document.getElementById("tableau_page_precedente");
        Bouton_page_precedente.addEventListener("click", event=>Menu.AjoutTableauScore(-6));
        let Bouton_page_suivante = document.getElementById("tableau_page_suivante");
        Bouton_page_suivante.addEventListener("click", event=>Menu.AjoutTableauScore(6));


      },
      error : function(e) {
        
        //Afficher erreur 
        
        $("#erreur").modal({
            fadeDuration: 100,
            showClose: false
        });

        console.log("ERROR: ", e);
      }
    });  
})

let Menu = (function(){
    let i = -6;
    this.tableau = undefined;
    return{
        Play : () => {  
            event.preventDefault();
            let pseudo = document.getElementById("pseudo").value;
            let affichage = document.getElementById("pieces_choix").value;
            let IA_check = document.getElementsByName("ia")[0].checked;
            if(IA_check){
                window.location.href = "jeu?pseudo=" + pseudo + "&affichage=" + affichage + "&ia=1"
            }
            else{
                window.location.href = "jeu?pseudo=" + pseudo + "&affichage=" + affichage
            }
        },
        setScores : (tab) => {
            this.tableau = tab;
        },
        AjoutScore : (pseudo, nbpiece_restante, temps) =>{
            let tableau = document.getElementById("tableau_score_affichage");
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
            let replay = document.createElement('td');
            tr.appendChild(replay);
            let replay_bouton = document.createElement("BUTTON");
            let t = document.createElement("i"); 
            t.setAttribute("class","fas fa-sync-alt");
            let zone_texte = document.createElement("h1");
            zone_texte.setAttribute("class","ecriture");
            replay_bouton.setAttribute("class","btn btn-dark btn_tableau");
            zone_texte.appendChild(t);   
            replay_bouton.appendChild(zone_texte);   
            replay.appendChild(replay_bouton);
            replay_bouton.addEventListener("click", event=> console.log("test"));
        },
        AjoutTableauScore : (i_suplementaire) =>{
            if(i+i_suplementaire < this.tableau.length && i+i_suplementaire > -1){
                i += i_suplementaire;
                if(i_suplementaire != 0){
                    $( "#tableau_score_affichage" ).empty()
                }
                for(let j = i; j < i + Math.abs(i_suplementaire); j++){
                    if(j < this.tableau.length){
                        Menu.AjoutScore(this.tableau[j].pseudo, this.tableau[j].pieces, this.tableau[j].chrono);
                    }
                }
            }
        },
    }
})();
