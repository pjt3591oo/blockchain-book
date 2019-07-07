let web3;
let compierVersion
let compiler;

const getVersion = () => {
  return new Promise((resolve, reject) => {
    BrowserSolc.getVersions((allVersion, releaseVersion) => {
      console.log(releaseVersion)
      resolve(releaseVersion['0.4.24'])
    })
  })
}

const getCompiler = async (version) => {
  return new Promise((resolve, reject) => {
    BrowserSolc.loadVersion(version, (compiler) => {
      resolve(compiler)
    });
  })
}

const getDeployInfo = () => (
  {
    code :$('#solidity').val(),
    privateKey :$('#private-key').val(),
    account :$('#account').val(),
    gasPrice :$('#gas-price').val(),
    gasLimit :$('#gas-limit').val()
  }
)

const send = (data, privateKey, account, gasPrice, gasLimit) => {
  let gWei = 9
  return new Promise(async (resolve, reject) => {
    let nonce = await web3.eth.getTransactionCount(account, "pending");
    let rawTx = {
      nonce: nonce,
      gas: '0x' + Math.abs(gasLimit).toString(16),
      gasPrice: '0x' + Math.abs(gasPrice * (10 ** gWei)).toString(16),
      data: data,
      from: account
    };
    
    let tx = new ethereumjs.Tx(rawTx)
    let pk = new ethereumjs.Buffer.Buffer(privateKey, 'hex')
    tx.sign(pk)
    let serializedTx = tx.serialize();
    
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
      alert(`https://ropsten.etherscan.io/tx/${hash}`)
      resolve(hash)
    })
  })
}

const deploy = async (compiler) => {
  $("#submit").click(() => {
    let {
      code,      
      privateKey,
      account,
      gasPrice,
      gasLimit,
    } = getDeployInfo()
    try{
      let result = compiler.compile(code, 1)
      
      let contractName = Object.keys(result.contracts).map(contractName => contractName)
      contractName = contractName[0]
      console.log(result)
      let bytecode = result.contracts[contractName].bytecode
      let abi = result.contracts[contractName].interface
      let opcode = result.contracts[contractName].opcode
 
      const Contract = new web3.eth.Contract(JSON.parse(abi.toString()))
      
      let deploy = Contract.deploy({
        data: `0x${bytecode}`,
        arguments: [1]
      }).encodeABI()
      send(deploy, privateKey, account, gasPrice, gasLimit)

    } catch(err) {
      console.log(err)
    }
    
  })
}

window.onload = async () => {
  web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"));
  compierVersion = await getVersion()
  compiler = await getCompiler(compierVersion)
  deploy(compiler)
}