const uri = "http://localhost:5000/api/graphql"
const options = require('../Configurations/options')
const BUG = "bug"  
const FISH  = "fish" 
const axios = require('axios')
const Query = require('./Queries')
const Mutation = require('./Mutations')
const { createApolloFetch } = require('apollo-fetch');
const fetch = createApolloFetch({ uri })


let queryGraphQL = (query, Twitch_Payload) => {
    fetch({ query })
    .then(CBAS_response => {
        Twitch_Payload(CBAS_response.data)
    }).catch(error =>{
        Twitch_Payload(null)
        console.log(error)
    }) 
}


exports.queryUserBells = (CBAS_Payload, Twitch_Payload) => {
    let query = Query.USER_BELLS_REQUEST(CBAS_Payload.username)
    queryGraphQL(query, Twitch_Payload)
}

exports.queryUserPocket = (CBAS_Payload, Twitch_Payload) => {
    let query = Query.USER_POCKET_REQUEST(CBAS_Payload.username)
    queryGraphQL(query, Twitch_Payload)
}

exports.queryCreatureSummary = (CBAS_Payload, Twitch_Payload) => {
    let query = Query.CREATURE_SUMMARY_BY_NAME(CBAS_Payload.creatureName)
    queryGraphQL(query, Twitch_Payload)
}


exports.mutateUserPocket = (CBAS_Payload, Twitch_Payload) => {
    let mutateUser = Mutation.CATCH_REQUEST(CBAS_Payload.username, CBAS_Payload.species)
    //Update or create user with new bug or fish
    fetch({ query : mutateUser })
    .then(CBAS_Response => {
        console.log('CBAS_Response', CBAS_Response)
        if(CBAS_Response.data.catchCreature == "Success"){
            let queryUser = ""
            if(CBAS_Payload.species == BUG){
                queryUser = Query.USER_BUG_REQUEST(CBAS_Payload.username, CBAS_Payload.species)
            }else if(CBAS_Payload.species == FISH){
                queryUser = Query.USER_FISH_REQUEST(CBAS_Payload.username, CBAS_Payload.species)
            }
            //get that user
            fetch({ query : queryUser })
            .then(async (Second_CBAS_Response) => {
                console.log('Second_CBAS_Response', Second_CBAS_Response)
                let user = Second_CBAS_Response.data.getUser
                //display to the user their newly caught bug on twitch
                Twitch_Payload(user)
                //check to see if that user is new with their id and avatar not initialized (One time per user)
                if(user.id == -1){
                    //get id and avatar data from twitch api
                    try{
                        let respFromTwitch = await axios({
                            method: 'GET',
                            url: `https://api.twitch.tv/helix/users?login=${CBAS_Payload.username}`,
                            headers: options.settingsB.headers
                        })

                        CBAS_Payload["id"] = Number(respFromTwitch.data.data[0].id)
                        CBAS_Payload["avatar"] = respFromTwitch.data.data[0].profile_image_url
                        let mutateUser2 = Mutation.COMPLETE_USER_CREATION(CBAS_Payload.username, CBAS_Payload.id, CBAS_Payload.avatar)
                        //do a final mutation to the user and update those fields on the user
                        fetch({ query : mutateUser2 })
                        .then(Third_CBAS_Response => {
                            if(Third_CBAS_Response.data.finalizeUserCreation == "Success"){
                                console.log(`User creation of ${CBAS_Payload.username} is complete`)
                            }else{

                            }
                        })
                    }catch(error){
                        console.log(`Mutation Failed: User creation of ${CBAS_Payload.username} has failed : ${error}`)
                    }
                }
            })
        }else{
            Twitch_Payload(null)
            console.log(`Mutation Failed: Unable to either update or create ${CBAS_Payload.username} with new creature`)
        }
    })
    .catch(error =>{
        Twitch_Payload(null)
        console.log(error)
    }) 
}



// exports.queryTurnips = (info, twitchPayload, botResponse) => {
//     queryGraphQL(Query.TURNIP_PRICES, twitchPayload, botResponse)
// }

// exports.queryFishesByMonth = (info, twitchPayload, botResponse) => {
//     queryGraphQL(Query.FISHES_BY_MONTH, twitchPayload, botResponse)
// }

// exports.queryBugsByMonth = (info, twitchPayload, botResponse) => {
//     queryGraphQL(Query.BUGS_BY_MONTH, twitchPayload, botResponse)
// }

// exports.queryRareFishesByMonth = (info, twitchPayload, botResponse) => {
//     queryGraphQL(Query.RARE_FISHES_BY_MONTH, twitchPayload, botResponse)
// }

// exports.queryRareBugsByMonth = (info, twitchPayload, botResponse) => {
//     queryGraphQL(Query.RARE_BUGS_BY_MONTH, twitchPayload, botResponse)
// }

// exports.mutateSellOne = (info, twitchPayload, botResponse) => {
//     let mutation = Mutation.SELL_ONE_CREATURE(info.username, info.species, info.creature)
//     fetch({ mutation })
//     .then(CBAS_Response => {
//         botResponse(twitchPayload(CBAS_Response.data))
//     })
//     .catch(error =>{
//         botResponse(twitchPayload(null))
//         console.log(error)
//     }) 
// }

// exports.mutateSellAll = (info, twitchPayload, botResponse) => {
//     let mutation = Mutation.SELL_ONE_CREATURE(info.username)
//     fetch({ mutation })
//     .then(CBAS_Response => {
//         botResponse(twitchPayload(CBAS_Response.data))
//     })
//     .catch(error =>{
//         botResponse(twitchPayload(null))
//         console.log(error)
//     }) 
// }


// exports.queryPendingTransaction = (info, twitchPayload, botResponse) => {

// }

// exports.postPendingTransaction = async(info, twitchPayload, botResponse) => {
//     let payload = info.transaction
//     try{
//         let CBAS_response = await axios.post(`${root}/pendingTurnipTransaction`, payload)
//         botResponse(twitchPayload(CBAS_response.data))
//     }catch(error){
//         botResponse(twitchPayload(null))
//         // errorLog(error, info)
//     }
// }

// exports.postExecuteTransaction = async(info, twitchPayload, botResponse) => {
//     let payload = info.transaction
//     console.log(payload)
//     try{
//         let CBAS_response = await axios.post(`${root}/executingTurnipTransaction`, payload)
//         console.log(CBAS_response.data)
//         botResponse(twitchPayload(CBAS_response.data))
//     }catch(error){
//         botResponse(twitchPayload(null))
//         errorLog(error, info)
//     }
// }

// // `${root}/listByMonth/bug` or `${root}/listByMonth/fish`
// exports.postListByMonth = async(info, twitchPayload, botResponse) => {
//     let availability = {"availability" : info.availability}
//     try{
//         let CBAS_response = await axios.post(`${root}/listByMonth/${info.species}`, availability)
//         botResponse(twitchPayload(CBAS_response.data))
//     }catch(error){
//         botResponse(twitchPayload(null))
//         errorLog(error, info)
//     }
// }

// // `${root}/listRarestByMonth/bug` or `${root}/listRarestByMonth/fish`
// exports.postRareListByMonth = async(info, twitchPayload, botResponse) => {
//     let availability = {"availability" : info.availability}
//     try{
//         let CBAS_response = await axios.post(`${root}/listRarestByMonth/${info.species}`, availability)
//         botResponse(twitchPayload(CBAS_response.data))
//     }catch(error){
//         botResponse(twitchPayload(null))
//         errorLog(error, info)
//     }
// }

// // `${root}/retrieveOneByMonth/bug` or `${root}/retrieveOneByMonth/fish`
// exports.postCatchRequest = async (info, twitchPayload, botResponse) => {
//     let availability = {"availability" : info.availability}
//     try{

//         let CBAS_response = await axios.post(`${root}/retrieveOneByMonth/${info.species}`, availability)
//         let data = CBAS_response.data     

//         let twitchData = twitchPayload(CBAS_response.data)
//         botResponse(twitchData)

//         let pocket = {
//             "bug" : info.species == BUG ? [data] : [],
//             "fish" : info.species == FISH ? [data] : []
//         }

//         liveTurnips = {
//             "business": "",
//             "quantity": 0,
//             "marketPrice" :  0,
//             "totalBells": 0,
//             "netGainLossAsBells" :  0,
//             "netGainLossAsPercentage":  0
//         }

//         let userPayload = {
//             "_id" :  0,
//             "username" : info.viewer,
//             "fishingPoleLvl" : 1,
//             "bugNetLvl" : 1,
//             "bells" : 0,
//             "pocket" : pocket,
//             "liveTurnips" : liveTurnips,
//             "turnipTransactionHistory" : [],
//             "img" : "-"
//         }
//         postUpdateUserPocket(userPayload)
//     }catch(error){
//         botResponse(twitchPayload(null))
//         errorLog(error, info)          
//     }
// }

// // `${root}/addToPocket`
// let postUpdateUserPocket = async (userPayload) => {
//     try{
//         let CBAS_response = await axios.post(`${root}/addToPocket`, userPayload)
//         if (CBAS_response.data == "Incomplete, user does not exist. Need to create user to associate to pocket"){
//             postCreateUserData(userPayload)
//         }
//     }catch(error){
//         errorLog(error, userPayload)
//     }
// }

// // `${root}/addUser`
// let postCreateUserData = async (userPayload) => {

//     try{
//         // let respFromTwitch = await axios({
//         //     method: 'GET',
//         //     url: `https://api.twitch.tv/helix/users?login=${username}`,
//         //     headers: options.settingsB.headers
//         // })

//         userPayload["_id"] = 7777 //Number(respFromTwitch.data.data[0].id)
//         userPayload["img"] = "k"//respFromTwitch.data.data[0].profile_image_url
        
//         await axios.post(`${root}/addUser`, userPayload)
//     }catch(error){
//         errorLog(error, userPayload)
//     }
// }

// let errorLog = (error, payload) => {
//     // response = {
//     //     url : error.config.url,
//     //     method : error.config.method,
//     //     data: error.config.data,
//     //     headers: error.config.headers
//     // }
//     // console.log("\n\nCheck to see if CBAS and CBTC paths match")
//     // console.log("\nRestart CBAS And CBTC for applying recent path changes")
//     // console.log("\nSomething might be wrong with request :", response)
//     console.log("\nSomething might be wrong payloads :", payload)
//     console.log(error)
// }


// // let query = Query.USER_REQUEST(info.viewer)
// // fetch({ query })
// // .then(CBAS_UserRequest_Response => {
// //     data = {user : CBAS_UserRequest_Response.data, sold: CBAS_SellOne_Response.data}
// //     console.log(data)
// //     botResponse(twitchPayload(data))
// // }).catch(error =>{
// //     botResponse(twitchPayload(null))
// //     console.log(error)
// // })