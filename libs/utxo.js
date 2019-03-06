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

function Transaction() {
    // Current version
    this.version = 1;

    // List of transaction inputs
    this.inputs = [];

    // List of transaction outputs
    this.outputs = [];

    // List of witness data
    this.witnesses = [];

    // The coinbase address
    this.conbase = '';

    this.secret = '...FlowchainCoin@@@';
}

Transaction.prototype.setCoinBase = function(address) {
    this.conbase = address;
};

Transaction.prototype.setCoinBaseTx = function() {
    this.txout(50, this.conbase);

    // Imports 50 BTC from output #0 in transaction 
    var previous = this.outputs[0].txid;

    this.txin(previous, 0);
};

Transaction.prototype.txin = function(previous, index) {
    var _tx = {
        // Transaction ID
        txid: '',

        // Previous transaction hash
        previous: previous,

        // Signature
        signature: '',

        // Previous Txout-index
        index: index,

        // Script
        script: function() {
        }
    };

    var txid = crypto.createHmac('sha256', this.secret)
                        .update( JSON.stringify(_tx) )
                        .digest('hex');

    _tx.txid = txid;

    this.inputs.push(_tx);
};


Transaction.prototype.txout = function(value, to) {
    var _tx = {
        // Transaction ID
        txid: '',

        // Previous transaction hash
        value: value,

        // A wallet address
        address: to,

        // Script
        script: function() {}
    };

    var txid = crypto.createHmac('sha256', this.secret)
                        .update( JSON.stringify(_tx) )
                        .digest('hex');

    _tx.txid = txid;

    this.outputs.push(_tx);
};

Transaction.prototype.getTxs = function() {
    return this.outputs.concat(this.inputs);
};

Transaction.prototype.dump = function() {
    console.log('------ Transaction Inputs --------');
    console.log(this.inputs);

    console.log('------ Transaction Outputs --------');
    console.log(this.outputs);        
};

module.exports = Transaction;
