'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Item.associate = function(models) {
    // associations can be defined here
    Item.hasMany(models.RequestLine);
    Item.hasMany(models.WarehouseItem);
  };
  return Item;
};