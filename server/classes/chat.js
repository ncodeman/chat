const EventEmitter = require('events')
const htmlChars = require('../utils/htmlspecialchars')

class Chat extends EventEmitter {
  constructor() {
    super()

    this.spam = []

    setInterval(() => { this.spam = [] }, 1000)
  }
}

module.exports = Chat