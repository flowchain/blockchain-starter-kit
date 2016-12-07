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

/*
 * Module dependencies.
 */
var http = require("http")
  , WebSocketServer = require('websocket').server
  , EventEmitter = require('events').EventEmitter
  , util = require('util');

/**
 * Expose `WebsocketBroker` constructor.
 */
if (typeof(module) != "undefined" && typeof(exports) != "undefined") {
  exports = module.exports = WebsocketBroker;
}

/**
 * Initialize a new `WebsocketBroker` with the given `options`.
 *
 * @param {Object} options
 * @api private
 */
function WebsocketBroker(options) {
  // Superclass Constructor
  EventEmitter.call(this);

  options = options || {};
  this.clientsPath = [];
  this.host = options.host || 'localhost';
  this.port = options.port || 8000;
  this.endpoint = options.endpoint || 'wot.city';
}

util.inherits(WebsocketBroker, EventEmitter);

/**
 * Initialize a new `WebsocketBroker` with the given `options`.
 *
 * @param {Object} request
 * @param {Object} response
 * @api private
 */
WebsocketBroker.prototype.onRequest = function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end();
};

/**
 * Start websocket server.
 *
 * @param {Object} route
 * @return {}
 * @api public
 */
WebsocketBroker.prototype.start = function(route, handlers) {
  var self = this;

  // arguments to child processes
  var port = self.port || process.env['PORT'];
  var host = self.host || process.env['HOST'];
  var endpoint = self.endpoint || process.env['ENDPOINT'];

  var server = http.createServer(this.onRequest).listen(port, host, function() {
      console.info('node is running at ws://' + self.host + ':' + self.port);
  });

  var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  });

  /**
   * handlers
   */
  var onWsRequest = function(request) {
    var connection = request.accept('', request.origin);

    route(request.resource, connection, handlers, self.clientsPath);

    connection.on('message', onWsConnMessage);
    connection.on('close', onWsConnClose);
  };

  var onWsConnMessage = function(message) {
    // Dispatching request message
    self.emit('data', {
      data: message.utf8Data,
      pathname: this.pathname
    });
  };

  var onWsConnect = function(webSocketConnection) {
  };

  var onWsConnClose = function(reasonCode, description) {
  };

  wsServer.on('request', onWsRequest);
  wsServer.on('connect', onWsConnect);
};
