'use strict';
module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define('Delivery', {
    WarehouseId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    Route: DataTypes.STRING,
    estimated_time_arrival: DataTypes.DATE
  }, {});
  Delivery.associate = function(models) {
    // associations can be defined here
    Delivery.hasMany(models.RequestLine);
    Delivery.belongsTo(models.Warehouse);
  };
  return Delivery;
};