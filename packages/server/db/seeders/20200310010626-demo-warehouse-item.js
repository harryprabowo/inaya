'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('WarehouseItems', [
      {
        status: 'Available',
        ItemId: 1,
        WarehouseId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'Unavailable',
        ItemId: 2,
        WarehouseId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'Available',
        ItemId: 3,
        WarehouseId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'Unavailable',
        ItemId: 4,
        WarehouseId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'Available',
        ItemId: 5,
        WarehouseId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('WarehouseItems', null, {});
  }
};
