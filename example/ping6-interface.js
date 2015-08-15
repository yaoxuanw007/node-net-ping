
var ping = require ("../");

var printUsage = function () {
	console.log ("usage: node ping [-I <interface>] <target> [<target> ...]");
}

if (process.argv.length < 3) {
	printUsage();
	process.exit (-1);
}

var targets = [],
		interface = null;

for (var i = 2; i < process.argv.length; i++) {
	if (process.argv[i] === '-I') {
		i++;
		if (i < process.argv.length) {
			interface = process.argv[i];
		} else {
			printUsage();
			process.exit (-1);
		}
	} else {
		targets.push (process.argv[i]);
	}
}

var options = {
	networkProtocol: ping.NetworkProtocol.IPv6,
	retries: 1,
	timeout: 2000,
	interface: interface
};

var session = ping.createSession (options);

session.on ("error", function (error) {
	console.trace (error.toString ());
});

for (var i = 0; i < targets.length; i++) {
	session.pingHost (targets[i], function (error, target) {
		if (error)
			if (error instanceof ping.RequestTimedOutError)
				console.log (target + ": Not alive");
			else
				console.log (target + ": " + error.toString ());
		else
			console.log (target + ": Alive");
	});
}
