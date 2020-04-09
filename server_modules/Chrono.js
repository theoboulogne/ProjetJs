
class Chrono{
    constructor(){ 
        this.Debut = new Date();
        this.Chrono = {m:0, s:0};
    }

    CalcChrono(){
        let Fin = new Date();

        let TempsDebut = {m:this.Debut.getMinutes(), s:this.Debut.getSeconds()}
        let TempsFin = {m:Fin.getMinutes(), s:Fin.getSeconds()}

        let TempsEcoule = {
            m: Math.abs(TempsDebut.m - TempsFin.m),
            s: Math.abs(TempsDebut.s - TempsFin.s)
        };

        return this.getChronoTotal(TempsEcoule)
    }



/*
    startTour(couleur){
        let TourPrec = {m:this.Precedent.getMinutes(), s:this.Precedent.getSeconds()}
        this.Precedent = new Date();

        let TempsEcoule = {
            m: Math.abs(TourPrec.m - this.Precedent.getMinutes()),
            s: Math.abs(TourPrec.s - this.Precedent.getSeconds())
        };
        this.Chrono[couleur] = this.addChrono(this.Chrono[couleur], TempsEcoule);
    }
    addChrono(a, b){
        let renvoi = {m:(a.m + b.m), s:(a.s + b.s)};
        
        if(renvoi.s >= 60){
            renvoi.m += 1;
            renvoi.s -= 60;
        }

        return renvoi;
    }*/


    getChronoTotal(Chrono){
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