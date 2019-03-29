const router = express.Router()
const emptystring = require('../utils/emptystring')
const htmlspecialchars = require('../utils/htmlspecialchars')

router.use(require('../middlewares/requests.js'))

/* Sub routes */
router.post('/channels', async (req, res) => {
  try {
    let channels = await models.message.findAll({
      where: models.sequelize.literal('id IN(SELECT MAX(id) FROM messages GROUP BY channel_name)'),
      order: [['createdAt', 'DESC']],
      raw: true
    })

    res.json({channels})
  } catch (err) {
    console.log(err)
    res.json({error: 'error'})
  }
})

router.post('/channels/create', async (req, res) => {
  try {
    let {channel_name, message, user_name, user_avatar} = req.body

    if (emptystring(channel_name) || emptystring(message)) return res.json({error: 'input'})

    channel_name = htmlspecialchars(channel_name)
    message = htmlspecialchars(message)

    let channel = await models.message.create({channel_name, message, user_name, user_avatar})

    hub.requestMaster('channel_new', channel)

    res.json({channel})
  } catch (err) {
    console.log(err)
    res.json({error: 'error'})
  }
})

router.post('/channels/message', async (req, res) => {
  try {
    let {channel_name, message, user_name, user_avatar} = req.body

    if (emptystring(channel_name) || emptystring(message)) return res.json({error: 'input'})

    channel_name = htmlspecialchars(channel_name)
    message = htmlspecialchars(message)

    let msg = await models.message.create({channel_name, message, user_name, user_avatar})

    hub.requestMaster('message_new', msg)

    res.json({msg})
  } catch (err) {
    console.log(err)
    res.json({error: 'error'})
  }
})

router.post('/channels/:channel_name', async (req, res) => {
  try {
    let {channel_name} = req.params

    let messages = await models.message.findAll({
      where: {channel_name},
      raw: true
    })

    res.json({messages})
  } catch (err) {
    console.log(err)
    res.json({error: 'error'})
  }
})

module.exports = router