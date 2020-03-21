const axios = require('axios')
const root = "http://localhost:4774/api"


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
        botResponse(respToTwitch.streamerChannel, respToTwitch.message)
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


