
// !NOT IN USE we should use a map or sorted list of a race object.

class RaceResult {
	constructor(id, driver_id, race_id, place,time) {
		this.id = id;
		this.driver_id = driver_id;
		this.race_id= race_id;
        this.place = place;
        this.time = time;
	}
}
module.exports = RaceResult;
