const axios = require('axios')
const root = "http://localhost:4774/api"
const options = require('../Configurations/options')


//GET
// exports.getAllBugs = async () => {
//     try{
//         let res = await axios.get(`${root}/allBugs`);
//         let data = res.data
//         console.log(data);
//     }catch (error){
//         console.log(error)
//     }
// }

// exports.getAllFishes = async () => {
//     try{
//         let res = await axios.get(`${root}/allFishes`);
//         let data = res.data
//         console.log(data);
//     }catch (error){
//         console.log(error)
//     }
// }

// POST
exports.postListBugByMonths = async(akkaPayload, twitchPayload, botResponse) => {
    try{
        let respFromAkka = await axios.post(`${root}/ListBugByMonths`, akkaPayload)
        let data = respFromAkka.data
        let respToTwitch = twitchPayload(data)
        botResponse(respToTwitch.viewer, respToTwitch.message)
    }catch(error){
        console.log(error)
    }
}

exports.postListFishByMonths = async(akkaPayload, twitchPayload, botResponse) => {
    try{
        let respFromAkka = await axios.post(`${root}/ListFishByMonths`, akkaPayload)
        let data = respFromAkka.data
        let respToTwitch = twitchPayload(data)
        botResponse(respToTwitch.streamerChannel, respToTwitch.message)
    }catch(error){
        console.log(error)
    }
}
exports.postRarestListBugByMonths = async(akkaPayload, twitchPayload, botResponse) => {
    try{
        let respFromAkka = await axios.post(`${root}/ListRarestBugByMonths`, akkaPayload)
        let data = respFromAkka.data
        let respToTwitch = twitchPayload(data)
        botResponse(respToTwitch.streamerChannel, respToTwitch.message)
    }catch(error){
        console.log(error)
    }
}

exports.postRarestListFishByMonths = async(akkaPayload, twitchPayload, botResponse) => {
    try{
        let respFromAkka = await axios.post(`${root}/ListRarestFishByMonths`, akkaPayload)
        let data = respFromAkka.data
        let respToTwitch = twitchPayload(data)
        botResponse(respToTwitch.streamerChannel, respToTwitch.message)
    }catch(error){
        console.log(error)
    }
}

exports.postSingleFishByMonths = async (akkaPayload, twitchPayload, botResponse) => {
    try{
        console.log(akkaPayload)
        let respFromAkka = await axios.post(`${root}/retrieveOneFishByMonths`, akkaPayload)
        let data = respFromAkka.data
        let respToTwitch = twitchPayload(data)
        botResponse(respToTwitch.streamerChannel, respToTwitch.message)

        let userPayload = {
            "_id" :  0,
            "username" : respToTwitch.viewer,
            "fishingPoleLvl" : 1,
            "bugNetLvl" : 1,
            "bells" : 0,
            "pocket" : {
                bug : [],
                fish : [data]
            },
            "turnips" : 0,
            "img" : "-"
        }
        postUpdateUserPocket(userPayload)
    }catch(error){
        console.log(error)
    }
}

exports.postSingleBugByMonths = async(akkaPayload, twitchPayload, botResponse) => {
    try{
        
        let respFromAkka = await axios.post(`${root}/retrieveOneBugByMonths`, akkaPayload)
        let data = respFromAkka.data
        let respToTwitch = twitchPayload(data)
        botResponse(respToTwitch.streamerChannel, respToTwitch.message)
        let userPayload = {
            "_id" :  0,
            "username" : respToTwitch.viewer,
            "fishingPoleLvl" : 1,
            "bugNetLvl" : 1,
            "bells" : 0,
            "pocket" : {
                "bug" : [data],
                "fish" : []
            },
            "turnips" : 0,
            "img" : ""
        }
        postUpdateUserPocket(userPayload)
    }catch(error){
        console.log(error)
    }
}

let postUpdateUserPocket = async (userPayload) => {
    try{
        let respFromAkka = await axios.post(`${root}/AddToPocket`, userPayload)
        if (respFromAkka.data == "Incomplete, user does not exist. Need to create user to associate to pocket"){
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
        
        let respFromAkka = await axios.post(`${root}/AddUser`, newUserPayload)
    }catch(error){
        console.log(error, newUserPayload)
    }
}



