const Route = require('../Controller/Route')

var bugBank = []
var fishBank = []


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


supplyBankWithCreatures()