const generator = require('generate-password');
const uri = 'http://localhost:5000/api/graphql'
const headers = require('../Configurations/Options').settings_B.headers
const BUG = "bug"  
const FISH  = "fish" 
const axios = require('axios')
const Query = require('./Queries')
const Mutation = require('./Mutations')
const minutes = require('../Cron/Timing').minutes
const CBTC_DataBank = require('../FlashData/Bank')
// const duration = minutes(5)
const { createApolloFetch } = require('apollo-fetch');
const fetch = createApolloFetch({ uri })

const pwOptions = 

//REST (server)
exports.rest = (app) => {
    app.post('/authenticateUser', (req, res) => {
        let CBAS_Payload = {"username" : req.body.username }

        let CBRC_Payload = (data) => {
            let i = 0;
            let intervalId = setInterval(() => { 
                if(CBTC_DataBank.hasInvitedUser(req.body.username)){
                    clearInterval(intervalId);
                    res.send(data)
                }
                if(i > 300){
                    res.send({responded : false, error : 'No response given on twitch'})
                }
                i++
             }, 1000);
        }

        queryUser(CBAS_Payload, CBRC_Payload)

    })
}


//GRAPHQL (client)
let queryGraphQL = (query, callback) => {
    fetch({ query })
    .then(CBAS_response => {
        callback(CBAS_response.data)
    }).catch(error =>{
        callback(null)
        console.log(error)
    }) 
}

exports.queryAllBugs = (CBTC_DataBank) => {
    let query = Query.ALL_BUGS
    queryGraphQL(query, CBTC_DataBank)
}

exports.queryAllFishes = (CBTC_DataBank) => {
    let query = Query.ALL_FISHES
    queryGraphQL(query, CBTC_DataBank)
}

exports.queryAllAddedUsers = (CBTC_DataBank) => {
    let query = Query.ALL_ADDED_USERS
    queryGraphQL(query, CBTC_DataBank)
}

exports.mutateAddCBforUser = (CBAS_Payload, callback) => {
    let mutation = Mutation.UPDATE_USER_HOME_SET_CROSSINGBOT(CBAS_Payload.username, CBAS_Payload.added)
    queryGraphQL(mutation, callback)
}

exports.queryCreature = (CBAS_Payload, Twitch_Payload) => {
    let query = ""
    if(CBAS_Payload.species == "bug"){
        query = Query.BUG_BY_NAME(CBAS_Payload.creatureName)
    }else if(CBAS_Payload.species == "fish"){
        query = Query.FISH_BY_NAME(CBAS_Payload.creatureName)
    }
    queryGraphQL(query, Twitch_Payload)
}

exports.queryUserBells = (CBAS_Payload, Twitch_Payload) => {
    let query = Query.USER_BELLS_REQUEST(CBAS_Payload.username)
    queryGraphQL(query, Twitch_Payload)
}

exports.queryUserPocket = (CBAS_Payload, Twitch_Payload) => {
    let query = Query.USER_POCKET_REQUEST(CBAS_Payload.username)
    queryGraphQL(query, Twitch_Payload)
}

exports.mutateUserPocketCatch = (CBAS_Payload, Twitch_Payload) => {
    let firstMutation = Mutation.CATCH_REQUEST(CBAS_Payload.username, CBAS_Payload.species)
    //Update or create user with new bug or fish
    fetch({ query : firstMutation })
    .then(async CBAS_Response => {
        if(CBAS_Response.data.catchCreature == "BugOverflow" || CBAS_Response.data.catchCreature == "FishOverflow"){  
            Twitch_Payload(CBAS_Response.data.catchCreature)

        }else if( CBAS_Response.data.catchCreature.split("|")[0].trim() == "Success"){
            let operation = CBAS_Response.data.catchCreature.split("|")[1].trim()
            let creatureData = (CBAS_Response.data.catchCreature.split("|")[2].trim().split("")
            .map(char => {
                if(char == "#") return "\""
                else return char
            }).join(""))
            
            Twitch_Payload(JSON.parse(creatureData))

            if (operation == "Create"){
        
                let Twitch_Response = await axios({
                    method: 'GET',
                    url: `https://api.twitch.tv/helix/users?login=${ CBAS_Payload.username }`,
                    headers,
                })
                .catch(error => console.log(error))
                CBAS_Payload["id"] = Number(Twitch_Response.data.data[0].id)
                CBAS_Payload["avatar"] = Twitch_Response.data.data[0].profile_image_url 
                var secondMutation = Mutation.COMPLETE_USER_CREATION(CBAS_Payload.username, CBAS_Payload.id, CBAS_Payload.avatar)
                
                //do a final mutation to the user and update those fields on the user
                setTimeout(() => {
                    fetch({ query : secondMutation })
                    .then(Second_CBAS_Response => {
                        if(Second_CBAS_Response.data.finalizeUserCreation == "Success"){
                            console.log(`User creation of ${CBAS_Payload.username} is complete`)
                        }
                    })
                    .catch(error => console.log(error)) 
                }, 3000);
            }
        }
    }) 
    .catch(error => console.log(error)) 
}

exports.mutateUserPocketSellOne = (CBAS_Payload, Twitch_Payload) => {
    let mutation = Mutation.SELL_ONE_CREATURE(CBAS_Payload.username, CBAS_Payload.species, CBAS_Payload.creatureName)
    queryGraphQL(mutation, Twitch_Payload)
}

exports.mutateUserPocketSellAll = (CBAS_Payload, Twitch_Payload) => {
    let mutation = Mutation.SELL_ALL_CREATURES(CBAS_Payload.username)
    queryGraphQL(mutation, Twitch_Payload)
}

exports.queryRareCreatures = (CBAS_Payload, Twitch_Payload) => {
    let query = ""
    if(CBAS_Payload.species == "fish"){
        query = Query.RARE_FISHES_THIS_MONTH
    }else if(CBAS_Payload.species == "bug"){
        query = Query.RARE_BUGS_THIS_MONTH
    }
    queryGraphQL(query, Twitch_Payload)
}

exports.queryUserTurnipTransactionStatus = (CBAS_Payload, Twitch_Payload) => {
    let query = Query.VALIDATE_TRANSACTION(CBAS_Payload.username, CBAS_Payload.business, CBAS_Payload.quantity)
    queryGraphQL(query, Twitch_Payload)
}

exports.mutateUserTurnipTransactionStatus = (CBAS_Payload, Twitch_Payload) => {
    let query = Mutation.ACKNOWLEDGE_TRANSACTION(CBAS_Payload.username, CBAS_Payload.business, CBAS_Payload.quantity, CBAS_Payload.marketPrice, CBAS_Payload.totalBells)
    queryGraphQL(query, Twitch_Payload)
}

exports.queryMarketPrice = (Twitch_Payload) => {
    let query = Query.TURNIP_PRICES
    queryGraphQL(query, Twitch_Payload)
}


exports.queryTurnipStatsRequest = (CBAS_Payload, Twitch_Payload) => {
    let query = Query.USER_TURNIP_STATS_REQUEST(CBAS_Payload.username)
    queryGraphQL(query, Twitch_Payload)
}

let queryUser = (CBAS_Payload, CBRC_Payload) => {
    let CBRC_Data = {}
    CBRC_Data["responded"] = true
    let query = Query.USER_EXISTS_REQUEST(CBAS_Payload.username)

    fetch({ query })
    .then(async CBAS_response => {
        if(CBAS_response.data.getDoesUserExist == true){
            //1A
            CBRC_Data["userExists"] = true
            let query_2 = Query.USER_PW_EXISTS_REQUEST(CBAS_Payload.username)
            fetch({query : query_2 })
            .then(CBAS_response => {
                if(CBAS_response.data.getUser.encryptedPw != "" ){
                    CBRC_Data["pwExists"] = true      
                }else{
                    CBRC_Data["pwExists"] = false
                }
                CBRC_Payload(CBRC_Data)
            })
            
        }else{
            //1B
            CBRC_Data["userExists"] = false
            CBRC_Data["pwExists"] = false
            let Twitch_Response = await axios({
                method: 'GET',
                url: `https://api.twitch.tv/helix/users?login=${ CBAS_Payload.username }`,
                headers,
            })
            .catch(error => console.log(error))
            CBRC_Data["id"] = Number(Twitch_Response.data.data[0].id)
            CBRC_Data["avatar"] = Twitch_Response.data.data[0].profile_image_url 
            CBRC_Payload(CBRC_Data)
        }
    }).catch(error =>{
        console.log(error)
    })    
}

                    // CBRC_Data["pw"] = generator.generate({
                    //     length : 12,
                    //     numbers : true,
                    //     lowercase : true,
                    //     uppercase : true,
                    //     symbols : true,
                    //     excludeSimilarCharacters : true,
                    // });
                    // let encryptedPw = CBRC_Data["pw"] 
                    // let mutate_2B = Mutation.UPDATE_USER_PW(CBAS_Payload.username, encryptedPw )
                    // fetch({ query : mutate_2B })
                    // .then(CBAS_Response => {
                    //     if(CBAS_Response.data.updateEncryptedPw == "Success"){
                    //         console.log(`[2B]: ${CBAS_Payload.username} account is updated`)
                    //         CBRC_Payload(CBRC_Data)
                    //     }
                    // })
                    // .catch(error => console.log(error)) 