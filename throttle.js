const _ = require("lodash");

function go(counter) {
	console.log("counter " + counter)
}

const throttled = _.throttle(go, 5)

for (let index = 0; index < 300000; index++) {
	throttled(index);	
}