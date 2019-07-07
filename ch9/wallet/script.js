let web3;

const getInfo = () => (
  {
    fromPrivateKey: $('#from-private-key').val(),
    fromAccount: $('#from-account').val(),
    toAccount: $('#to-account').val(),
    value: $('#value').val(),
    gasPrice: parseInt($('#gas-price').val())
  }
)

const sendTransaction = () => {
  const gasLimit = 21000
  const gWei = 9
  $('#submit').click( async () => {
    const {
      fromPrivateKey,
      fromAccount,
      toAccount,
      value,
      gasPrice
    } = getInfo()
    
    let nonce = await web3.eth.getTransactionCount(fromAccount, "pending");
   
    let rawTx = {
      nonce: nonce,
      gas: web3.utils.toHex(gasLimit),
      gasPrice: web3.utils.toHex(gasPrice * (10 ** gWei)),
      from: fromAccount,
      to: toAccount,
      value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
      data: ''
    };
    let tx = new ethereumjs.Tx(rawTx)
    let pk = new ethereumjs.Buffer.Buffer(fromPrivateKey, 'hex')

    tx.sign(pk)
    let serializedTx = tx.serialize();
    
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
      alert(`https://ropsten.etherscan.io/tx/${hash}`)
    })
  })
}

const createWallet = () => {
  $('#create-wallet').click(() => {
    let createdAccount = web3.eth.accounts.create()
    console.log(createdAccount)
    alert(`
    지갑생성 완료!
    Private Key: ${createdAccount.privateKey}
    account: ${createdAccount.address}
    `)
    // keystore 생성: web3.eth.accounts.encrypt("PRIVATE", 'PASSWORD')
    // keystore 복구 web3.eth.accounts.encrypt("키슽토어 내용", 'PASSWORD')
  })
}

window.onload = async () => {
  web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"));
  sendTransaction()
  createWallet()
}