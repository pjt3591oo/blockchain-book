let Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

web3.personal.newAccount('p', (err, createdAddress) => {
  console.log(createdAddress)
  web3.personal.unlockAccount(createdAddress, 'p')

  web3.eth.sendTransaction({from: createdAddress, to: createdAddress, value: 0}, (err, txHash) => {
    console.log(txHash)
  })
})