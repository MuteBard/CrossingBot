let UPDATE_USER_HOME_SET_CROSSINGBOT = (username, added) =>
`mutation{
    isCrossingBotAdded(username : ${"\""+username+"\""}, added : ${added})
}`

let CREATE_USER = (username, id, avatar, addedToChannel) =>
`mutation{
    createUser(username : ${"\""+username+"\""}, id : ${"\""+id+"\""}, avatar : ${"\""+avatar+"\""}, addedToChannel : ${"\""+addedToChannel+"\""})
}`

let CATCH_REQUEST = (username, species) =>
`mutation{
     catchCreature(username : ${"\""+username+"\""}, species : ${"\""+species+"\""})
}`
let COMPLETE_USER_CREATION  = (username, id, avatar) =>
`mutation{ 
    finalizeUserCreation (username : ${"\""+username+"\""}, id : ${id}, avatar : ${"\""+avatar+"\""})
}`
let SELL_ONE_CREATURE = (username, species, creatureName) => 
`mutation{ 
    sellOneCreature(username : ${"\""+username+"\""}, species : ${"\""+species+"\""}, creatureName : ${"\""+creatureName+"\""})
}`

let SELL_ALL_CREATURES = (username) => 
`mutation{ 
    sellAllCreatures(username : ${"\""+username+"\""})
}`
let ACKNOWLEDGE_TRANSACTION = (username, business, quantity, marketPrice, totalBells) => 
`mutation{ 
    acknowledgeTransaction(username : ${"\""+username+"\""}, business: ${"\""+business+"\""}, quantity: ${quantity}, marketPrice: ${marketPrice}, totalBells: ${marketPrice})
}`

module.exports.CREATE_USER = CREATE_USER
module.exports.UPDATE_USER_HOME_SET_CROSSINGBOT = UPDATE_USER_HOME_SET_CROSSINGBOT
module.exports.CATCH_REQUEST = CATCH_REQUEST
module.exports.COMPLETE_USER_CREATION  = COMPLETE_USER_CREATION 
module.exports.SELL_ONE_CREATURE  = SELL_ONE_CREATURE 
module.exports.SELL_ALL_CREATURES = SELL_ALL_CREATURES
module.exports.ACKNOWLEDGE_TRANSACTION = ACKNOWLEDGE_TRANSACTION
