/* Dependencies */
const http = require('http')
const socket = require('socket.io')
const app = express()

/* Https */
const server = http.createServer(app).listen(config.socket)

let users = {}

global.io = socket.listen(server, {
  log: false,
  agent: false,
  origins: '*:*'
})

hub.on('channel_new', data => {
  io.emit('channel_new', data)
})
hub.on('message_new', data => {
  if (!data.user2_name) io.emit('message_new', data)
  let sockets = []
  for (let i of Object.keys(users)) if (users[i].name === data.user_name || users[i].name === data.user2_name) sockets.push(i)
  for(let socket of sockets) io.to(socket).emit('message_new', data)
})

console.log(`Socket service is listening on port ${config.socket}`)

/* Sending current online to users */
setInterval(() => {
  io.emit('online', users)
}, 5000)

io.sockets.on('connection', socket => {
  io.emit('online', users)

  socket.on('online', user => {
    users[socket.id] = user
  })

  socket.on('disconnect', () => {
    delete users[socket.id]
  })
})