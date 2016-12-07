var crypto = require('crypto');
var merkle = require('merkle');
var merkleRoot = merkle('sha256');

// Secret
var secret = 'Dummy Blockchain';

// Unverified pool
var tx = ['Created by Jollen'];

merkleRoot.async(tx, function(err, tree){
    // Merkle Root 的 Hash
    var hashMerkleRoot = tree.level(0)[0];
    var nonce = 0;

    var hash = function(nonce) {
	    var header = {
			nonce: nonce,
			previousHash: 'dd0e2b79d79be0dfca96b4ad9ac85600097506f06f52bb74f769e02fcc66dec6',
			merkleRoot: hashMerkleRoot
	    };

		var hash1 = crypto.createHmac('sha256', secret)
							.update( JSON.stringify(header) )
							.digest('hex');

		var hash2 = crypto.createHmac('sha256', hash1)
							.update('powered by flowchain')
							.digest('hex');

		return hash2;
    };

    while (1) {
    	var id = hash(nonce++);
    	console.log(nonce + ': ' + id);
		if (id < '0000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF') {
			console.log('success: ' + id);
			break;
		}
    }
});
