const CURRENT_MONTH = require('../Cron/Timing').data

let USER_BELLS_REQUEST = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        username
        bells
    }
}`

let USER_BUG_REQUEST = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        id
        username
        pocket{
            bug{
                name
                bells
            }
        }
    }
}`

let USER_FISH_REQUEST = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        id
        username
        pocket{
            fish{
                name
                bells
            }
        }
    }
}`

let USER_REQUEST = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        username
        bells
        pocket{
            bug{
                name
                bells
            }
            fish{
                name
                bells
            }
        }
    }
}`

const DAY_RECORD = 
`query{    
    getDayRecords(dummy : true){
        latestTurnipPrice
        todayHigh
        todayLow
        turnipPriceHistory
    }
}`

const MONTH_RECORD = 
`query{
    getMonthRecords(dummy : true){
        latestTurnipPrice
        todayHigh
        todayLow
        turnipPriceHistory 
    }
}`

const TURNIP_PRICES =
`query{
    getTurnipPrices(dummy : true)
}`


let BUGS_BY_MONTH = 
`query{
    getAllBugsByMonth(months : <months>){
        name
        bells
        rarity
    }
}
`
let FISHES_BY_MONTH = 
`query{
    getAllFishesByMonth(months : <months>){
        name
        bells
        rarity
    }
}
`.replace("<months>", CURRENT_MONTH)

let RARE_BUGS_BY_MONTH = 
`query{
    getAllRareFishesByMonth(months: <months>){
        name
        bells
        rarity
    }
  }
`.replace("<months>", CURRENT_MONTH)

let RARE_FISHES_BY_MONTH = 
`query{
    getAllRareFishesByMonth(months : <months>}){
        name
        bells
        rarity
    }
}
`.replace("<months>", CURRENT_MONTH)

let VALIDATE_TRANSACTION = (username, business, quantity) => 
`query{
    validatePendingTransaction(username: ${"\""+username+"\""}, business: ${"\""+business+"\""}, quantity: ${"\""+quantity+"\""}){
        status
        business
        quantity
        marketPrice
        totalBells                                                                                                                                                                                                                                                               
    }
}
`
module.exports.USER_BELLS_REQUEST = USER_BELLS_REQUEST
module.exports.USER_FISH_REQUEST = USER_FISH_REQUEST
module.exports.USER_BUG_REQUEST = USER_BUG_REQUEST
module.exports.USER_REQUEST = USER_REQUEST
module.exports.DAY_RECORD = DAY_RECORD
module.exports.MONTH_RECORD = MONTH_RECORD
module.exports.TURNIP_PRICES = TURNIP_PRICES
module.exports.BUGS_BY_MONTH = BUGS_BY_MONTH
module.exports.FISHES_BY_MONTH = FISHES_BY_MONTH
module.exports.RARE_BUGS_BY_MONTH = RARE_BUGS_BY_MONTH
module.exports.RARE_FISHES_BY_MONTH = RARE_FISHES_BY_MONTH
module.exports.VALIDATE_TRANSACTION = VALIDATE_TRANSACTION