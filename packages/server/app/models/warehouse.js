'use strict';
module.exports = (sequelize, DataTypes) => {
  const Warehouse = sequelize.define('Warehouse', {
    UserId: DataTypes.INTEGER,
    longitude: DataTypes.STRING,
    latitude: DataTypes.STRING
  }, {});
  Warehouse.associate = function(models) {
    // associations can be defined here
    Warehouse.belongsTo(models.User);
    Warehouse.hasMany(models.RequestLine);
    Warehouse.hasMany(models.WarehouseItem);
    Warehouse.hasMany(models.Delivery);
    Warehouse.hasMany(models.WarehouseSchedule);
  };
  return Warehouse;
};