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

/**
 * Example:
 * https://rest.bitcoin.com/v1/address/details/bitcoincash:qzs02v05l7qa5s24srqju498qu55wuj0cx5ehjm2c
 * @returns 
 */
Wallet.protoype.getBalance = function getBalance() {
    return fetch('https://rest.bitcoin.com/v1/address/details/' + this.getDepositAddress()).then(function(res) {
        if(!res.ok) {
            throw new Error('Fetching balance failed. Please, try again later.');
        }
        return res.json();
    }).then(function(details) {
        // console.log('details', details);
        return details.balanceSat + details.unconfirmedBalanceSat;
    });
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