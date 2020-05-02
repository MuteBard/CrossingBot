exports.CATCH_REQUEST = (username, species) =>
`mutation{
     catchCreature(username : ${"\""+username+"\""}, species : ${"\""+species+"\""})
}`
exports.COMPLETE_USER_CREATION  = (username, id, avatar) =>
`mutation{ 
    finalizeUserCreation (username : ${"\""+username+"\""}, id : ${id}, avatar : ${"\""+avatar+"\""})
}`
exports.SELL_ONE_CREATURE = (username, species, creatureName) => 
`mutation{ 
    sellOneCreature(username : ${"\""+username+"\""}, species : ${"\""+species+"\""}, creatureName : ${"\""+creatureName+"\""})
}`

exports.SELL_ALL_CREATURES = (username) => 
`mutation{ 
    sellAllCreatures(username : ${"\""+username+"\""})
}`
exports.ACKNOWLEDGE_TRANSACTION = (username) => 
`mutation{ 
    acknowledgeTransaction(username : ${"\""+username+"\""})
}`

