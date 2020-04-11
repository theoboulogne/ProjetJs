
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
        
        //bouton servant a changer de page dans le tableau des scores (de 6 score maxi)
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

    //fonction qui permettra de rajouter les elements dans une nouvelles lignes du tableau des scores
    let ajout_case = (val)=>{
        let part = document.createElement('td');
        let valeur = document.createTextNode(val);
        part.appendChild(valeur);
        return part
    }
    return{
        //fonction lier au bouton play
        Play : () => {  
            event.preventDefault();
            let pseudo = document.getElementById("pseudo").value;
            let affichage = document.getElementById("pieces_choix").value;
            let ia = document.getElementById("ia").value;
            window.location.href = "jeu?pseudo=" + pseudo + "&affichage=" + affichage + "&ia=" + ia;
        },
        //recupère le tableau du serveur
        setScores : (tab) => {
            this.tableau = tab;
        },
        //ajout un element au tableau des scores
        AjoutScore : (j) =>{

            let tableau = document.getElementById("tableau_score_affichage");
            let tr = document.createElement('tr');
            tableau.appendChild(tr);

            tr.appendChild(ajout_case(this.tableau[j].pseudo))
            tr.appendChild(ajout_case(this.tableau[j].pieces))
            tr.appendChild(ajout_case(this.tableau[j].chrono))

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
            replay_bouton.addEventListener("click", function(){window.location.href = "jeu?replay=" + String(j)});
        },
        //cree une nouvelle page pour le tableau de scores ( pas plus de 6 scores par pages)
        AjoutTableauScore : (i_suplementaire) =>{
            if(i+i_suplementaire < this.tableau.length && i+i_suplementaire > -1){
                i += i_suplementaire;
                if(i_suplementaire != 0){
                    $( "#tableau_score_affichage" ).empty()
                }
                for(let j = i; j < i + Math.abs(i_suplementaire); j++){
                    if(j < this.tableau.length){
                        Menu.AjoutScore(j);
                    }
                }
            }
        },
    }
})();
