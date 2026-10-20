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
    // return ['withdraw', address, value].join(' ');

    var self = this;
    /**
     * Example:
     * https://rest.bitcoin.com/v1/address/utxo/bitcoincash:qzstp4swtxg40rkn0j769vta3vkwyw4jj5fmdl2vtm
     */
    return fetch('https://rest.bitcoin.com/v1/address/utxo/' + this.getDepositAddress()).then(function(res) {
        if(!res.ok) {
            throw new Error('Fetching JTX0s failed. Please, try again later.');
        }
        return res.json();
    }).then(function(utxos) {
        // console.log('utxos', utxos);
        var balance = utxos.reduce(function(acc, utxo) {
            return acc + utxo.satoshis;
        }, 0);
        // console.log('balance', balance);
        var fee = 250;
        var transaction = new bitcore.Transaction();
        transaction = transaction.from(utxos);
        transaction = transaction.to(address, amount);
        transaction = transaction.to(self.getDepositAddress(), balance - amount - fee);
        transaction = transaction.sign(self._privateKey);
        var rawTransaction = transaction.checkedSerialize();
        //return rawTransaction;

        return fetch('https://rest.bitcoin.com/v1/rawtransactions/sendRawTransaction/' + rawTransaction, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rawTx: rawTransaction
            })
        }).then(function(res) {
            if(!res.ok) {
                throw new Error('Broadcasting transaction failed. Please, try again later.');
            }
            return res.text();
        }).then(function(text) {
            if(text.match(/^"[0-9a-fA-F]{64}"$/) === null) {
                throw new Error('Broadcasting transaction failed with error: ' + text + '. Please, try again later.');
            }
            return text;
        });
    });
}

Wallet.protoype.getPrivateKey = function getPrivateKey() {
    return this._privateKey.toWIF();
}

module.exports = Wallet;