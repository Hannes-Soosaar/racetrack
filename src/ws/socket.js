// const socket = require('socket.io');

// let io;

// function initSocket(server){

//     io= socket(server)
//     io.on("connection", (socket) => {


// 	// Handle roll validation Why is the roll validation running 


//     	socket.on("validate-key", ({ key, role }) => {
// 		let validKey = false;
// 		if (role === "receptionist" && key === process.env.RECEPTIONIST_KEY) {
// 			validKey = true;
// 		} else if (role === "safety" && key === process.env.SAFETY_KEY) {
// 			validKey = true;
// 		} else if (role === "observer" && key === process.env.OBSERVER_KEY) {
// 			validKey = true;
// 		}
// 		console.log(`Key validation result: ${validKey}`);
// 		socket.emit("key-validation", { success: validKey });

// 		if (validKey) {
// 			if (role === "receptionist") {
// 				frontDesk(io, socket);
// 			} else if (role === "safety") {
// 				raceControl(io, socket);
// 			} else if (role === "observer") {
// 				lapLineTracker(io, socket);
// 			}
// 		}
// 	});


// });

// }
// export 