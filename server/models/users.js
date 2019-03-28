module.exports = (sequelize, dataTypes) => {
  return sequelize.define('message', {
    channel_name: {type: dataTypes.STRING},
    message: {type: dataTypes.TEXT('long')},
    user_name: {type: dataTypes.STRING},
    user_avatar: {type: dataTypes.STRING},
  }, {
    timestamps: true,
    tableName: 'messages'
  })
}