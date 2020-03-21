let secret = require('./secret');
let users = ["MuteBard"]
exports.settings = {
    options : {
      debug : true
    },
    connection: {
      cluster: "aws",
      reconnect: true
    },
    identity: {
      username: "CrossingBot_",
      password: secret.security.oauth
    },
    channels: users
  };
  