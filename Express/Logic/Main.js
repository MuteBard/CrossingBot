const tmi = require('tmi.js');
const CronJob = require('cron').CronJob
const toAkka = require('../Controller/toAkka')
const options = require('../Configurations/options')

var publicConnection = new tmi.client(options.settings);
var privateConnection = new tmi.client(options.settings);

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

let botResponse = (streamerChannel, message) =>{
    publicConnection.action(streamerChannel, message)
} 

let appraisal = (rarity) => {
    if (rarity == 5) return "YOU ARE EXTREMELY LUCKY! OSFrog"
    else if (rarity == 4) return "Nice! That one is very rare!" 
    else if (rarity == 3) return "That one is a bit rare!"
    else return ""
}


let helpRequest = (info) => {
    let message = 
            `!bug to catch a bug !listBug to list bugs available this month !listRareBug to list rare bugs available this month `+
            `!fish to catch a fish !listFish to list fishes available this month !listRareFish to list rare fishes available this month `
    botResponse(info.streamerChannel, message)
}

let bugCatchRequest = (info) => {
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"streamerChannel" : info.streamerChannel, "viewer":info.viewer, "message" : `${info.viewer} caught a ${data.name}, worth ${data.bells} bells! ${appraisal(data.rarity)} ${addFlower()}` }}
    toAkka.postSingleBugByMonths(akkaPayload,twitchPayload,botResponse)    
} 

let fishCatchRequest = (info) => {
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"streamerChannel" : info.streamerChannel, "viewer":info.viewer, "message" : `${info.viewer} caught a ${data.name}, worth ${data.bells} bells! ${appraisal(data.rarity)} ${addFlower()}` }}
    toAkka.postSingleFishByMonths(akkaPayload,twitchPayload,botResponse)    
} 

let bugListRequest = (info) => {
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"streamerChannel" : info.streamerChannel, "viewer":info.viewer, "message" : `${info.viewer}, here are bugs for ${userFriendlyMonth(month)} : ${data.map(bug =>` ${bug.name}`)} ${addFlower()}`}}
    toAkka.postListBugByMonths(akkaPayload,twitchPayload,botResponse)    
}

let fishListRequest = (info) => {
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"streamerChannel" : info.streamerChannel, "viewer":info.viewer, "message" : `${info.viewer}, here are fishes for ${userFriendlyMonth(month)} : ${data.map(fish =>` ${fish.name}`)} ${addFlower()}`}}
    toAkka.postListFishByMonths(akkaPayload,twitchPayload,botResponse)    
}

let rarestBugRequest = (info) => {
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"streamerChannel" : info.streamerChannel, "viewer":info.viewer, "message" : (Object.keys(data).length === 0) ? `${info.viewer}, there are no super rare bugs in ${userFriendlyMonth(month)} ${addFlower()}` :`${info.viewer}, here are some super rare bugs for ${userFriendlyMonth(month)} : ${data.map(bug =>` ${bug.name}`)} ${addFlower()}`}}
    toAkka.postRarestListBugByMonths(akkaPayload,twitchPayload,botResponse)    
}

let rarestFishRequest = (info) => {
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"streamerChannel" : info.streamerChannel, "viewer":info.viewer, "message" : (Object.keys(data).length === 0) ? `${info.viewer}, there are no super rare fishes in ${userFriendlyMonth(month)} ${addFlower()}` :`${info.viewer}, here are some super rare fishes for ${userFriendlyMonth(month)} : ${data.map(fish =>` ${fish.name}`)} ${addFlower()}`}}
    toAkka.postRarestListFishByMonths(akkaPayload,twitchPayload,botResponse)    
}

publicConnection.connect()
publicConnection.on('chat', (channel, userstate, message, self) => {
    let info = {
        streamerChannel : channel,
        viewer : userstate["display-name"]
    }
    if(message == "!help") helpRequest(info)
    else if(message == "!bug" || message == "!Bug" ) bugCatchRequest(info)
    else if(message == "!fish" || message == "!Fish") fishCatchRequest(info)
    else if(message == "!listBug") bugListRequest(info)
    else if(message == "!listFish") fishListRequest(info)
    else if(message == "!listRareBug") rarestBugRequest(info)
    else if(message == "!listRareFish") rarestFishRequest(info)
}); 

// userstate = { 'badge-info': null,
//   badges: { broadcaster: '1' },
//   color: '#8A2BE2',
//   'display-name': 'MuteBard',
//   emotes: null,
//   flags: null,
//   id: '460194f5-9ba7-4554-858f-712e5ea43854',
//   mod: false,
//   'room-id': '93538777',
//   subscriber: false,
//   'tmi-sent-ts': '1584777881044',
//   turbo: false,
//   'user-id': '93538777',
//   'user-type': null,
//   'emotes-raw': null,
//   'badge-info-raw': null,
//   'badges-raw': 'broadcaster/1',
//   username: 'mutebard',
//   'message-type': 'chat' }