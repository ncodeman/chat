module.exports = (sequelize, dataTypes) => {
  return sequelize.define('message', {
    channel_name: {type: dataTypes.STRING},
    message: {type: dataTypes.TEXT('long')},
    user_name: {type: dataTypes.STRING},
    user_avatar: {type: dataTypes.STRING},
    user2_name: {type: dataTypes.STRING, defaultValue: null},
    user2_avatar: {type: dataTypes.STRING, defaultValue: null}
  }, {
    timestamps: true,
    tableName: 'messages'
  })
}