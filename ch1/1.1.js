let RpcClient = require("bitcoind-rpc-client");
let client = new RpcClient({
  user: "test",
  pass: "test",
  host: "127.0.0.1",
  port: 12345
});
