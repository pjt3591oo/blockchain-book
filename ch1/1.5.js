let RpcClient = require("bitcoind-rpc-client");
let client = new RpcClient({
  user: "test",
  pass: "test",
  host: "127.0.0.1",
  port: 12345
});

(async function() {
  let blockHash = await client.generate(1);
  console.log(blockHash);

  let blockNumber = await client.getBlock(blockHash.result[0]);
  console.log(blockNumber);
})();
