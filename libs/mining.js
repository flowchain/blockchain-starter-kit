/**
 *
 * The MIT License (MIT)
 *
 * http://block0.org
 *
 * Copyright (c) 2016-present Jollen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

'use strict';

var crypto = require('crypto');
var merkle = require('merkle');
var merkleRoot = merkle('sha256');
var Block = require('./block');

function Miner() {
    // Transactions to be mined.
    this.txs = [];

    // Previous block.
    this.previousBlock = {};

    // New block.
    this.newBlock = new Block();

    // Secret
    this.secret = 'Block0';

    // is success
    this._success = false;

    // Merkle tree
    this._tree = [];
}

Miner.prototype.setTransactions = function(txs) {
    this.txs = txs;

    this._tree = merkleRoot.sync(this.txs);
    this.newBlock.merkleRoot = this._tree.level(0)[0];
};

Miner.prototype.setPreviousBlock = function(block) {
    this.previousBlock = block;

    this.newBlock.previousHash = this.previousBlock.hash;
    this.newBlock.nonce = this.previousBlock.nonce + 1;
    this.newBlock.difficulty = this.previousBlock.difficulty;
    this.newBlock.no = this.previousBlock.no + 1;
};

Miner.prototype.generateHash = function() {
    // The header of the new block.
    var header = {
        nonce: this.newBlock.nonce,
        previousHash: this.newBlock.previousHash,
        merkleRoot: this.newBlock.merkleRoot,
        timestamp: this.newBlock.timestamp
    };

    var hash = crypto.createHmac('sha256', this.secret)
                        .update( JSON.stringify(header) )
                        .digest('hex');

    this.newBlock.hash = crypto.createHmac('sha256', hash)
                        .update('powered by flowchain')
                        .digest('hex');
    
    //console.log(this.newBlock.nonce + '> ' + this.newBlock.hash);

    this.newBlock.nonce++;
    this._success = ( this.newBlock.hash < this.newBlock.difficulty );

    return this.newBlock.hash;
};


Miner.prototype.isSuccess = function() {
    return this._success;
};

Miner.prototype.getNewBlock = function() {
    if (this._success === true) {
        this._fixDifficulty();
        return this.newBlock;
    }
    return null;
};

Miner.prototype.getNonce = function() {
    return this.newBlock.nonce;
};


/**
 * The new difficulty
 */
Miner.prototype._fixDifficulty = function() {
    var key = this.previousBlock.difficulty;
    var index = key.length;

    key = '0' + key.slice(0, index - 1);
    this.newBlock.difficulty = key;
};

module.exports = Miner;
