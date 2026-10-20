var Wallet = require('./wallet');

// console.log('Hi');
// console.log('Hello');

var STORAGE_KEY_PRIVATE_KEY = 'bchwalletla:privateKey';
// var wallet                  = new Wallet('L24vYPaqmL4iWZEeDu3bqJssu5hqLnbFVUrkXxLQxrM4UKwAYAEg');
var wallet;
if(localStorage.getItem(STORAGE_KEY_PRIVATE_KEY) === null) {
    wallet = new Wallet();
    localStorage.setItem(STORAGE_KEY_PRIVATE_KEY, wallet.getPrivateKey());
} else {
    wallet = new Wallet(localStorage.getItem(STORAGE_KEY_PRIVATE_KEY));
}
// console.log('Hi');

var balanceDisplay        = document.getElementById("balance-display");
var depositAddressDisplay = document.getElementById("deposit-address-display");
var withdrawalForm        = document.getElementById("withdrawal-form");
var withdrawalAddress     = document.getElementByName("withdrawal-address").item(0);
var withdrawalAmount      = document.getElementByName("withdrawal-amount").item(0);
var importForm            = document.getElementById("import-form");
var privateKey            = document.getElementByName("private-key").item(0);
var exportButton          = document.getElementById("export-button");
var privateKeyDisplay     = document.getElementById("private-key-display");

wallet.getBalance().then(function(balance) {
    balanceDisplay.innerText = balance;
}).catch(function(err) {
    // alert(err.message || err.title || 'Unexpected error.');
    handleError(err);
});
// balanceDisplay.innerText = wallet.getBalance();

depositAddressDisplay.innerText = wallet.getDepositAddress();

withdrawalForm.addEventListener('submit', function(event) {
    event.preventDefault();
    var withdrawalAddressValue = withdrawalAddress.value.trim();
    var withdrawalAmountValue = +withdrawalAmount.value;
    wallet.withdraw(withdrawalAddressValue, withdrawalAmountValue).then(function(txId) {
        alert(['Transaction ID:', txId].join(' '));
        window.location.reload();
    }).catch(function(err) {
        // alert(err.message || err.title || 'Unexpected error.');
        handleError(err);
    });
    // var txId = wallet.withdraw(withdrawalAddress.value, withdrawalAmount.value);
    // alert(['Transaction ID:', txId].join(' '));
});

importForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // alert("privateKey", privateKey.value);
    var privateKeyValue = privateKey.value.trim();
    localStorage.setItem(STORAGE_KEY_PRIVATE_KEY, privateKeyValue);
    privateKey.value = '';
    window.location.reload();
});

exportButton.addEventListener('click', function() {
    if(privateKeyDisplay.innerText === "(hidden)") {
        privateKeyDisplay.innerText = wallet.getPrivateKey();
    } else {
        privateKeyDisplay.innerText = '(hidden)';
    }
});

function handleError(err) {
    alert(err.message || err.title || 'Unexpected error.');    
}