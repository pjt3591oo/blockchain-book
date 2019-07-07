let Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));

var filter = web3.eth.filter('latest');

// 노드에 block 생성시 콜백함수 실행
filter.watch(function(error, result){
    console.log(error)
    console.log(result)
    // var block = web3.eth.getBlock(result, true);
    // console.log('current block #' + block.number);
    // console.log('current block info' + JSON.stringify(block));
});