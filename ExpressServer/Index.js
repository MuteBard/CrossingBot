const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const router = require('./router')
const cors = require('cors')
const app = express();

app.use(cors())
app.use(bodyParser.json({ type: '*/*' })) //parsed the body as if it were json no matter the type of the incoming request
router(app)

// Server Setup
const port = process.env.PORT || 3090
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port)