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

exports.bellsRequest = (Twitch_Data) => {
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

exports.catchRequest = (Twitch_Data) => {
    let CBAS_Payload = {"username" : Twitch_Data.username, "species" : Twitch_Data.species } 
    let Twitch_Payload = (response) => { 
        let CBAS_Data = response
        let message = ""
        if(CBAS_Data == "BugOverflow"){
            message = `${Twitch_Data.username}, you already have 10 bugs! Try selling some! ${addFlower()}`
        }else if(CBAS_Data == "FishOverflow"){
            message = `${Twitch_Data.username}, you already have 10 fishes! Try selling some! ${addFlower()}`
        }else if(CBAS_Data.name != null){
            message = `${Twitch_Data.username} caught a ${CBAS_Data.name}, worth ${CBAS_Data.bells} bells! ${appraisal(CBAS_Data.rarity)} ${addFlower()}`
        }else{
            message = `Hey ${Twitch_Data.channel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        }
        respondToTwitch({
            "channel" : Twitch_Data.channel, 
            message
        })
    }
    Route.mutateUserPocketCatch(CBAS_Payload, Twitch_Payload)    
} 

exports.pocketRequest = (Twitch_Data) => {
    CBAS_Payload = {"username" : Twitch_Data.username}
    let Twitch_Payload = (response) => { 
        let CBAS_Data = response.getUser
        let message = ""
        if (CBAS_Data != null){
            var bugList = CBAS_Data.pocket.bug 
            var fishList = CBAS_Data.pocket.fish
            if((bugList.length + fishList.length) > 0){
                pluralBug = bugList.length > 1 ? "bugs" : "bug"
                pluralFish = fishList.length > 1 ? "fishes" : "fish"
                addAlso = bugList.length == 0 ? "" : "Also, "
                messagepart1 = `${CBAS_Data.username}, `
                messagepart2 =  bugList.length > 0 ? `you have ${bugList.length} ${pluralBug}: ${bugList.map(bug => bug.name).join(", ")}. ` : ""
                messagepart3 =  fishList.length > 0 ? `${addAlso}you have ${fishList.length} ${pluralFish}: ${fishList.map(fish => fish.name).join(", ")}. ` : ""
                message = `${messagepart1}${messagepart2}${messagepart3}${addFlower()}`
            }else{
                message = `${CBAS_Data.username}, you dont have anything in your pocket! ${addFlower()}`
            } 
        }else{
            message = `${Twitch_Data.username}, try !bug or !fish first. ${addFlower()}`
        }    
        respondToTwitch({
            "channel" : Twitch_Data.channel, 
            message
        })
    }
    Route.queryUserPocket(CBAS_Payload, Twitch_Payload)  
}

exports.creatureRequest = (Twitch_Data) => {
    console.log(Twitch_Data)
    if(!Twitch_Data.failure){
        let CBAS_Payload = { "species" : Twitch_Data.species, "creatureName" : Twitch_Data.creatureName } 
        let Twitch_Payload = (response) => { 
            let CBAS_Data = null
            if(Twitch_Data.species == "bug"){
                CBAS_Data = response.getBugByName
            }else if(Twitch_Data.species == "fish"){
                CBAS_Data = response.getFishByName
            }
            let message = ""
            if (CBAS_Data != null){
                message = `${Twitch_Data.username}, The ${CBAS_Data.name} is worth ${CBAS_Data.bells} bells and it has a rarity of lvl ${CBAS_Data.rarity}. It is available during these following months: ${CBAS_Data.availability.join(" ")}`
            }else{
                message = `${Twitch_Data.username}, Thats neither a known bug or a fish ${addFlower()}`
            }
            respondToTwitch({
                channel : Twitch_Data.channel,
                message
            })
            
        }
        Route.queryCreature(CBAS_Payload, Twitch_Payload)
    }else{
        let message = `${Twitch_Data.username}, ${Twitch_Data.error} ${addFlower()}`
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }
}

exports.sellOneRequest = (Twitch_Data) => {
    if(!Twitch_Data.failure){

        let CBAS_Payload = { "username" : Twitch_Data.username, "species" : Twitch_Data.species, "creatureName" : Twitch_Data.creatureName } 
        let Twitch_Payload = (response) => { 
            let CBAS_Data = null
            let message = ""
            if(response != null){
                CBAS_Data = response.sellOneCreature
                message = `${Twitch_Data.username}, you sold ${Twitch_Data.creatureName} for ${CBAS_Data} ${addFlower()}`
            }else{
                message = `${Twitch_Data.username}, you do not have that ${Twitch_Data.species} to sell ${addFlower()}`
            }
            respondToTwitch({
                channel : Twitch_Data.channel,
                message
            })
        }
        Route.mutateUserPocketSellOne(CBAS_Payload, Twitch_Payload)
    }else{
        let message = `${Twitch_Data.username}, ${Twitch_Data.error} ${addFlower()}`
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }    
}

exports.sellAllRequest = (Twitch_Data) => {
    let CBAS_Payload = { "username" : Twitch_Data.username }
    let Twitch_Payload = (response) => { 
        let CBAS_Data = null
        let message = ""
        if(response != null){
            CBAS_Data = response.sellAllCreatures
            message = `${Twitch_Data.username}, you sold everything for ${CBAS_Data}! ${addFlower()}`
        }else{
            message = `${Twitch_Data.username}, you do not have anything to sell ${addFlower()}`
        }
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }
    Route.mutateUserPocketSellAll(CBAS_Payload, Twitch_Payload)
}

