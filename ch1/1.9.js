let RpcClient = require("bitcoind-rpc-client");
let client = new RpcClient({
  user: "test",
  pass: "test",
  host: "127.0.0.1",
  port: 12345
});

(async function() {
  let from = "";
  let to = "mung";
  let amount = 5;
  let result = await client.move(from, to, amount);
  let accounts = await client.listAccounts();

  console.log(result);
  console.log(accounts);
})();
