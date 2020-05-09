'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    hashed_password: DataTypes.STRING,
    email: DataTypes.STRING,
    RoleId: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Notification);
    User.belongsTo(models.Role);
    User.hasMany(models.Droppoint);
    User.hasMany(models.Warehouse);
    User.hasMany(models.Request);
  };
  return User;
};