module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('messages', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      channel_name: {type: Sequelize.STRING},
      message: {type: Sequelize.TEXT('long')},
      user_name: {type: Sequelize.STRING},
      user_avatar: {type: Sequelize.STRING},
      user2_name: {type: Sequelize.STRING, defaultValue: null},
      user2_avatar: {type: Sequelize.STRING, defaultValue: null},
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: Sequelize.DATE
    }, {
      tableName: 'messages'
    })
  },
  down: queryInterface => {
    return queryInterface.dropTable('messages')
  }
}