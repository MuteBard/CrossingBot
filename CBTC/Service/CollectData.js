const tmi = require('tmi.js');
const options = require('../Configurations/options')
const process = require('./processData')
var publicConnection = new tmi.client(options.settingsA);
module.exports.publicConnection = publicConnection 
const BUG = "bug"  
const FISH  = "fish"  

let pendingTurnipTransactionDictionary = {}
publicConnection.connect().then(() => console.log("CBTC is ready to facilitate communication between CBAS and Twitch"))
publicConnection.on('chat', (channel, userstate, message, self) => {
    let Twitch_Data = {
        channel : channel,
        username : userstate["display-name"]    
    }
    let command = message.toLowerCase().trim()

    if(command == "!mybells"){
        process.bellsRequest(Twitch_Data)
    } 

    else if(command == "!bug"){
        Twitch_Data["species"] = BUG
        process.catchRequest(Twitch_Data)
    } 

    else if(command == "!fish"){
        Twitch_Data["species"] = FISH
        process.catchRequest(Twitch_Data)
    } 
});


// let additionalInfo = (info, command) => {
//     commandAsList = command.trim().split(" ")
//     let business = (commandAsList[0].toLowerCase().trim()).substring(1)
//     let quantity = Number(commandAsList[1].trim())

//     if(commandAsList.length > 3){
//         return {error : `Try formatting like this: !buy 1 turnips`}
//     }else if(business != "buy" && business != "sell"){
//         return {error : `You can only buy and sell`}
//     }else if(quantity <= "0"){
//         return {error : `Please ${business} 1 or more turnips`}
//     }else if(!quantity){
//         return {error : `Please provide a number of turnips to ${business}`}
//     }else{
//         return {
//             username : info.viewer,
//             business: business,
//             quantity: quantity,
//             marketPrice : -1,
//             totalBells: -1,
//             message : ""
//         }
//     }
// }


// let properlyCaseCreatureName = (command) => {
//     let commandAsListOfWords = command.trim().split(" ").map(word => word.substring(0,1).toUpperCase() + word.substring(1).toLowerCase()+" ")
//     let creatureNameProperlyCased = commandAsListOfWords.filter((word, idx) => idx > 1)
//     return creatureNameProperlyCased.join("").trim()
// }

// let helpRequest = (info) => {
//     let message = `${info.viewer} Check out https://github.com/MuteBard/CrossingBot/tree/master/CBTC for instructions! ${addFlower()}`
//     let twitchPayload = {"streamerChannel": info.streamerChannel , "message" : message}
//     botResponse(twitchPayload)
// }



// let sellOneRequest = (info) => {
//     function twitchPayload(data) {
//         let message = ""
//         if (data != null && data != 0){
//             message = `${info.viewer} has successfully sold ${info.creature} for ${data} bells! ${addFlower()}` 
//         }else
//             message = `${info.viewer}, that ${info.species} doesn't not exist in your pocket ${addFlower()}`
        
//         return {
//             "streamerChannel" : info.streamerChannel, 
//             "message" : message
//         }
//     }
//     Route.postSellOne(info, twitchPayload, botResponse)
// }

// let sellAllRequest = (info) => {
//     function twitchPayload(data) {
//         let message = ""
//         if (data != null && data != 0){
//             message = `${info.viewer} has successfully sold everything for ${data} bells! ${addFlower()}` 
//         }else
//             message = `${info.viewer}, there is nothing in your pocket! ${addFlower()}`
        
//         return {
//             "streamerChannel" : info.streamerChannel, 
//             "message" : message
//         }
//     }
//     Route.postSellAll(info, twitchPayload, botResponse)
// }


// let pocketRequest = (info) => {
//     let akkaPayload = {"username" : info.viewer } 
//     function twitchPayload (data) { 
//         let message = ""
//         if (data != null){
//             let creaturesList = (data.pocket.bug).concat(data.pocket.fish)
//             message = (creaturesList.length == 0 ) ? `${info.viewer}, there are no bugs or fishes in your pocket` : `${info.viewer} Here are all the bugs and fishes in your pocket! : ${creaturesList.map(creature => " "+creature.name)}  ${addFlower()}` 
//         }else
//             message = `${info.viewer}, try !bug or !fish first. ${addFlower()}`
        
//         return {
//             "streamerChannel" : info.streamerChannel, 
//             "viewer": info.viewer, 
//             "message" : message
//         }
//     }
//     Route.getUser(akkaPayload, twitchPayload, botResponse)
// }

// let listRequest = (info) => {
//     info["availability"] = month
//     function twitchPayload (data) { 
//         let message = ""
//         if (data != null){
//             message = `${info.viewer}, here are ${info.species == BUG ? "bugs" : "fishes"} for ${userFriendlyMonth(month)} : ${data.map(creature => " "+creature.name )} ${addFlower()}`
//         }else
//             message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        
//         return {
//             "streamerChannel" : info.streamerChannel, 
//             "viewer": info.viewer, 
//             "message" : message
//         }
//     }
//     Route.postListByMonth(info,twitchPayload,botResponse)    
// }


// let rarestListRequest = (info) => {
//     info["availability"] = month
//     function twitchPayload (data) { 
//         let message = ""
//         if (data != null){
//             message = (Object.keys(data).length === 0) ? `${info.viewer}, there are no super rare ${info.species == BUG ? "bugs" : "fishes"} in ${userFriendlyMonth(month)} ${addFlower()}` :`${info.viewer}, here are some super rare fishes for ${userFriendlyMonth(month)} : ${data.map(fish => " "+fish.name )} ${addFlower()}`
//         }else
//             message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        
//         return {
//             "streamerChannel" : info.streamerChannel, 
//             "message" : message
//         }
//     }
//     Route.postRareListByMonth(info,twitchPayload,botResponse)    
// }

// let retrieveTurnipsPrice = (info) => {
//     function twitchPayload(data){
//         let message = ""
//         if(data != null){
//             message = `${info.viewer}, the turnips are now at ${data} bells ${addFlower()}`
//         }else
//             message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        
//         return {
//                 "streamerChannel" : info.streamerChannel, 
//                 "message" : message
//         }
//     }
//     Route.getTurnips(info,twitchPayload,botResponse)    

// }

// let pendingTurnipBusiness = (info) => {
//     let message = ""
//     if(info.error != undefined){
//         message = `${info.viewer}, ${info.error} ${addFlower()}`
//         let twitchPayload = {"streamerChannel": info.streamerChannel , "message" : message}
//         botResponse(twitchPayload)
//     }
//     else{    
//         function twitchPayload(data){
//             let message = ""
//             if(data != null){
//                 if(data.message == "Authorized"){
//                     pendingAuthorizedTransactionDict[info.viewer] = data 
//                     if(data.business == "buy"){
//                         message = `${info.viewer}, you are buying ${info.transaction.quantity} turnip(s) at market price of ${data.marketPrice} ${info.transaction.quantity != 1 ? `for a total of ${data.totalBells}` : ""}. Type !confirm or !cancel ${addFlower()}`
//                     }else if(data.business == "sell"){
//                         message = `${info.viewer}, you are selling ${info.transaction.quantity} turnip(s) at market price of ${data.marketPrice} ${info.transaction.quantity != 1 ? `for a total of ${data.totalBells}` : ""}. Type !confirm or !cancel ${addFlower()}`
//                     }
//                 }else if(data.message == "Insufficient bells")  message = `${info.viewer}, you do not have enough bells to buy ${info.transaction.quantity} turnip(s) ${addFlower()}` 
//                 else if(data.message == "Insufficient turnips") message = `${info.viewer}, you do not have ${info.transaction.quantity} turnip(s) to sell ${addFlower()}` 
//                 else if(data.message == "User does not exist")  message = `${info.viewer}, try !bug or !fish first. ${addFlower()}`
//             }else
//                 message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
            
//             return {
//                     "streamerChannel" : info.streamerChannel, 
//                     "message" : message
//             }
//         }
//         Route.postPendingTransaction(info,twitchPayload,botResponse) 
//     }

// }

// let executingTurnipBusiness = (info) => {
//     let message = ""
//     if(info.status == "cancelled"){
//         message = `${info.viewer}, you ${info.status} ${info.transaction.business == "buy" ? "buying" : "selling"} turnips ${addFlower()}`
//         let twitchPayload = {"streamerChannel": info.streamerChannel , "message" : message}
//         botResponse(twitchPayload)
//     }else if(info.status == "confirmed"){
//         function twitchPayload(data){
//             let message = ""
//             console.log(data.turnipTransactionHistory[0])
//             if(data != null){
//                 message = `Congrats! ${info.viewer}, you ${data.turnipTransactionHistory[0].business == "buy" ? "bought" : "sold"} ${data.turnipTransactionHistory[0].quantity} turnips at a market price of ${data.turnipTransactionHistory[0].marketPrice} bells! ${addFlower()}`
//             }else
//                 message = `Hey ${info.streamerChannel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
            
//             return {
//                     "streamerChannel" : info.streamerChannel, 
//                     "message" : message
//             }
//         }
//         Route.postExecuteTransaction(info,twitchPayload,botResponse)  
//     }
// }

// let statsRequest = (info) => {
//     let akkaPayload = {"username" : info.viewer } 
//     function twitchPayload (data) { 
//         let message = ""
//         if (data != null){
//             if (data.liveTurnips.netGainLossAsBells > 0){
//                 message = `${info.viewer}, you have gained ${data.liveTurnips.netGainLossAsBells} bells so far with your ${data.liveTurnips.quantity} turnips at the market price of ${data.liveTurnips.marketPrice}! ${addFlower()}` 
//             }else if(data.liveTurnips.netGainLossAsBells > 0){
//                 message = `${info.viewer}, you have made exactly 0 ${data.liveTurnips.netGainLossAsBells} bells with your ${data.liveTurnips.quantity} turnips at the market price of ${data.liveTurnips.marketPrice}! ${addFlower()}`
//             }else{
//                 message = `${info.viewer}, you have lost ${Math.abs(data.liveTurnips.netGainLossAsBells)} bells so far with your ${data.liveTurnips.quantity} turnips at the market price of ${data.liveTurnips.marketPrice}! ${addFlower()}`
//             }
//         }else
//             message = `${info.viewer}, try !bug or !fish first. ${addFlower()}`
        
//         return {
//             "streamerChannel" : info.streamerChannel,
//             "message" :  message
//         }
//     }
//     Route.getUser(akkaPayload, twitchPayload, botResponse)
// }


    // if (pendingAuthorizedTransactionDict[twitchData.username] == undefined){
    //     pendingAuthorizedTransactionDict[twitchData.username] = {"username" : ""}
    // } 
    
    
    // if(command == "!help") helpRequest(twitch)

    // else if(command == "!mypocket") pocketRequest(info)
    // else 
    

    // else if(command.includes("!sell bug")) {
    //     let name = properlyCaseCreatureName(command)
    //     info["creature"] = name
    //     info["species"] = BUG  
    //    sellOneRequest(info)
    // }

    // else if(command.includes("!sell fish")) {
    //     let name = properlyCaseCreatureName(command)
    //     info["creature"] = name
    //     info["species"] = FISH
    //     sellOneRequest(info)
    // }
    // else if(message == "!sell all")  
    //     sellAllRequest(info)

    // else if(command == "!listbug"){
    //     info["species"] = BUG
    //     listRequest(info)
    // } 
    // else if(command == "!listfish"){
    //     info["species"] = FISH
    //     listRequest(info)
    // } 
    // else if(command == "!listrarebug") {
    //     info["species"] = BUG
    //     rarestListRequest(info)
    // }
    // else if(command == "!listrarefish"){
    //     info["species"] = FISH
    //     rarestListRequest(info)
    // } 
    // else if(command == "!stalkmarket"){
    //     retrieveTurnipsPrice(info)
    // }
    
    // else if((command.includes("!buy ") && command.includes(" turnips")) || (command.includes("!sell ") && command.includes(" turnips"))){
    //     let transaction = additionalInfo(info, command)
    //     if(transaction.error == undefined){
    //         info["transaction"] = transaction
    //         pendingTurnipBusiness(info)

    //     }else{
    //         info["error"] = transaction.error
    //         pendingTurnipBusiness(info)
    //     }
    // }
    
    // else if (command == "!confirm" && pendingAuthorizedTransactionDict[info.viewer].username == info.viewer){
    //     info["transaction"] = pendingAuthorizedTransactionDict[info.viewer]
    //     info["status"] = "confirmed"
    //     delete pendingAuthorizedTransactionDict[info.viewer]
    //     executingTurnipBusiness(info)
    // }

    // else if (command == "!cancel" && pendingAuthorizedTransactionDict[info.viewer].username == info.viewer){
    //     info["transaction"] = pendingAuthorizedTransactionDict[info.viewer]
    //     info["status"] = "cancelled"
    //     delete pendingAuthorizedTransactionDict[info.viewer]
    //     console.log("Does not make a request to do many calculations")
    //     executingTurnipBusiness(info)
    // }

    // else if(command == "!myturnips"){
    //     statsRequest(info)
    // }

    // else if(command == "!turnipowened") Easy
    // else if(command == "!turnip buy") Hard
    
    

  
 


// when buying and selling turnips, we want them to confirm
// keep an array of payload with viewer, buy sell objects with nimber of turnips and price