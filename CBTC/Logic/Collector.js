const tmi = require('tmi.js');
const CronJob = require('cron').CronJob
const toCBAS = require('../Controller/toCBAS')
const options = require('../Configurations/options')
const BUG = "bug"  
const FISH  = "fish"  

var publicConnection = new tmi.client(options.settingsA);
// var privateConnection = new tmi.client(options.settingsA);

let currentMonth = () => {
    let monthNum = (new Date()).getMonth()
    switch(monthNum){
        case 0 : 
            return "JAN";
            break;
        case 1 : 
            return "FEB";
            break;
        case 2 : 
            return "MAR";
            break;
        case 3 : 
            return "APR";
            break;
        case 4 : 
            return "MAY";
            break;
        case 5 : 
            return "JUN";
            break;
        case 6 : 
            return "JUL";
            break;
        case 7 : 
            return "AUG";
            break;
        case 8 : 
            return "SEP";
            break;
        case 9 : 
            return "OCT";
            break;
        case 10 : 
            return "NOV";
            break;
        case 11 : 
            return "DEC";
    }
}

let userFriendlyMonth = (month) => {
    switch(month[0]){
        case "JAN" : 
            return "January";
            break;
        case "FEB" : 
            return "Feburary";
            break;
        case "MAR" : 
            return "March";
            break;
        case "APR" : 
            return "April";
            break;
        case "MAY" : 
            return "May";
            break;
        case "JUN" : 
            return "June";
            break;
        case "JUL" : 
            return "July";
            break;
        case "AUG" : 
            return "August";
            break;
        case "SEPT" : 
            return "September";
            break;
        case "OCT" : 
            return "October";
            break;
        case "NOV" : 
            return "November";
            break;
        case "DEC" : 
            return "December";
    }
}

let month = [currentMonth()]
let job = new CronJob('0 0 1 * *', () => {
    month = currentMonth()
  }, null, true, 'America/Los_Angeles');
job.start();

let toggle = false
let addFlower = () => {
    toggle = !toggle
    if(toggle) return "❀" 
    else return "✿"
} 

let botResponse = (twitchPayload) =>{
    publicConnection.action(twitchPayload.streamerChannel, twitchPayload.message)
} 

let appraisal = (rarity) => {
    if (rarity == 5) return "YOU ARE EXTREMELY LUCKY! OSFrog"
    else if (rarity == 4) return "Nice! That one is very rare!" 
    else if (rarity == 3) return "That one is a bit rare!"
    else return ""
}

let properlyCaseCreatureName = (command) => {
    let commandAsListOfWords = command.trim().split(" ").map(word => word.substring(0,1).toUpperCase() + word.substring(1).toLowerCase()+" ")
    let creatureNameProperlyCased = commandAsListOfWords.filter((word, idx) => idx > 1)
    return creatureNameProperlyCased.join("").trim()
}

let helpRequest = (info) => {
    let message = `${info.viewer} Check out https://github.com/MuteBard/CrossingBot/tree/master/CBTC for instructions! ${addFlower()}`
    let twitchPayload = {"streamerChannel": info.streamerChannel , "message" : message}
    botResponse(twitchPayload)
}

let catchRequest = (info) => {
    info["availability"] = month
    function twitchPayload (data) { 
        let message = ""
        if (data != null){
            message = `${info.viewer} caught a ${data.name}, worth ${data.bells} bells! ${appraisal(data.rarity)} ${addFlower()}`
        }else
            message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        
        return {
            "streamerChannel" : info.streamerChannel, 
            "viewer" : info.viewer,
            "message" : message
        }
    }
    toCBAS.postCatchRequest(info,twitchPayload,botResponse)    
} 

let sellOneRequest = (info) => {
    function twitchPayload(data) {
        let message = ""
        if (data != null && data != 0){
            message = `${info.viewer} has successfully sold ${info.creature} for ${data} bells! ${addFlower()}` 
        }else
            message = `${info.viewer}, that ${info.species} doesn't not exist in your pocket ${addFlower()}`
        
        return {
            "streamerChannel" : info.streamerChannel, 
            "message" : message
        }
    }
    toCBAS.postSellOne(info, twitchPayload, botResponse)
}

let sellAllRequest = (info) => {
    function twitchPayload(data) {
        let message = ""
        if (data != null && data != 0){
            message = `${info.viewer} has successfully sold everything for ${data} bells! ${addFlower()}` 
        }else
            message = `${info.viewer}, there is nothing in your pocket! ${addFlower()}`
        
        return {
            "streamerChannel" : info.streamerChannel, 
            "message" : message
        }
    }
    toCBAS.postSellAll(info, twitchPayload, botResponse)
}

let bellsRequest = (info) => {
    let akkaPayload = {"username" : info.viewer } 
    function twitchPayload (data) { 
        let message = ""
        if (data != null){
            message = `${info.viewer}, you have ${data.bells} bells! ${addFlower()}` 
        }else
            message = `${info.viewer}, try !bug or !fish first. ${addFlower()}`
        
        return {
            "streamerChannel" : info.streamerChannel,
            "message" :  message
        }
    }
    toCBAS.getUser(akkaPayload, twitchPayload, botResponse)
}

let pocketListRequest = (info) => {
    let akkaPayload = {"username" : info.viewer } 
    function twitchPayload (data) { 
        let message = ""
        if (data != null){
            let creaturesList = (data.pocket.bug).concat(data.pocket.fish)
            message = (creaturesList.length == 0 ) ? `${info.viewer}, there are no bugs or fishes in your pocket` : `${info.viewer} Here are all the bugs and fishes in your pocket! : ${creaturesList.map(creature => " "+creature.name)}  ${addFlower()}` 
        }else
            message = `${info.viewer}, try !bug or !fish first. ${addFlower()}`
        
        return {
            "streamerChannel" : info.streamerChannel, 
            "viewer": info.viewer, 
            "message" : message
        }
    }
    toCBAS.getUser(akkaPayload, twitchPayload, botResponse)
}

let listRequest = (info) => {
    info["availability"] = month
    function twitchPayload (data) { 
        let message = ""
        if (data != null){
            message = `${info.viewer}, here are ${info.species == BUG ? "bugs" : "fishes"} for ${userFriendlyMonth(month)} : ${data.map(creature => " "+creature.name )} ${addFlower()}`
        }else
            message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        
        return {
            "streamerChannel" : info.streamerChannel, 
            "viewer": info.viewer, 
            "message" : message
        }
    }
    toCBAS.postListByMonth(info,twitchPayload,botResponse)    
}


let rarestListRequest = (info) => {
    info["availability"] = month
    function twitchPayload (data) { 
        let message = ""
        if (data != null){
            message = (Object.keys(data).length === 0) ? `${info.viewer}, there are no super rare ${info.species == BUG ? "bugs" : "fishes"} in ${userFriendlyMonth(month)} ${addFlower()}` :`${info.viewer}, here are some super rare fishes for ${userFriendlyMonth(month)} : ${data.map(fish => " "+fish.name )} ${addFlower()}`
        }else
            message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        
        return {
            "streamerChannel" : info.streamerChannel, 
            "message" : message
        }
    }
    toCBAS.postRareListByMonth(info,twitchPayload,botResponse)    
}

let retrieveTurnipsPrice = (info) => {
    function twitchPayload(data){
        let message = ""
        if(data != null){
            message = `${info.viewer}, the turnips are now at ${data} bells ${addFlower()}`
        }else
            message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        
        return {
                "streamerChannel" : info.streamerChannel, 
                "message" : message
        }
    }
    toCBAS.getTurnips(info,twitchPayload,botResponse)    

}

publicConnection.connect().then(() => console.log("CBTC is ready to facilitate communication between CBAS and Twitch"))
publicConnection.on('chat', (channel, userstate, message, self) => {

    let info = {
        streamerChannel : channel,
        viewer : userstate["display-name"]    
    }
    let command = message.toLowerCase().trim()
    if(command == "!help") helpRequest(info)

    else if(command == "!bug"){
        info["species"] = BUG
        catchRequest(info)
    } 
    else if(command == "!fish"){
        info["species"] = FISH
        catchRequest(info)
    } 
    else if(command == "!listpocket") pocketListRequest(info)
    else if(command == "!bells") bellsRequest(info)

    else if(command.includes("!sell bug")) {
        let name = properlyCaseCreatureName(command)
        console.log(name)
        info["creature"] = name
        info["species"] = BUG  
       sellOneRequest(info)
    }

    else if(command.includes("!sell fish")) {
        let name = properlyCaseCreatureName(command)
        info["creature"] = name
        info["species"] = FISH
        sellOneRequest(info)
    }
    else if(message == "!sell all")  
        sellAllRequest(info)

    else if(command == "!listbug"){
        info["species"] = BUG
        listRequest(info)
    } 
    else if(command == "!listfish"){
        info["species"] = FISH
        listRequest(info)
    } 
    else if(command == "!listrarebug") {
        info["species"] = BUG
        rarestListRequest(info)
    }
    else if(command == "!listrarefish"){
        info["species"] = FISH
        rarestListRequest(info)
    } 
    else if(command == "!turnips"){
        retrieveTurnipsPrice(info)
    }
  
}); 
