'use strict';
module.exports = (sequelize, DataTypes) => {
  const RequestLine = sequelize.define('RequestLine', {
    RequestId: DataTypes.INTEGER,
    WarehouseId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    DeliveryId: DataTypes.INTEGER,
    status: DataTypes.ENUM('Draft', 'Open', 'Commited', 'Shipping', 'Cancelled', 'Closed'),
    Quantity: DataTypes.INTEGER
  }, {});
  RequestLine.associate = function(models) {
    // associations can be defined here
    RequestLine.belongsTo(models.Request);
    RequestLine.belongsTo(models.Warehouse);
    RequestLine.belongsTo(models.Item);
    RequestLine.belongsTo(models.Delivery);
  };
  return RequestLine;
};