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
        console.log(CBAS_response.data.data)
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
    let query = Query.GET_MARKET_CHART_TODAY()
    queryGraphQL(query, setMarketChartState)
}

exports.queryMarketVerificationData = (CBAS_Payload, setMarketUserVerificationState) => {
    let query = Query.GET_USER_MARKET_VALIDATION(CBAS_Payload.username, CBAS_Payload.business, CBAS_Payload.quantity)
    queryGraphQL(query, setMarketUserVerificationState)
}

exports.mutateMarketAcknowledgementData = (CBAS_Payload, updateUserState) => {

}