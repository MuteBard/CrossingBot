let secret = require('./secret');
let users = ["MuteBard"]
exports.settingsA = {
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
  
  exports.settingsB = {
    headers: {
        "Accept" : "application/vnd.twitchtv.v5+json",
        "Client-ID": secret.security.oauth2
    },
  }