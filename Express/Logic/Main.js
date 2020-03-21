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

let botResponse = (viewer, message) => publicConnection.action(viewer, message)

let appraisal = (rarity) => {
    if (rarity == 5) return "YOU ARE EXTREMELY LUCKY! OSFrog"
    else if (rarity == 4) return "Nice! That one is very rare!" 
    else if (rarity == 3) return "That one is a bit rare!"
    else return ""
}

let bugCaughtBy = (viewer) => {
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"viewer" : viewer, "message" : `You caught a ${data.name}, worth ${data.bells} bells! ${appraisal(data.rarity)}` }}
    toAkka.postSingleBugByMonths(akkaPayload,twitchPayload,botResponse)    
} 

let fishCaughtBy = (viewer) => {
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"viewer" : viewer, "message" : `You caught a ${data.name}, worth ${data.bells} bells! ${appraisal(data.rarity)}` }}
    toAkka.postSingleFishByMonths(akkaPayload,twitchPayload,botResponse)    
} 

let bugListRequestedBy = (viewer) => {
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"viewer" : viewer, "message" : `Here are bugs for ${userFriendlyMonth(month)} : ${data.map(bug =>` ${bug.name}`)}`}}
    toAkka.postListBugByMonths(akkaPayload,twitchPayload,botResponse)    
}

let fishListRequestedBy = (viewer) => {
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"viewer" : viewer, "message" : `Here are fishes for ${userFriendlyMonth(month)} : ${data.map(fish =>` ${fish.name}`)}`}}
    toAkka.postListFishByMonths(akkaPayload,twitchPayload,botResponse)    
}

let rarestBugRequestedBy = (viewer) => {
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"viewer" : viewer, "message" : (Object.keys(data).length === 0) ? `There are no super rare bugs in ${userFriendlyMonth(month)}` :`Here are some super rare bugs for ${userFriendlyMonth(month)} : ${data.map(bug =>` ${bug.name}`)}`}}
    toAkka.postRarestListBugByMonths(akkaPayload,twitchPayload,botResponse)    
}

let rarestFishRequestedBy = (viewer) => {
    console.log("kjdhkajhdsajhdksjahdkj")
    let akkaPayload = {"availability" : month } 
    function twitchPayload (data) { return {"viewer" : viewer, "message" : (Object.keys(data).length === 0) ? `There are no super rare fishes in ${userFriendlyMonth(month)}` :`Here are some super rare fishes for ${userFriendlyMonth(month)} : ${data.map(fish =>` ${fish.name}`)}`}}
    toAkka.postRarestListFishByMonths(akkaPayload,twitchPayload,botResponse)    
}


publicConnection.connect()
publicConnection.on('chat', (channel, userstate, message, self) => {
    var viewer = userstate["display-name"]
    if(message == "!bug" || message == "!Bug" ) bugCaughtBy(viewer)
    else if(message == "!fish" || message == "!Fish") fishCaughtBy(viewer)
    else if(message == "!listBug") bugListRequestedBy(viewer)
    else if(message == "!listFish") fishListRequestedBy(viewer)
    else if(message == "!listRareBug") rarestBugRequestedBy(viewer)
    else if(message == "!listRareFish") rarestFishRequestedBy(viewer)
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