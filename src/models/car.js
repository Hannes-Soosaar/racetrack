class Car {

	constructor(row) {
		Object.assign(this, row)
	}
}
// 	constructor(
// 		id,
// 		driver_id,
// 		name,
// 		number,
// 		race_lap,
// 		current_lap_time,
// 		best_lap_time,
// 		race_elapse_time,
// 		status
// 	) {
// 		this.id = id;
// 		this.driver_id = driver_id;
// 		this.name = name;
// 		this.number = number;
// 		this.race_lap = race_lap;
// 		this.current_lap_time = current_lap_time;
// 		this.best_lap_time = best_lap_time;
// 		this.race_elapse_time = race_elapse_time;
// 		this.status = status;
// 	}
// }

module.exports = Car;
