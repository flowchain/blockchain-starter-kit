var merkle = require('merkle');
var merkleRoot = merkle('sha256');

// 建立一筆新的交易紀錄
var tx = ['a', 'b', 'c', 'd'];

merkleRoot.async(tx, function(err, tree){
    // 印出所有節點
    for (i = 0; i < tree.levels(); i++) {
        console.log( tree.level(i) );
    }
});
