const CURRENT_MONTH = require('../Cron/Timing').month

let GET_USER_HOME = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        username
        avatar
    }
}`


let GET_USER_PROFILE = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        username
        avatar
        bells
        liveTurnips
        pocket{
            bug{
                name
                bells
                availability
                rarity
                img
            }
            fish{
                name
                bells
                availability
                rarity
                img
            }
        }
    }
}`



let GET_USER_CATCH = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        username
        bells
        pocket{
            bug{
                name
                bells
                availability
                rarity
                img
            }
            fish{
                name
                bells
                availability
                rarity
                img
            }
        }
    }
}`

let GET_USER_MARKET = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        username
        avatar
        bells
        liveTurnips{
            business
            quantity
            marketPrice
            totalBells
            netGainLossAsBells
            netGainLossAsPercentage
        } 
        turnipTransactionHistory{
            business
            quantity
            marketPrice
            totalBells
            netGainLossAsBells
            netGainLossAsPercentage
        }    
    }
}`


module.exports.GET_USER_HOME = GET_USER_HOME
module.exports.GET_USER_PROFILE = GET_USER_PROFILE
module.exports.GET_USER_CATCH = GET_USER_CATCH
module.exports.GET_USER_MARKET = GET_USER_MARKET

