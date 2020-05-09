'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Warehouses', [
      {
        latitude: '11.11',
        longitude: '11.11',
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        latitude: '90',
        longitude: '30',
        UserId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        latitude: '33.33',
        longitude: '33.33',
        UserId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Warehouses', null, {});
  }
};
