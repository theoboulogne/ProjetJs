
class Chrono{
    constructor(){ 
        this.Precedent = new Date();
        this.Chrono = [{m:0, s:0},{m:0, s:0}]
    }

    startTour(couleur){
        let Tour = new Date();

        let m = Math.abs(tour.getMinutes() - this.Precedent.getMinutes());
        let s = Math.abs(tour.getSecondes() - this.Precedent.getSecondes());

        this.Chrono[couleur].m += m;
        this.Chrono[couleur].s += s;

        if(this.Chrono[couleur].s >= 60){
            this.Chrono[couleur].m += 1;
            this.Chrono[couleur].s -= 60;
        }

        this.Precedent = Tour;
    }

    getChronoTotal(){
        return {m:this.Chrono[0].m + this.Chrono[1].m, s:this.Chrono[0].s + this.Chrono[1].s}
    }
}

module.exports = Chrono;