let BoutonPlay = document.getElementById("play");
BoutonPlay.addEventListener("click", event=> Menu.Play());

let Menu = (function(){
    return{
        Play : () => {  
            document.getElementById("menu").style.display = "none";
            document.getElementById("menu").style.visibility = 'hidden';
            document.location.href= '/jeu'
            //let pseudo = document.forms["general"].elements["champ1"];
            //console.log(pseudo);
            //window.location.href = "/jeu";
        },
    }
})();