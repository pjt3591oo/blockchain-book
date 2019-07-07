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

// 컨트랙트 호출
Contract.methods.var1().call().then( data => {
  console.log(`컨트랙트에서 var1 변수조회: ${data}`)
});