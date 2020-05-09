'use strict';
module.exports = (sequelize, DataTypes) => {
  const WarehouseSchedule = sequelize.define('WarehouseSchedule', {
    WarehouseId: DataTypes.INTEGER,
    Hour: DataTypes.INTEGER
  }, {});
  WarehouseSchedule.associate = function(models) {
    // associations can be defined here
    WarehouseSchedule.belongsTo(models.Warehouse);
  };
  return WarehouseSchedule;
};