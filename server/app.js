/* Config and db loading */
global.fs = require('fs')
try {
  global.config = require('../config.json')
  global.models = require('./models')(fs, config.database)
} catch (err) {
  console.log(err)
  process.exit(1)
}

/* Dependencies */
const cluster = require('cluster')
const cluster_hub = require('cluster-hub')

global.hub = new cluster_hub()
global.path = require('path')
global.express = require('express')

if (cluster.isMaster) {
  const cores = require('os').cpus()

  let workers = {}

  /* Forking a worker for each CPU core */
  const amount = cores.length - 1
  for (let i = 0; i < amount; i++) {
    const worker = cluster.fork({
      name: 'worker'
    })
    workers[worker.id] = worker
    workers[worker.id].name = 'worker'
  }

  /* Initialize services worker */
  let services = cluster.fork({
    name: 'services'
  })
  workers[services.id] = services
  workers[services.id].name = 'services'

  /* Restart dead worker */
  cluster.on('exit', worker => {
    const saveWorker = cluster.fork({
      name: workers[worker.id].name
    })

    if (workers[worker.id].name === 'services') services = saveWorker

  workers[saveWorker.id] = saveWorker
  workers[saveWorker.id].name = workers[worker.id].name
  delete workers[worker.id]
})
} else {
  /* Requiring worker as a dependency */
  require(`./${process.env.name}.js`)
}
