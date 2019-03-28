const EventEmitter = require('events')

const htmlSpecialChars = str => {
  if(str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

class Chat extends EventEmitter {
  constructor() {
    super()

    this.spam = []

    setInterval(() => { this.spam = [] }, 1000)
  }
}

module.exports = Chat