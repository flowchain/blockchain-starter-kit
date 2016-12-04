var config = require('../config.js');
var Block = require('./block');

var genesis = new Block(config.genesis);

module.exports = genesis;