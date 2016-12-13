var server = require('./server');
var Miner = require('./libs/mining');

var onmessage = function(payload) {
};

var onstart = function(node) {
    var block = require('./libs/genesis');

    console.log('----- Genesis Block -----');
    console.log( JSON.stringify(block) );

    console.log('----- Start mining -----');
    var miner = new Miner();

    miner.setTransactions(['a', 'b', 'c']);
    miner.setPreviousBlock(block);

    setTimeout(function(){
        miner.generateHash();

        if (miner.isSuccess()) {
            block = miner.getNewBlock();
            miner.setPreviousBlock(block);

            console.log('Difficulty: ' + block.difficulty)
            console.log('Block #' + block.no + ': ' + block.hash);
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
