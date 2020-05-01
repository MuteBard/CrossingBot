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
    let Twitch_Payload = (response) => { 
        let CBAS_Data = response.getUser
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
            console.log(CBAS_Data.pocket)
            if(Twitch_Data.species == BUG){
                var list = CBAS_Data.pocket.bug 
                let latestBug = list[list.length - 1]
                message = `${CBAS_Data.username} caught a ${latestBug.name}, worth ${latestBug.bells} bells! ${appraisal(latestBug.rarity)} ${addFlower()}`
            }else if(Twitch_Data.species == FISH){
                var list = CBAS_Data.pocket.fish 
                let latestFish = list[list.length - 1]
                message = `${CBAS_Data.username} caught a ${latestFish.name}, worth ${latestFish.bells} bells! ${appraisal(latestFish.rarity)} ${addFlower()}`
            }
        }else{
            message = `Hey ${Twitch_Data.channel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        }
        respondToTwitch({
            "channel" : Twitch_Data.channel, 
            "message" : message
        })
    }
    Route.mutateUserPocket(CBAS_Payload, Twitch_Payload)    
} 

let pocketRequest = (Twitch_Data) => {
    CBAS_Payload = {"username" : Twitch_Data.username}
    let Twitch_Payload = (response) => { 
        let CBAS_Data = response.getUser
        let isSuccessful = CBAS_Data != null
        let message = ""
        if (isSuccessful){
            var bugList = CBAS_Data.pocket.bug 
            var fishList = CBAS_Data.pocket.fish
            if((bugList.length + fishList.length) > 0){
                messagepart1 = `${CBAS_Data.username}, `
                messagepart2 =  bugList.length > 0 ? `you have ${bugList.length} bugs: ${bugList.map(bug => bug.name).join(", ")}. ` : ""
                messagepart3 =  fishList.length > 0 ? `Also, you have ${fishList.length} fishes: ${fishList.map(fish => fish.name).join(", ")}. ` : ""
                message = `${messagepart1}${messagepart2}${messagepart3}${addFlower()}`
            }else{
                message = `${CBAS_Data.username}, you dont have anything in your pocket! ${addFlower()}`
            } 
        }else{
            message = `Hey ${Twitch_Data.channel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        }    
        respondToTwitch({
            "channel" : Twitch_Data.channel, 
            "message" : message
        })
    }
    Route.queryUserPocket(CBAS_Payload, Twitch_Payload)  
}

let creatureRequest = (Twitch_Data) => {
    let CBAS_Payload = { "creatureName" : Twitch_Data.creatureName } 
    let Twitch_Payload = (response) => { 
        let CBAS_Data = response.getCreatureSummaryByName
        let isSuccessful = CBAS_Data != null
        let message = ""
        if (isSuccessful){
            message = CBAS_Data
        }else
            message = `${Twitch_Data.username}, Thats neither a known bug or a fish ${addFlower()}`
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }
    Route.queryCreatureSummary(CBAS_Payload, Twitch_Payload)
}

module.exports.bellsRequest = bellsRequest
module.exports.catchRequest = catchRequest
module.exports.pocketRequest = pocketRequest
module.exports.creatureRequest = creatureRequest
