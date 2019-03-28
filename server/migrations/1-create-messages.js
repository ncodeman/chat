module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('messages', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      channel_name: {type: Sequelize.STRING},
      message: {type: Sequelize.TEXT('long')},
      user_name: {type: Sequelize.STRING},
      user_avatar: {type: Sequelize.STRING},
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