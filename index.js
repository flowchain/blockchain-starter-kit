var crypto = require('crypto');

var server = require('./server');
var Miner = require('./libs/mining');
var Transaction = require('./libs/utxo');

// Import genesis block
var block = require('./libs/genesis');

// Create a new miner and start to mine
var miner = new Miner();
var utxo = new Transaction();

var onmessage = function(payload) {
};

var onstart = function(node) {
    console.log('----- Genesis Block -----');
    console.log( JSON.stringify(block) );

    console.log('----- Start mining -----');
    //miner.setTransactions(['a', 'b', 'c']);
    miner.setPreviousBlock(block);

    utxo.setCoinBase('axEj265EB');

    // Start to generate a hash
    setInterval(function() {
        miner.generateHash();

        // A success hash is generated
        if (miner.isSuccess()) {
            block = miner.getNewBlock();
            miner.setPreviousBlock(block);

            utxo.setCoinBaseTx();

            // Include non-coinbase transactions
            utxo.txout(5, 'ytQw782VN');
            utxo.txout(1, 'ytQw782VN');
            utxo.txout(2, 'ytQw782VN');
            utxo.txout(8, 'ytQw782VN');

            miner.setTransactions( utxo.getTxs() );

            utxo.dump();
            miner.dumpMerkleTree();

            console.log('Difficulty: ' + block.difficulty)
            console.log('Block #' + block.no + ': ' + block.hash);
            console.log(block);

            console.log('\n\n\n\n');
        }
    }, 100);
};

/**
 * Create a mining node.
 */
server.start({
    onstart: onstart,
	onmessage: onmessage,
});
