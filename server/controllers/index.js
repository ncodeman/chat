const router = express.Router()

/* Sub routes */
router.use('/api', require('./api'))
router.use('/dist', express.static(path.join(__dirname, '../../client/dist/')))

/* Main layout */
router.get('*', async (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})

module.exports = router