let ips = []
let rejects = []
let {rejects_limit, limit, whitelist} = config.ratelimit

setInterval(() => {
  for (let i = 0; i < ips.length; i++) {
    if (ips[i] > limit) {
      if (!rejects[ip]) rejects[ip] = 0

      rejects[ip]++
    }
  }

  ips = []
}, 1000)

setInterval(() => {
  rejects = []
}, 60000)

module.exports = (req, res, next) => {
  if (req.path.indexOf('get') > -1) return next()

  let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).replace('::ffff:', '')

  if (whitelist.indexOf(ip) > -1) return next()

  if (!rejects[ip]) rejects[ip] = 0

  if (rejects[ip] > rejects_limit) {
    console.log('Hard reject of ip ' + ip + ' requested to path' + req.path)

    return res.json({success: false, error: 'error'})
  }

  if (!ips[ip]) ips[ip] = 0

  ips[ip]++

  if (ips[ip] > limit) {
    console.log('Too much requests from ip ' + ip + ' to path' + req.path)

    return res.json({success: false, error: 'error'})
  }

  next()
}
