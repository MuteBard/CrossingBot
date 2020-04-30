const Route = require('../Controller/Route')
const maintainConnection = require('./CollectData')
const BUG = "bug"  
const FISH  = "fish" 

let toggle = false
let addFlower = () => {
    toggle = !toggle
    if(toggle) return "❀" 
    else return "✿"
} 

let appraisal = (rarity) => {
    if (rarity == 5) return "YOU ARE EXTREMELY LUCKY! OSFrog"
    else if (rarity == 4) return "Nice! That one is very rare!" 
    else if (rarity == 3) return "That one is a bit rare!"
    else return ""
}

let respondToTwitch = (Twitch_Payload) =>{
    maintainConnection.publicConnection.action(Twitch_Payload.channel, Twitch_Payload.message)
}

let bellsRequest = (Twitch_Data) => {
    let CBAS_Payload = {"username" : Twitch_Data.username } 
    let Twitch_Payload = (CBAS_Data) => { 
        let isSuccessful = CBAS_Data != null
        let message = ""
        if (isSuccessful){
            message = `${CBAS_Data.username}, you have ${CBAS_Data.bells} bells! ${addFlower()}` 
        }else
            message = `${Twitch_Data.username}, try !bug or !fish first. ${addFlower()}`
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }
    Route.queryUserBells(CBAS_Payload, Twitch_Payload)
}

let catchRequest = (Twitch_Data) => {
    let CBAS_Payload = {"username" : Twitch_Data.username, "species" : Twitch_Data.species } 
    let Twitch_Payload = (CBAS_Data) => { 
        let isSuccessful = CBAS_Data != null
        let message = ""
        if (isSuccessful){
            if(Twitch_Data.species == BUG)
                var list = CBAS_Data.pocket.bug 
                let latestBug = list[list.length - 1]
                message = `${CBAS_Data.username} caught a ${latestBug.name}, worth ${latestBug.bells} bells! ${appraisal(latestBug.rarity)} ${addFlower()}`
            }else if(Twitch_Data.species == FISH){
                var list = CBAS_Data.pocket.fish 
                let latestFish = CBAS_Data.pocket.fish[CBAS_Data.pocket.fish.length - 1]
                message = `${CBAS_Data.username} caught a ${latestFish.name}, worth ${latestFish.bells} bells! ${appraisal(latestFish.rarity)} ${addFlower()}`
        }else{
            message = `Hey ${Twitch_Data.channel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        }
        respondToTwitch({
            "channel" : Twitch_Data.channel, 
            "message" : message
        })
    }
    Route.mutateUserCatchingCreature(CBAS_Payload, Twitch_Payload)    
} 



module.exports.bellsRequest = bellsRequest
module.exports.catchRequest = catchRequest