var server = require('./server');

var onmessage = function(payload) {
};

var onstart = function(node) {
};

/**
 * Create a new miner node and join a peer node.
 */
server.start({
    onstart: onstart,
	onmessage: onmessage,
	join: {
		address: 'localhost',
		port: 8000
	}
});
