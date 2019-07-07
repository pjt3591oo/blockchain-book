let Web3 = require('web3');
const Tx = require("ethereumjs-tx");

let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));

let ABI = [
	{
		"constant": true,
		"inputs": [],
		"name": "var1",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_var1",
				"type": "string"
			}
		],
		"name": "setString",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

let CA = "0x72d6814a5f5cddab4a5afba935b16660bf178a93"

// 컨트랙트 객체생성
let Contract = new web3.eth.Contract(ABI, CA)

let EOA1 = "0x7515a34181f944f29074cd3f4652a9c84af9571e"
let PRIVATE_KEY = "52CF1A30CD0E6F0FEF16590DD1A042D236257331182365E14186156745CDCF91"

// 실행할 bytecode 추출
let setStringExec = Contract.methods.setString("안녕하세요!!!")
let setStringByteCode = setStringExec.encodeABI() // 바이트 코드 추출

const GWei = 9;
const unit = 10 ** GWei;
const gasLimit = 221000;
const gasPrice = 21 * unit;

web3.eth.getTransactionCount(EOA1, "pending", (err, nonce) => {
  
  let rawTx = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    data: setStringByteCode,
    from: EOA1,
    to: CA
  };

  let privateKey = new Buffer.from(PRIVATE_KEY, "hex");

  let tx = new Tx(rawTx);
  tx.sign(privateKey);

  let serializedTx = tx.serialize();

  web3.eth
    .sendSignedTransaction("0x" + serializedTx.toString("hex"), (err, txHash) => {
      console.log(txHash)
    })
});