const axios = require('axios')

//OutBound to Akka
exports.getAllBugs = () => {
    let res = await axios.get('http://localhost:4774/allBugs');
    let data = res.data;
    console.log(data);
}

exports.getAllFishes = () => {
    let res = await axios.get('http://localhost:4774/allFishes');
    let data = res.data;
    console.log(data);
}

//Inbound
exports.FuncTest = (req, res) => {
    res.send({hi : 'there'})
}
