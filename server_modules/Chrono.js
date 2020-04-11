
class Chrono{
    constructor(){ 
        this.Debut = new Date();
        this.Chrono = {m:0, s:0};
    }

    CalcChrono(){ // on met à jour le chrono au cas ou il se soit décalé
        let Fin = new Date();
        
        // on enregstre les temps de debut et de fin
        let TempsDebut = {m:this.Debut.getMinutes(), s:this.Debut.getSeconds()}
        let TempsFin = {m:Fin.getMinutes(), s:Fin.getSeconds()}
        
        // on calcule le temps entre les deux
        let TempsEcoule = {
            m: Math.abs(TempsDebut.m - TempsFin.m),
            s: Math.abs(TempsDebut.s - TempsFin.s)
        };
        
        // on renvoi le chrono convertit
        return this.getChronoTotal(TempsEcoule)
    }

    getChronoTotal(Chrono){ // on convertit le chrono finale en heures minutes secondes
        let ChronoTotal = {h:0, m:Chrono.m, s:Chrono.s}

        // on rajoute les heures uniquement pour l'enregistrement en BDD
        if(ChronoTotal.m >= 60){
            ChronoTotal.h += 1;
            ChronoTotal.m -= 60;
        }

        return String(ChronoTotal.h) + ":" + String(ChronoTotal.m) + ":" + String(ChronoTotal.s);
    }
}

module.exports = Chrono;