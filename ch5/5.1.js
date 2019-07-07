let Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io')); // main 네트워크로 연결

web3.eth.getBlockNumber((err, blockCount) => {
    console.log(blockCount)
})