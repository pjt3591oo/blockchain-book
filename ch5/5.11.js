let Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));

web3.eth.getBlock(1, (err, blockInfo) => {
  console.log(blockInfo)
})

/* sync 형태로 처리
let blockInfo = web3.eth.getBlock(1)

blockInfo.then(bi => console.log(bi))
*/