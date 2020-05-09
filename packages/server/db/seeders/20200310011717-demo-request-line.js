'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('RequestLines', [
      {
        status: 'Draft',
        RequestId: 1,
        WarehouseId: 1,
        ItemId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'Commited',
        RequestId: 2,
        WarehouseId: 2,
        ItemId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'Cancelled',
        RequestId: 3,
        WarehouseId: 3,
        ItemId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('RequestLines', null, {});
  }
};
