var server = require('./server');
var Miner = require('./libs/mining');

// Import genesis block
var block = require('./libs/genesis');

// Create a new miner and start to mine
var miner = new Miner();

var onmessage = function(payload) {
};

var onstart = function(node) {
    console.log('----- Genesis Block -----');
    console.log( JSON.stringify(block) );

    console.log('----- Start mining -----');
    miner.setTransactions(['a', 'b', 'c']);
    miner.setPreviousBlock(block);

    // Start to generate a hash
    setInterval(function() {
        miner.generateHash();

        // A success hash is generated
        if (miner.isSuccess()) {
            block = miner.getNewBlock();
            miner.setPreviousBlock(block);

            console.log('Difficulty: ' + block.difficulty)
            console.log('Block #' + block.no + ': ' + block.hash);
        }
    }, 10);
};

/**
 * Create a mining node.
 */
server.start({
    onstart: onstart,
	onmessage: onmessage,
});
