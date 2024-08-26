
class Car {
    constructor (id, name, number,race_lap,current_lap_time,best_lap_time, race_elapse_time,status){
        this.id=id;
        this.name = name;
        this.number= number;
        this.race_lap= race_lap;
        this.current_lap_time= current_lap_time;
        this.best_lap_time = best_lap_time;
        this.race_elapse_time = race_elapse_time;
        this.status = status;
    }
}

module.exports = Car;