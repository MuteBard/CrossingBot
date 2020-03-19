const axios = require('axios')

//OutBound to Akka
exports.getAllBugs = async () => {
    try{
        let res = await axios.get('http://localhost:4774/api/allBugs');
        let data = res.data;
        console.log(data);
    }catch (error){
        console.log(error)
    }
}

exports.getAllFishes = async () => {
    try{
        let res = await axios.get('http://localhost:4774/api/allFishes');
        let data = res.data;
        console.log(data);
    }catch (error){
        console.log(error)
    }
}

//Inbound
exports.FuncTest = (req, res) => {
    res.send({hi : 'there'})
}
