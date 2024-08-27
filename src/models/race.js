// A race has participating cars.

//? How could we map an object
class Race {
	constructor(
		id,
		created,
		car_1_id,
		car_2_id,
		car_3_id,
		car_4_id,
		car_5_id,
		car_6_id,
		car_7_id,
		car_8_id,
		status
	) {
		this.id = id;
		this.created = created;
		this.car_1_id = car_1_id;
		this.car_2_id = car_2_id;
		this.car_3_id = car_3_id;
		this.car_4_id = car_4_id;
		this.car_5_id = car_5_id;
		this.car_6_id = car_6_id;
		this.car_7_id = car_7_id;
		this.car_8_id = car_8_id;
		this.status = status;
	}
}
module.exports = Race;
