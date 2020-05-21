let UPDATE_USER_CATCH_CATCH = (username, species) =>
`mutation{
    catchCreature(username : ${"\""+username+"\""}, species : ${"\""+species+"\""})
}`

let UPDATE_USER_CATCH_SELL = (username, species, creatureName) =>
`mutation{ 
    sellOneCreature(username : ${"\""+username+"\""}, species : ${"\""+species+"\""}, creatureName : ${"\""+creatureName+"\""})
}`

let UPDATE_USER_MARKET_TRANSACTION = (username, business, quantity, marketPrice, totalBells) => 
`mutation{ 
    acknowledgeTransaction(username : ${"\""+username+"\""}, business: ${"\""+business+"\""}, quantity: ${quantity}, marketPrice: ${marketPrice}, totalBells: ${totalBells})
}`

module.exports.UPDATE_USER_CATCH_CATCH = UPDATE_USER_CATCH_CATCH
module.exports.UPDATE_USER_CATCH_SELL = UPDATE_USER_CATCH_SELL 
module.exports.UPDATE_USER_MARKET_TRANSACTION = UPDATE_USER_MARKET_TRANSACTION 

