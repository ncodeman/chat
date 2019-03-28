const path = require('path')
module.exports = (fs, config) => {
  const Sequelize = require('sequelize'),
    sequelize = new Sequelize({
      username: config.username,
      password: config.password,
      database: config.database,
      host: config.host,
      dialect: config.dialect,
      //logging: true,
      define: {
        timestamps: false
      }
    })

  let db = {}

  fs.readdirSync(__dirname).filter((file) => {
    return(file.indexOf('.') !== 0) && (file !== 'index.js')
  }).forEach((file) => {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

  Object.keys(db).forEach((modelName) => {
    if("associate" in db[modelName]) {
      db[modelName].associate(db)
    }
  })
  db.sequelize = sequelize
  db.Sequelize = Sequelize

  return db
}
