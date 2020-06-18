var ENV = process.env.NODE_ENV;

var config = {
  host: "localhost",
  protocol: "http",
  wsprotocol: "ws"
}

if(ENV == "server") {
  config = {
    host: "www.newasai.com",
    protocol: "https",
    wsprotocol: "wss"
  }
}

export default config;
