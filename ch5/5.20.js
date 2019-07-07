let Web3 = require('web3');

const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'));

let ABI = [
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
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "var1",
				"type": "string"
			}
		],
		"name": "E_SetString",
		"type": "event"
	},
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
	}
]

let CA = "0xc04d0fa9fbd6303c748663968fc0686135f38944"
let Contract = new web3.eth.Contract(ABI, CA)

Contract.events.E_SetString().on('data', (event) => {
  console.log(`data set: `)
  console.log(event)

  console.log(`필요 데이터 추출: `)
  console.log(event.returnValues)
})