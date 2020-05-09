'use strict';
module.exports = (sequelize, DataTypes) => {
  const Droppoint = sequelize.define('Droppoint', {
    longitude: DataTypes.STRING,
    latitude: DataTypes.STRING
  }, {});
  Droppoint.associate = function(models) {
    // associations can be defined here
    Droppoint.belongsTo(models.User);
    Droppoint.hasMany(models.Request);
  };
  return Droppoint;
};