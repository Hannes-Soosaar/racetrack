const SAFE = 1; // Green Flag
const DANGER = 2; // Red Flag
const FINISHED = 3; // checkerboard flag
const NEXT_RACE = 4; // to show in the que as next
const HAZARD = 5; // Yellow Flag
const WAITING = 6; // all races after next
const INACTIVE = 7; // not used
const ACTIVE = 8;
const PROD = false;
const RACE_DURATION = 60000; // one minute
// Mandatory wait time if wrong key
const WAIT = 500;
module.exports = {
	SAFE,
	DANGER,
	FINISHED,
	NEXT_RACE,
	HAZARD,
	WAITING,
	INACTIVE,
	ACTIVE,
	WAIT,
};
