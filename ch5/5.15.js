let Web3 = require("web3");

let web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

web3.eth.getTransaction('0xa2ebf25ef144056b5d24856b0d16d7421a8412f83c830f574ced2d6c2e205109', (err, txInfo) => {
  console.log(txInfo)
})