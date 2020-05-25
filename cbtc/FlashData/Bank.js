const Route = require('../Controller/Route')

var bugBank = []
var fishBank = []
var usernames = []
var pendingTurnipTransactionDictionary = {}


let supplyPendingTurnipTransactionDictionary = (data) => {
    pendingTurnipTransactionDictionary = Object.assign(pendingTurnipTransactionDictionary, data)
}

let retrivePendingTurnipTransactionDictionary = () =>{
    return pendingTurnipTransactionDictionary
}


let deleteUserFromPendingTransactionDictionary = (username) => {
    delete pendingTurnipTransactionDictionary[username]
}

let updateUserInPendingTransactionDictionary = (username, marketPrice, totalBells) => {
    let data = pendingTurnipTransactionDictionary[username]   
    data["marketPrice"] = marketPrice
    data["totalBells"] = totalBells
    let authorizedTurnipTransaction = {}
    authorizedTurnipTransaction[username] = data
    deleteUserFromPendingTransactionDictionary(username)
    supplyPendingTurnipTransactionDictionary(authorizedTurnipTransaction)
}


supplyBankWithCreatures = () => {
    
    let supplyBankWithBugs = () => {
        let CBTC_DataBank = (response) => {
            bugBank = response.getAllBugs
            module.exports.bugBank = bugBank
            supplyBankWithFishes()
        }
        Route.queryAllBugs(CBTC_DataBank)
    }
    
    
    let supplyBankWithFishes = () => {
        let CBTC_DataBank = (response) => {
            fishBank = response.getAllFishes
            module.exports.fishBank = fishBank
        }
        Route.queryAllFishes(CBTC_DataBank)
    }

    supplyBankWithBugs()
} 

supplyBankWithAddedUsers = (callback) => {
    let CBTC_DataBank = (response) => {
        usernames = response.getUsersWithCBAdded.map(user => `#${user.username}`)
        module.exports.usernames = usernames 
        if(callback != null){
            callback()
        }
    }
    Route.queryAllAddedUsers(CBTC_DataBank)
}



supplyBankWithCreatures(null)
supplyBankWithAddedUsers(null)


module.exports.supplyPendingTurnipTransactionDictionary = supplyPendingTurnipTransactionDictionary
module.exports.retrivePendingTurnipTransactionDictionary = retrivePendingTurnipTransactionDictionary
module.exports.deleteUserFromPendingTransactionDictionary = deleteUserFromPendingTransactionDictionary
module.exports.updateUserInPendingTransactionDictionary = updateUserInPendingTransactionDictionary

module.exports.supplyBankWithAddedUsers = supplyBankWithAddedUsers