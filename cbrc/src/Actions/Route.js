const url = "http://localhost:5000/api/graphql"
const BUG = "bug"  
const FISH  = "fish" 
const Query = require('./Queries')
const Mutation = require('./Mutations')
const axios = require('axios')

let queryGraphQL = (query, callback) => {
    axios({
        url,
        method: 'post',
        data: { query }
    }).then(CBAS_response => {
        callback(CBAS_response.data.data)
    }).catch(error => {
        console.log(error) 
    })
}



exports.queryMarketUserData = (CBAS_Payload, setMarketUserState) => {
    let query = Query.GET_USER_MARKET(CBAS_Payload.username)
    queryGraphQL(query, setMarketUserState)
}

exports.queryMarketChartData = (CBAS_Payload, setMarketChartState) => {
    let query = Query.GET_MOVEMENTRECORD_MARKET()
    queryGraphQL(query, setMarketChartState)
}

exports.queryMarketVerificationData = (CBAS_Payload, setMarketUserVerificationState) => {
    let query = Query.GET_USER_MARKET_VALIDATION(CBAS_Payload.username, CBAS_Payload.business, CBAS_Payload.quantity)
    queryGraphQL(query, setMarketUserVerificationState)
}

exports.mutateMarketAcknowledgementData = (CBAS_Payload, updateUserState) => {
    let mutation = Mutation.UPDATE_USER_MARKET_TRANSACTION(CBAS_Payload.username, CBAS_Payload.business, CBAS_Payload.quantity, CBAS_Payload.marketPrice, CBAS_Payload.totalBells)
    queryGraphQL(mutation, updateUserState)
}

exports.queryUserPocket = (CBAS_Payload, setUserPocket) => {
    let query = Query.GET_USER_CATCH(CBAS_Payload.username)
    queryGraphQL(query, setUserPocket)
} 

exports.mutateCatchCatchOneCreature = async (CBAS_Payload, callback) => {
    let mutation = Mutation.UPDATE_USER_CATCH_CATCH_ONE(CBAS_Payload.username, CBAS_Payload.species)
    
    let CBAS_Response = await axios({
        url,
        method: 'post',
        data: { query : mutation }
    }).catch(error => {
        console.log(error) 
    })

    let catchCreature = CBAS_Response.data.data.catchCreature

    if(catchCreature == "BugOverflow" || catchCreature == "FishOverflow"){  
        // setUserPocket(CBAS_Response.data.catchCreature)
        console.log("TOO MANY")
    }else if(catchCreature.split("|")[0].trim() == "Success"){
        console.log(catchCreature)
        let creatureData = (catchCreature.split("|")[2].trim().split("")
        .map(char => {
            if(char == "#") return "\""
            else return char
        }).join(""))

        let rawData = JSON.parse(creatureData)

        let cleanedData = {
            name : rawData.name,
            bells: Number(rawData.bells),
            rarity : Number(rawData.rarity),
            img: rawData.img,
            availability : rawData.availability.split(" "),
            newCreature : true
        }

        callback(cleanedData)
    }

}
 

// exports.mutateCatchSellOneCreature (CBAS_Payload)

// exports.mutateCatchCSellAllSpecies = (CBAS_Payload)




