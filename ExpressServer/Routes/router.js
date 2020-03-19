const AkkaController = require('../Controller/Akka')

exports.Inbound = {
    getAllBugs : AkkaController.getAllBugs(),
    getAllFishes : AkkaController.getAllFishes() 
}

exports.Outbound = (app) => {
    app.get('/', AkkaController.FuncTest)
}