const mysql = require('mysql');

//Info de connection à la BDD
const InfoConnectionBDD = { 
    host: "localhost",
    user: "root",
    password: "",
    database: "echecs"
  };

module.exports = {
    CreationScoreBDD(){
        let con = mysql.createConnection(InfoConnectionBDD);
        con.connect(function(err) {
            // if (err) throw err; On désactive pour laisser le serveur fonctionner si la connection ne marche pas
            if (!err){
                console.log("Connecté à la mysql !");
                let sql = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'echecs' AND TABLE_NAME = 'scores'";
                con.query(sql, function (err, result) { // on effectue la requete pour regarder si la table echecs existe
                    // if (err) throw err;
                    if (!err){
                        if(!result.length){ // si la table n'est pas présente alors on la crée
                            let createTablesql = "CREATE TABLE `scores` (`id` int(11) NOT NULL AUTO_INCREMENT,`pseudo` tinytext NOT NULL,`pieces` tinyint(4) NOT NULL,`chrono` time NOT NULL,`gagnant` tinyint(4) NOT NULL,`coups` text NOT NULL,`pieces_prises_blanc` text NOT NULL,`pieces_prises_noir` text NOT NULL,PRIMARY KEY (`id`)) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1"
                            con.query(createTablesql, function (error, result) {
                                //if (error) throw error;
                                if(!error) console.log("Table score inséré");
                            });
                        }
                    }
                });
            }
        });
    },
    EnvoiScoreBDD(plateau, couleurJoueur) {
    
        let con = mysql.createConnection(InfoConnectionBDD);
        con.connect(function(err) {
            //if (err) throw err; On désactive pour laisser le serveur fonctionner si la connection ne marche pas
            if(!err){
                console.log("Connecté à la mysql !");
                let sql = "INSERT INTO `scores`(`pseudo`, `pieces`, `chrono`, `gagnant`, `coups`, `pieces_prises_blanc`, `pieces_prises_noir`) VALUES ( ?, ?, ?, ?, ?, ?, ?)" 
                //On insère les données demandées par l'énoncé
                //On insère également certaines infos de la partie afin de pouvoir la replay auto
                con.query(sql, [plateau.Joueurs[couleurJoueur].pseudo, 
                                String(16 - plateau.Joueurs[(couleurJoueur+1)%2].pieces_prises.length), 
                                (plateau.chrono.CalcChrono()),
                                String(couleurJoueur), // On rajoute la couleur du gagnant et le tableau des coups pour le replay
                                JSON.stringify(plateau.coups), 
                                JSON.stringify(plateau.Joueurs[0].pieces_prises),// On rajoute aussi les pièces prises de chaque joueur pour le replay
                                JSON.stringify(plateau.Joueurs[1].pieces_prises)
                            ], function (err, result) {
                    // if (err) throw err;
                    if (!err) console.log("Score inséré");
                });
            }
        });
    },
    sendScores(res){
        let con = mysql.createConnection(InfoConnectionBDD);
        con.connect(function(err) {
            //if (err) throw err;
            if (!err){
                console.log("Connecté à la mysql !");
                let sql = "SELECT `id`, `pseudo`, `pieces`, `chrono` FROM `scores` LIMIT 100" // On récupère les données, on limite à 100 scores pour 
                con.query(sql, function (err, result) {     // éviter les problèmes en cas de trop grand nombre d'infos
                    // if (err) throw err;
                    if (!err) return res.send(result); // on envoi au client
                });
            }
        });
    },
    sendReplay(res, idreplay, tmpPlateau){
        let con = mysql.createConnection(InfoConnectionBDD);
        con.connect(function(err) {
            //if (err) throw err;
            if (!err){
                console.log("Connecté à la mysql !");
                let sql = "SELECT `gagnant`, `coups`, `pieces_prises_blanc`, `pieces_prises_noir` FROM `scores` WHERE `id`="+String(idreplay)+" LIMIT 1" // On récupère les données
                con.query(sql, function (err, result) { 
                    // if (err) throw err;
                    if (!err){
                        let envoi = {};
                        envoi.data = result;
                        envoi.board = tmpPlateau.board;
                        return res.send(envoi); // on envoi au client
                    }
                });
            }
        });
    }
};