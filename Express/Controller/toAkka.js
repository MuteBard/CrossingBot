const axios = require('axios')
const root = "http://localhost:4774/api"


//GET
exports.getAllBugs = async () => {
    try{
        let res = await axios.get(`${root}/allBugs`);
        let data = res.data;
        console.log(data);
    }catch (error){
        console.log(error)
    }
}

exports.getAllFishes = async () => {
    try{
        let res = await axios.get(`${root}/allFishes`);
        let data = res.data;
        console.log(data);
    }catch (error){
        console.log(error)
    }
}

//POST
exports.postListBugByMonths = async(months) => {
    try{
        let res = await axios.post(`${root}/ListBugByMonths`, months)
        let data = res.data
        console.log(data)
    }catch(error){
        console.log(error)
    }
}

exports.postListFishByMonths = async(months) => {
    try{
        let res = await axios.post(`${root}/ListFishByMonths`, months)
        let data = res.data
        console.log(data)
    }catch(error){
        console.log(error)
    }
}

exports.postSingleFishByMonths = async (months) => {
    try{
        let res = await axios.post(`${root}/SingleRandomFishByMonths`, months)
        let data = res.data
        console.log(data)
    }catch(error){
        console.log(error)
    }
}

exports.postSingleBugByMonths = async(months) => {
    try{
        let res = await axios.post(`${root}/SingleRandomBugByMonths`, months)
        let data = res.data
        console.log(data)
    }catch(error){
        console.log(error)
    }
}
