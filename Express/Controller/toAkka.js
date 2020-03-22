const axios = require('axios')
const root = "http://localhost:4774/api"
const options = require('../Configurations/options')


//GET
// exports.getAllBugs = async () => {
//     try{
//         let res = await axios.get(`${root}/allBugs`);
//         let data = res.data[0]
//         console.log(data);
//     }catch (error){
//         console.log(error)
//     }
// }

// exports.getAllFishes = async () => {
//     try{
//         let res = await axios.get(`${root}/allFishes`);
//         let data = res.data[0]
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

exports.postSingleFishByMonths = async (akkaPayload, twitchPayload, botResponse) => {
    try{
        let respFromAkka = await axios.post(`${root}/SingleRandomFishByMonths`, akkaPayload)
        let data = respFromAkka.data[0]
        let respToTwitch = twitchPayload(data)
        botResponse(respToTwitch.streamerChannel, respToTwitch.message)
        let AkkaPayload = { username : respToTwitch.viewer, fish : data }
        postUpdateUserData(AkkaPayload)
    }catch(error){
        console.log(error)
    }
}

exports.postSingleBugByMonths = async(akkaPayload, twitchPayload, botResponse) => {
    try{
        let respFromAkka = await axios.post(`${root}/SingleRandomBugByMonths`, akkaPayload)
        let data = respFromAkka.data[0]
        let respToTwitch = twitchPayload(data)
        botResponse(respToTwitch.streamerChannel, respToTwitch.message)
        let AkkaPayload = { username : respToTwitch.viewer, bug : data }
        postUpdateUserData(AkkaPayload)
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


exports.postUpdateUserData = async (akkaPayload) => {
    try{
        let route = ""
        if(akkaPayload.bug != undefined){
            route = "AddBugInPocket"
        }else if(akkaPayload.fish != undefined){
            route = "AddFishInPocket"
        }
        let respFromAkka = await axios.post(`${root}/${route}`, akkaPayload)
        //if response from respFromAkka is negative {
            postCreateUserData(akkaPayload)
        //}
    }catch(error){
        console.log(error)
    }
}

    exports.postCreateUserData = async (akkaPayload) => {
        let respFromTwitch = await axios({
            method: 'GET',
            url: `https://api.twitch.tv/helix/users?login=${akkaPayload.username}`,
            headers: options.settingsB.headers
        })

        let species = ""
        if(akkaPayload.bug != undefined){
            species = "BUG"
        }else if(akkaPayload.fish != undefined){
            species = "FISH"
        }

        AkkaPayload = {
            "id" :  respFromTwitch.data[0].id,
            "username" : akkaPayload.username,
            "fishingPoleLvl" : 1,
            "bugNetLvl" : 1,
            "bells" : 0,
            "turnips" : 0,
            "bugPocket" : species == "BUG" ? [akkaPayload.bug] : [],
            "fishPocket" : species == "FISH" ? [akkaPayload.fish] : [],
            "img" : respFromTwitch.data[0].profile_image_url
        }
            
        await axios.post(`${root}/ListRarestFishByMonths`, akkaPayload)


    }

    exports.postReadUserData = async (username) => {

    }
}


