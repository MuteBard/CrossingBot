const axios = require('axios')
const root = "http://localhost:4774/api"
const options = require('../Configurations/options')


//GET
exports.getUser = async(akkaPayload, twitchPayload, botResponse) => {
    try{
        let CBAS_response = await axios.get(`${root}/user/${akkaPayload.username}`)
        let data = CBAS_response.data
        botResponse(twitchPayload(data))
    }catch(error){
        botResponse(twitchPayload(null))
    }
}

// POST
exports.postSellCreature = async(info, twitchPayload, botResponse) => {
    try{
        let CBAS_response = await axios.post(`${root}/user/sell/${info.species}`, info)
        let data = respFromAkka.data
        let respToTwitch = twitchPayload()
    }catch(error){

    }
}


exports.postListCreaturesByMonth = async(info, twitchPayload, botResponse) => {
    let availability = {"availability" : info.availability}
    try{
        let CBAS_response = await axios.post(`${root}/List${info.species}ByMonth`, availability)
        let data = CBAS_response.data
        botResponse(twitchPayload(data))
    }catch(error){
        botResponse(twitchPayload(null))
        console.log(error)
    }
}


exports.postRareCreaturesListByMonth = async(info, twitchPayload, botResponse) => {
    let availability = {"availability" : info.availability}
    try{
        let CBAS_response = await axios.post(`${root}/ListRarest${info.species}ByMonth`, availability)
        let data = CBAS_response.data
        botResponse(twitchPayload(data))
    }catch(error){
        botResponse(twitchPayload(null))
        console.log(error)
    }
}

exports.postCreatureCatchRequest = async (info, twitchPayload, botResponse) => {

    let availability = {"availability" : info.availability}
    try{
        let CBAS_response = await axios.post(`${root}/retrieveOne${info.species}ByMonth`, availability)
        let data = CBAS_response.data
        let twitchData = twitchPayload(data)
        botResponse(twitchData)

        let pocket = {
            "bug" : info.species ==  "Bug" ? [data] : [],
            "fish" : info.species == "Fish" ? [data] : []
        }

        let userPayload = {
            "_id" :  0,
            "username" : info.viewer,
            "fishingPoleLvl" : 1,
            "bugNetLvl" : 1,
            "bells" : 0,
            "pocket" : pocket,
            "turnips" : 0,
            "img" : "-"
        }
        postUpdateUserPocket(userPayload)
    }catch(error){
        botResponse(twitchPayload(null))
        console.log(error)
    }
}

let postUpdateUserPocket = async (userPayload) => {
    try{
        let CBAS_response = await axios.post(`${root}/AddToPocket`, userPayload)
        if (CBAS_response.data == "Incomplete, user does not exist. Need to create user to associate to pocket"){
            postCreateUserData(userPayload)
        }
    }catch(error){
        console.log(error, userPayload)
    }
}

let postCreateUserData = async (userPayload) => {

    try{
        // let respFromTwitch = await axios({
        //     method: 'GET',
        //     url: `https://api.twitch.tv/helix/users?login=${username}`,
        //     headers: options.settingsB.headers
        // })

        let newUserPayload = {
            "_id" :  77777,//Number(respFromTwitch.data.data[0].id),
            "username" : userPayload.username,
            "fishingPoleLvl" : 1,
            "bugNetLvl" : 1,
            "bells" : 0,
            "pocket" : userPayload.pocket,
            "turnips" : 0,
            "img" : "png"//respFromTwitch.data.data[0].profile_image_url
        }
        
        await axios.post(`${root}/AddUser`, newUserPayload)
    }catch(error){
        console.log(error, newUserPayload)
    }
}




