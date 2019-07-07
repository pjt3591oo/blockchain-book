let Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));

web3.personal.newAccount('p', (err, createdAddress) => {
  console.log(createdAddress, err)

  let accounts = web3.eth.accounts
  console.log('============********============')
  console.log(accounts, err)
})