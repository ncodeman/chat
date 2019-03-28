/* Dependencies */
const https = require('https')
const helmet = require('helmet')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

/* Https */
if(config.https) {
  app.enable('trust proxy')

  app.all('*', (req, res, next) => {
    if(req.protocol === 'https' || req.path.indexOf('parser') > -1) return next()
    res.redirect(config.website + req.url)
  })
}

/* Setting access */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

/* Helmet middleware */
app.use(helmet())

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* Session middleware */
app.use(session({
  cookieName: config.express.name,
  secret: config.express.secret,
  saveUninitialized: false,
  resave: false
}))

app.listen(config.https ? 80 : config.port, () => console.log(`Web service listening on port ${config.port}`))

if(config.https) {
  var httpsServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, config.cert.private)),
    cert: fs.readFileSync(path.join(__dirname, config.cert.public))
  }, app)
  httpsServer.listen(config.port)
}

/* Variables */
app.use(require('./controllers'))