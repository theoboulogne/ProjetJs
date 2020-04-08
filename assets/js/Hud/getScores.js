//Reprise avec modification de : https://grokonez.com/node-js/integrate-nodejs-express-jquery-ajax-post-get-bootstrap-view

$( document ).ready(function() {
      $.ajax({
        type : "GET",
        url : window.location + "scores",
        success: function(result){
          
          //Afficher tableau
          console.log(result)

        },
        error : function(e) {
          
          //Afficher erreur 
          console.log("ERROR: ", e);
        }
      });  
  })