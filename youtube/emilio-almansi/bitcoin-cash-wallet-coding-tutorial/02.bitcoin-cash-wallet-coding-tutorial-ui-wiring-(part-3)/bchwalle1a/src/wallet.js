var bitcore = require('bitcore-lib-cash');
var fetch = require('whatwg-fetch').fetch;

function Wallet () {
    console.log('Constructing a Wallet.');
    // console.log('bitcore', bitcore);
    // console.log('fetch', fetch);
}

Wallet.protoype.getBalance = function getBalance() {
    return 'getBalance';
}

Wallet.protoype.getDepositAddress = function getDepositAddress() {
    return 'getDepositAddress';
}

Wallet.protoype.withdraw = function withdraw(address, value) {
    return ['withdraw', address, value].join(' ');
}

Wallet.protoype.getPrivateKey = function getPrivateKey() {
    return 'getPrivateKey';
}

module.exports = Wallet;