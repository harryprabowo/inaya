'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Deliveries', [
      {
        status: 'Ongoing',
        estimated_time_arrival: new Date(),
        WarehouseId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'Ongoing',
        estimated_time_arrival: new Date(),
        WarehouseId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'Ongoing',
        estimated_time_arrival: new Date(),
        WarehouseId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Deliveries', null, {});
  }
};
