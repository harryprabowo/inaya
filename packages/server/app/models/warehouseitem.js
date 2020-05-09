'use strict';
module.exports = (sequelize, DataTypes) => {
  const WarehouseItem = sequelize.define('WarehouseItem', {
    ItemId: DataTypes.INTEGER,
    WarehouseId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  WarehouseItem.associate = function(models) {
    // associations can be defined here
    WarehouseItem.belongsTo(models.Warehouse);
    WarehouseItem.belongsTo(models.Item);
  };
  return WarehouseItem;
};