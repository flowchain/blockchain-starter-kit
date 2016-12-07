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

var RpcUtils = require('../utils');
var RPCMessage = require('./message');

/*
 * Export 'Node' class
 */
if (typeof(module) != "undefined" && typeof(exports) != "undefined")
  module.exports = Node;

function Node(id, server) {
    this.id = id;
    this.address = server.host;
    this.port = server.port;

    this.server = server;

    this._self = this.successor = {
        address: this.address,
        port: this.port,
        id: this.id
    };

    console.info('node id = '+ this.id);
    console.info('successor = ' + JSON.stringify(this.successor));
};

/*
 * To send a RPC operation.
 * @param {Object} from - Sender eg. { address: '127.0.0.1', port: 8000 }
 * @param {Object} memssage - The message to be sent eg. { type: 2, id: 'b283326930a8b2baded20bb1cf5b6358' }
 * @param {Object} to - Receiver eg. { address: '127.0.0.1', port: 8001 }
 */
Node.prototype.send = function(from, message, to) {
    if (typeof to === 'undefined') {
        to = from;
        from = this._self;
    }

    if (typeof message.id === 'undefined') {
        message.id = this.id;
    }

    var packet = {
        from: {
            address: from.address,
            port: from.port,
            id: from.id
        },
        message: message
    };

    return this.server.sendMessage(to, packet);
};

/*
 * @return {boolean}
 */
Node.prototype.join = function(remote) {
    var message = {
        type: RPCMessage.FOUND_SUCCESSOR
    };

    if (RpcUtils.DebugNodeJoin)
        console.info('try to join ' + JSON.stringify(remote));

    // Join
    this.send(remote, message);

    return true;
};

Node.prototype.dispatch = function(from, message) {
    switch (message.type) {
    case RPCMessage.FOUND_SUCCESSOR:
        this.successor = from;
        console.info('new successor = ' + this.successor.id);
        break;

    case RPCMessage.FIND_SUCCESSOR:
        break;

    case RPCMessage.MESSAGE:
        this.send(this.successor, message, from);
        break;

    default:
        console.error('Unknown message: ' + message.type);
        break;
    };
};

/**
 * To serialize a message.
 * @param {Object} message - The message to be serialized.
 * @returns {String} The document (string) of message (JSON object).
 */
Node.prototype.serialize = function(message) {

}

/**
 * To deserialize a message.
 * @param {String} document - The document to be deserialized.
 * @returns {Object} JSON object of the document.
 */
Node.prototype.deserialize = function(document) {

}
