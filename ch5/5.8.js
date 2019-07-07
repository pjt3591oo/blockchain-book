let Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));

let {address, privateKey} = web3.eth.accounts.create()

console.log(address)
console.log(privateKey)