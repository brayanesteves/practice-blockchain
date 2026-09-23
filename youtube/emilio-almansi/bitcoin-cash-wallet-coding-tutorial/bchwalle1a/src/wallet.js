var bitcore = require('bitcore-lib-cash');
var fetch = require('whatwg-fetch').fetch;

function Wallet () {
    console.log('Constructing a Wallet.');
    console.log('bitcore', bitcore);
    console.log('fetch', fetch);
}

module.exports = Wallet;