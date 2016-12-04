/*
 * 建立 Genesis Block
 */
var genesisBlock = require('./src/genesis');

/*
 * 建立新的 Merkle Tree
 */
var merkle = require('merkle');
var merkleRoot = merkle('sha256');

// 建立一筆新的交易紀錄
var tx = ['Created by Jollen'];

merkleRoot.async(tx, function(err, tree){
    // 取得 Merkle Root 的 Hash
    genesisBlock.merkleRoot = tree.level(0)[0];

    // 印出所有的 Hashes
    for (i = 0; i < tree.levels(); i++) {
        console.log( tree.level(i) );
    }

    // 印出 Genesis Block 內容
    console.log(genesisBlock);
});
