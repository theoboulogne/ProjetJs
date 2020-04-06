
const mysql = require('mysql');
const InfoConnectionBDD = { //Info de connection à la BDD
  host: "localhost",
  user: "root",
  password: "",
  database: "echecs"
};

let EnvoiScoreBDD = (plateau, couleurJoueur) => {
    //on enregistre la couleur dans plateau pour le replay
    plateau.couleurGagnant = couleurJoueur

    let con = mysql.createConnection(InfoConnectionBDD);
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connecté à la mysql !");
        let sql = "INSERT INTO `scores`(`pseudo`, `pieces`, `chrono`, `partie`) VALUES ('" + 
            //On insère les données demandées par l'énoncé
                plateau.Joueurs[couleurJoueur].pseudo + "'," +
                String(16 - plateau.Joueurs[(couleurJoueur+1)%2].pieces_prises.length) + ",'" +
                (plateau.chrono.getChronoTotal()) + "','" +
            //On insère également la partie en entier afin de pouvoir la replay auto :
                JSON.stringify(plateau) + "')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Score inséré");
        });
    });
};


module.exports = EnvoiScoreBDD;