const axios = require('axios')
const root = "http://localhost:4774/api"
const options = require('../Configurations/options')
const BUG = "bug"  
const FISH  = "fish" 

//GET 
//${root}/user/Mutebard`
exports.getUser = async(info, twitchPayload, botResponse) => {
    try{
        let CBAS_response = await axios.get(`${root}/user/${info.username}`)
        botResponse(twitchPayload(CBAS_response.data))
    }catch(error){
        botResponse(twitchPayload(null))
        errorLog(error, info)
    }
}

exports.getTurnips = async(info, twitchPayload, botResponse) => {
    try{
        let CBAS_response = await axios.get(`${root}/turnips`)
        botResponse(twitchPayload(CBAS_response.data))
    }catch(error){
        botResponse(twitchPayload(null))
        errorLog(error, info)    
    }
}

// POST 
// `${root}/see/one`
exports.postSellOne = async(info, twitchPayload, botResponse) => {
    let payload =  {"username" :  info.viewer, "creature" : info.creature, "species" : info.species} 
    try{
        let CBAS_response = await axios.post(`${root}/sell/one`, payload)
        botResponse(twitchPayload(CBAS_response.data))
    }catch(error){
        botResponse(twitchPayload(null))
        errorLog(error, info)
    }
}

exports.postSellAll = async(info, twitchPayload, botResponse) => {
    let payload =  {"username" :  info.viewer, "creature" : "", "species" : ""} 
    try{
        let CBAS_response = await axios.post(`${root}/sell/all`, payload)
        botResponse(twitchPayload(CBAS_response.data))
    }catch(error){
        botResponse(twitchPayload(null))
        errorLog(error, info)
    }
}

exports.postPendingTransaction = async(info, twitchPayload, botResponse) => {
    let payload = info.transaction
    try{
        let CBAS_response = await axios.post(`${root}/pendingTurnipTransaction`, payload)
        botResponse(twitchPayload(CBAS_response.data))
    }catch(error){
        botResponse(twitchPayload(null))
        // errorLog(error, info)
    }
}

exports.postExecuteTransaction = async(info, twitchPayload, botResponse) => {
    let payload = info.transaction
    console.log(payload)
    try{
        let CBAS_response = await axios.post(`${root}/executingTurnipTransaction`, payload)
        console.log(CBAS_response.data)
        botResponse(twitchPayload(CBAS_response.data))
    }catch(error){
        botResponse(twitchPayload(null))
        errorLog(error, info)
    }
}

// `${root}/listByMonth/bug` or `${root}/listByMonth/fish`
exports.postListByMonth = async(info, twitchPayload, botResponse) => {
    let availability = {"availability" : info.availability}
    try{
        let CBAS_response = await axios.post(`${root}/listByMonth/${info.species}`, availability)
        botResponse(twitchPayload(CBAS_response.data))
    }catch(error){
        botResponse(twitchPayload(null))
        errorLog(error, info)
    }
}

// `${root}/listRarestByMonth/bug` or `${root}/listRarestByMonth/fish`
exports.postRareListByMonth = async(info, twitchPayload, botResponse) => {
    let availability = {"availability" : info.availability}
    try{
        let CBAS_response = await axios.post(`${root}/listRarestByMonth/${info.species}`, availability)
        botResponse(twitchPayload(CBAS_response.data))
    }catch(error){
        botResponse(twitchPayload(null))
        errorLog(error, info)
    }
}

// `${root}/retrieveOneByMonth/bug` or `${root}/retrieveOneByMonth/fish`
exports.postCatchRequest = async (info, twitchPayload, botResponse) => {
    let availability = {"availability" : info.availability}
    try{

        let CBAS_response = await axios.post(`${root}/retrieveOneByMonth/${info.species}`, availability)
        let data = CBAS_response.data     

        let twitchData = twitchPayload(CBAS_response.data)
        botResponse(twitchData)

        let pocket = {
            "bug" : info.species == BUG ? [data] : [],
            "fish" : info.species == FISH ? [data] : []
        }

        liveTurnips = {
            "business": "",
            "quantity": 0,
            "marketPrice" :  0,
            "totalBells": 0,
            "netGainLossAsBells" :  0,
            "netGainLossAsPercentage":  0
        }

        let userPayload = {
            "_id" :  0,
            "username" : info.viewer,
            "fishingPoleLvl" : 1,
            "bugNetLvl" : 1,
            "bells" : 0,
            "pocket" : pocket,
            "liveTurnips" : liveTurnips,
            "turnipTransactionHistory" : [],
            "img" : "-"
        }
        postUpdateUserPocket(userPayload)
    }catch(error){
        botResponse(twitchPayload(null))
        errorLog(error, info)          
    }
}

// `${root}/addToPocket`
let postUpdateUserPocket = async (userPayload) => {
    try{
        let CBAS_response = await axios.post(`${root}/addToPocket`, userPayload)
        if (CBAS_response.data == "Incomplete, user does not exist. Need to create user to associate to pocket"){
            postCreateUserData(userPayload)
        }
    }catch(error){
        errorLog(error, userPayload)
    }
}

// `${root}/addUser`
let postCreateUserData = async (userPayload) => {

    try{
        // let respFromTwitch = await axios({
        //     method: 'GET',
        //     url: `https://api.twitch.tv/helix/users?login=${username}`,
        //     headers: options.settingsB.headers
        // })

        userPayload["_id"] = 7777 //Number(respFromTwitch.data.data[0].id)
        userPayload["img"] = "k"//respFromTwitch.data.data[0].profile_image_url
        
        await axios.post(`${root}/addUser`, userPayload)
    }catch(error){
        errorLog(error, userPayload)
    }
}

let errorLog = (error, payload) => {
    // response = {
    //     url : error.config.url,
    //     method : error.config.method,
    //     data: error.config.data,
    //     headers: error.config.headers
    // }
    // console.log("\n\nCheck to see if CBAS and CBTC paths match")
    // console.log("\nRestart CBAS And CBTC for applying recent path changes")
    // console.log("\nSomething might be wrong with request :", response)
    console.log("\nSomething might be wrong payloads :", payload)
    console.log(error)
}