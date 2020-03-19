const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const cors = require('cors')
const router = require('../Router/routes')
const app = express();

app.use(cors())
app.use(bodyParser.json({ type: '*/*' })) 
router.Outbound(app)

const port = process.env.PORT || 3000
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on localhost:', port)

router.Inbound.getAllBugs