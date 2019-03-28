const router = express.Router()

router.use(require('../middlewares/requests.js'))

/* Sub routes */
router.post('/channels', async (req, res) => {
  try {
    let channels = await models.sequelize.query('SELECT * FROM messages WHERE id IN(SELECT MAX(id) FROM messages GROUP BY channel_name)')
    console.log(channels)
    res.json({ channels })
  } catch (err) {
    console.log(err)
    res.json({error: 'error'})
  }
})

module.exports = router