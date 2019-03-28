/* Dependencies */
const http = require('http')
const https = require('https')
const socket = require('socket.io')
const app = express()

/* Classes */
const classes = {
  chat: require('./classes/chat.js')
}

/* Https */
const server = config.https ? https.createServer({
    key: fs.readFileSync(path.join(__dirname, config.cert.private)),
    cert: fs.readFileSync(path.join(__dirname, config.cert.public))
  },
  app).listen(config.socket) : http.createServer(app).listen(config.socket)

global.io = socket.listen(server, {
  log: false,
  agent: false,
  origins: '*:*'
})

console.log(`Socket service is listening on port ${config.socket}`)

/* Sending current online to users */
setInterval(() => {
  io.emit('online', Object.keys(io.sockets.adapter.rooms).length)
}, 4000)

global.chat = new classes.chat()