var bitcore = require('bitcore-lib-cash');
var fetch = require('whatwg-fetch').fetch;

function Wallet (privateKey) {
    // console.log('Constructing a Wallet.');
    // console.log('bitcore', bitcore);
    // console.log('fetch', fetch);

    if(privateKey !== undefined) {
        this._privateKey = bitcore.PrivateKey.fromWIF(privateKey);
    } else {
        this._privateKey = new bitcore.PrivateKey();
    }    
}

Wallet.protoype.getBalance = function getBalance() {
    return 'getBalance';
}

Wallet.protoype.getDepositAddress = function getDepositAddress() {
    return this._privateKey.toPublicKey().toAddress().toString();
}

Wallet.protoype.withdraw = function withdraw(address, value) {
    return ['withdraw', address, value].join(' ');
}

Wallet.protoype.getPrivateKey = function getPrivateKey() {
    return this._privateKey.toWIF();
}

module.exports = Wallet;