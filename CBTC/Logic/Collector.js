const tmi = require('tmi.js');
const CronJob = require('cron').CronJob
const toCBAS = require('../Controller/toCBAS')
const options = require('../Configurations/options')

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


let helpRequest = (info) => {
    let message = `${info.viewer} Check out -- for instructions! ${addFlower()}`
    let twitchPayload = {"streamerChannel": info.streamerChannel , "message" : message}
    botResponse(twitchPayload)
}

let creatureCatchRequest = (info) => {
    info["availability"] = month
    function twitchPayload (data) { 
        let message = ""
        if (data != null){
            message = `${info.viewer} caught a ${data.name}, worth ${data.bells} bells! ${appraisal(data.rarity)} ${addFlower()}`
        }else
            message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard`
        return {
            "streamerChannel" : info.streamerChannel, 
            "viewer" : info.viewer,
            "message" : message
        }
    }
    toCBAS.postCreatureCatchRequest(info,twitchPayload,botResponse)    
} 

// let creatureSellRequest = (info) => {
//     function twitchPayload(data) {
//         let message = ""
//         if (data != null){
//             message = `${info.viewer} has successfully sold ${info.species} for ${data.bells} ${addFlower()}` 
//         }else
//             message = `${info.viewer}, that ${info.species} doesn't not exist in your pocket ${addFlower()}`
//         return {
//             "streamerChannel" : info.streamerChannel, 
//             "message" : message
//         }
//     }
//     toCBAS.postSellCreature(info, twitchPayload, botResponse)
// }

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
    toCBAS.getDataFromUser(akkaPayload, twitchPayload, botResponse)
}

let pocketListRequest = (info) => {
    let akkaPayload = {"username" : info.viewer } 
    function twitchPayload (data) { 
        let message = ""
        if (data != null){
            let creaturesList = (data.pocket.bug).concat(data.pocket.fish)
            message = (data.length == 0) ? `${info.viewer}, there are no bugs nor fishes in your pocket` : `${info.viewer} Here are all the bugs and fishes in your pocket! : ${creaturesList.map(creature => " "+creature.name)}  ${addFlower()}` 
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

let creatureListRequest = (info) => {
    info["availability"] = month
    function twitchPayload (data) { 
        let message = ""
        if (data != null){
            message = `${info.viewer}, here are ${info.species == "Bug" ? "bugs" : "fishes"} for ${userFriendlyMonth(month)} : ${data.map(creature => " "+creature.name )} ${addFlower()}`
        }else
            message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard`
        return {
            "streamerChannel" : info.streamerChannel, 
            "viewer": info.viewer, 
            "message" : message
        }
    }
    toCBAS.postListCreaturesByMonth(info,twitchPayload,botResponse)    
}


let rarestCreaturesListRequest = (info) => {
    info["availability"] = month
    function twitchPayload (data) { 
        let message = ""
        if (data != null){
            message = (Object.keys(data).length === 0) ? `${info.viewer}, there are no super rare ${info.species == "Bug" ? "bugs" : "fishes"} in ${userFriendlyMonth(month)} ${addFlower()}` :`${info.viewer}, here are some super rare fishes for ${userFriendlyMonth(month)} : ${data.map(fish => " "+fish.name )} ${addFlower()}`
        }else
            message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard`
        return {
            "streamerChannel" : info.streamerChannel, 
            "message" : message
        }
    }
    toCBAS.postRareCreaturesListByMonth(info,twitchPayload,botResponse)    
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
        info["species"] = "Bug"
        creatureCatchRequest(info)
    } 
    else if(command == "!fish"){
        info["species"] = "Fish"
        creatureCatchRequest(info)
    } 
    else if(command == "!listpocket") pocketListRequest(info)
    else if(command == "!bells") bellsRequest(info)

    // else if(command.includes("!sell bug")) {
    //     info["bug"] = command.split("!sell bug")[1].trim()
    //     info["species"] = "Bug"  
    //     creatureSellRequest(info)
    // }

    // else if(command.includes("!sell fish")) {
    //     info["fish"] = command.split("sell fish")[1].trim()
    //     info["species"] = "Fish"  
    //     creatureSellRequest(info)
    // }
    // else if(message == "!all $")  creaturesSellRequest(info)

    else if(command == "!listbug"){
        info["species"] = "Bug"
        creatureListRequest(info)
    } 
    else if(command == "!listfish"){
        info["species"] = "Fish"
        creatureListRequest(info)
    } 
    else if(command == "!listrarebug") {
        info["species"] = "Bug"
        rarestCreaturesListRequest(info)
    }
    else if(command == "!listrarefish"){
        
        info["species"] = "Fish"
        rarestCreaturesListRequest(info)
    } 
  
}); 
