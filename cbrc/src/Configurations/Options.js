let secret = require('./Secrets');
  
exports.settings = {
  headers: {
      "Client-ID": secret.security.TWITCH_CLIENT_ID,
      "Accept" : "application/vnd.twitchtv.v5+json",
      "Authorization" : secret.security.ACCESS_TOKEN
  },
}