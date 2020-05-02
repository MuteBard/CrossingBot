let secret = require('./secret');
let users = ["#MuteBard"]
exports.settingsA = {
    options : {
      debug : false,
      clientId : "6pvu20x774z6ztsejol3wrzy9yfpvd"
    },
    connection: {
      reconnect: true,
      secure: true
    },
    identity: {
      username: "crossingbot_",
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