
const mysql = require('mysql');

module.exports = {
    CreationScoreBDD(InfoConnectionBDD){
        let con = mysql.createConnection(InfoConnectionBDD);
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connecté à la mysql !");
            let sql = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'echecs' AND TABLE_NAME = 'scores'";
            con.query(sql, function (err, result) {
                if (err) throw err;
                if(!result.length){ // si la table n'est pas présente alors on la crée
                    let createTablesql = "CREATE TABLE `scores` (`id` int(11) NOT NULL AUTO_INCREMENT,`pseudo` tinytext NOT NULL,`pieces` tinyint(4) NOT NULL,`chrono` time NOT NULL,PRIMARY KEY (`id`)) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1"
                    con.query(createTablesql, function (error, result) {
                        if (error) throw error;
                        console.log("Table score inséré");
                    });
                }
            });
    
        });
    },
    EnvoiScoreBDD(plateau, couleurJoueur, InfoConnectionBDD) {
        //on enregistre la couleur dans plateau pour le replay
        plateau.couleurGagnant = couleurJoueur
    
        let con = mysql.createConnection(InfoConnectionBDD);
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connecté à la mysql !");
            let sql = "INSERT INTO `scores`(`pseudo`, `pieces`, `chrono`) VALUES ( ?, ?, ?)" 
            //On insère les données demandées par l'énoncé
            //On insère également la partie en entier afin de pouvoir la replay auto
            con.query(sql, [plateau.Joueurs[couleurJoueur].pseudo, 
                            String(16 - plateau.Joueurs[(couleurJoueur+1)%2].pieces_prises.length), 
                            (plateau.chrono.getChronoTotal())], function (err, result) {
                if (err) throw err;
                console.log("Score inséré");
            });
        });
    },
    
};