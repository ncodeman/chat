const router = express.Router()
const string_helper = require('../utils/string_helper')

/* Sub routes */
router.post('/channels', async (req, res) => {
  try {
    let {name} = req.body

    let public = await models.message.findAll({
      where: models.sequelize.literal('user2_name IS NULL AND id IN(SELECT MAX(id) FROM messages GROUP BY channel_name)'),
      order: [['createdAt', 'DESC']],
      raw: true
    })

    let priv = await models.message.findAll({
      where: models.sequelize.literal(`user2_name IS NOT NULL AND (user_name like '${name}' OR user2_name like '${name}') 
      AND id IN(SELECT MAX(id) FROM messages GROUP BY channel_name)`),
      order: [['createdAt', 'DESC']],
      raw: true
    })

    //let private = []

    let channels = [...public, ...priv].sort((a, b) => b.createdAt - a.createdAt)

    res.json({channels})
  } catch (err) {
    console.log(err)
    res.json({error: 'error'})
  }
})

router.post('/channels/create', async (req, res) => {
  try {
    let {channel_name, message, user_name, user_avatar} = req.body
    console.log(req.body)
    if (string_helper.is_empty(channel_name) || string_helper.is_empty(message)) return res.json({error: 'input'})

    channel_name = string_helper.html(channel_name)
    message = string_helper.html(message)

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
    let {channel_name, message, user_name, user_avatar, user2_name, user2_avatar} = req.body

    if (string_helper.is_empty(channel_name) || string_helper.is_empty(message)) return res.json({error: 'input'})

    if (!user2_name) channel_name = string_helper.html(channel_name)
    message = string_helper.html(message)

    let query = {
      message,
      user_name,
      user_avatar,
      channel_name
    }

    if (user2_name) query = Object.assign({}, query, {
      user2_name,
      user2_avatar
    })

    let msg = await models.message.create(query)

    hub.requestMaster('message_new', msg)

    res.json({msg})
  } catch (err) {
    console.log(err)
    res.json({error: 'error'})
  }
})

router.post('/channels/:channel_name', async (req, res) => {
  try {
    let {priv, name} = req.body
    let {channel_name} = req.params

    let messages = await models.message.findAll({
      where: {channel_name},
      raw: true
    })

    if (priv && (!messages.length || (messages[0].user_name !== name || messages[0].user2_name !== name))) return res.json({error: 'no_access'})

    res.json({messages})
  } catch (err) {
    console.log(err)
    res.json({error: 'error'})
  }
})

module.exports = router