
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
            window.location.href = "jeu?pseudo=" + pseudo + "&affichage=" + affichage
        },
        setScores : (tab) => {
            this.tableau = tab;
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
