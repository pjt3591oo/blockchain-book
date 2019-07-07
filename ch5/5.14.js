let Web3 = require("web3");
const Tx = require("ethereumjs-tx");

let web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

let EOA1 = "0xa22e6815158892bdbf6e06c595cb114f445b5d4a"
let privateKey1 = "28101326da3219f81085f42225d191e8bd3c743f53dec9b12a8e85625f4226a3"

let EOA2 = "0x6d79b54bf747d99e0c1b61cd80d30d7687aefec6"

const GWei = 9;
const unit = 10 ** GWei;
const gasLimit = 21000;
const gasPrice = 21 * unit;

web3.eth.getTransactionCount(EOA1, "pending", (err, nonce) => {
  
  let allEth = 5000000000000000000;

  let rawTx = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    value: allEth,
    from: EOA1,
    to: EOA2
  };

  let privateKey = new Buffer.from(privateKey1, "hex");

  let tx = new Tx(rawTx);
  tx.sign(privateKey);

  let serializedTx = tx.serialize();
  let receipt = null;

  web3.eth
    .sendSignedTransaction("0x" + serializedTx.toString("hex"), (err, txHash) => {
      console.log(txHash)
      web3.eth.getBalance(EOA1, (err, balanceOfEOA1) => {
        web3.eth.getBalance(EOA2, (err, balanceOfEOA2) => {
          console.log(`balance of EOA1 :${balanceOfEOA1}`)
          console.log(`balance of EOA2 :${balanceOfEOA2}`)
        })
      })
    })
    
});