//<Operation>_<Collection>_<Component>_*

let UPDATE_USER_CATCH_CATCH_ONE = (username, species) =>
`mutation{
    catchCreature(username : ${"\""+username+"\""}, species : ${"\""+species+"\""})
}`

let UPDATE_USER_CATCH_SELL_ONE = (username, species, creatureName) =>
`mutation{ 
    sellOneCreature(username : ${"\""+username+"\""}, species : ${"\""+species+"\""}, creatureName : ${"\""+creatureName+"\""})
}`

let UPDATE_USER_CATCH_SELL_BUGS = (username) =>
`mutation{ 
    sellAllBugs(username : ${"\""+username+"\""})
}`

let UPDATE_USER_CATCH_SELL_FISHES = (username) =>
`mutation{ 
    sellAllFishes(username : ${"\""+username+"\""})
}`

let UPDATE_USER_MARKET_TRANSACTION = (username, business, quantity, marketPrice, totalBells) => 
`mutation{ 
    acknowledgeTransaction(username : ${"\""+username+"\""}, business: ${"\""+business+"\""}, quantity: ${quantity}, marketPrice: ${marketPrice}, totalBells: ${totalBells})
}`

module.exports.UPDATE_USER_CATCH_CATCH_ONE = UPDATE_USER_CATCH_CATCH_ONE
module.exports.UPDATE_USER_CATCH_SELL_ONE = UPDATE_USER_CATCH_SELL_ONE
module.exports.UPDATE_USER_CATCH_SELL_BUGS = UPDATE_USER_CATCH_SELL_BUGS
module.exports.UPDATE_USER_CATCH_SELL_FISHES = UPDATE_USER_CATCH_SELL_FISHES
module.exports.UPDATE_USER_MARKET_TRANSACTION = UPDATE_USER_MARKET_TRANSACTION 

