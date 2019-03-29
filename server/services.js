/* Dependencies */
const http = require('http')
const socket = require('socket.io')
const app = express()

/* Classes */
const chat = require('./classes/chat.js')
/* Https */
const server = http.createServer(app).listen(config.socket)

global.io = socket.listen(server, {
  log: false,
  agent: false,
  origins: '*:*'
})

hub.on('channel_new', data => {
  io.emit('channel_new', data)
})
hub.on('message_new', data => {
  io.emit('message_new', data)
})

console.log(`Socket service is listening on port ${config.socket}`)

/* Sending current online to users */
setInterval(() => {
  io.emit('online', Object.keys(io.sockets.adapter.rooms).length)
}, 4000)

global.chat = new chat()