'use strict';
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    UserId: DataTypes.INTEGER,
    DroppointId: DataTypes.INTEGER
  }, {});
  Request.associate = function(models) {
    // associations can be defined here
    Request.belongsTo(models.User);
    Request.belongsTo(models.Droppoint);
    Request.hasMany(models.RequestLine);
  };
  return Request;
};