let Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

web3.eth.getBalance('0xca464f86b3a857e615746949ab4422ee10aaaa03', (err, balanceOf)=> {
  console.log(balanceOf)
})

/* sync 형태로 처리
let balanceOf = web3.eth.getBalance('0xca464f86b3a857e615746949ab4422ee10aaaa03')

balanceOf.then((result) => console.log(result))
*/