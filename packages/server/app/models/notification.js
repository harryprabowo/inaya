'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    message: {
      allowNull: false,
      type: DataTypes.STRING
    },
    UserId: DataTypes.INTEGER
  }, {});
  Notification.associate = function(models) {
    // associations can be defined here
    Notification.belongsTo(models.User);
  };
  return Notification;
};