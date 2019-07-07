let Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));

web3.eth.getBlockNumber((err, blockNumber) => {
  console.log(blockNumber)
})

/* sync 형태로 처리
let blockNumber = web3.eth.getBlockNumber()

blockNumber.then(bn => console.log(bn))
*/
