'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Droppoints', [
      {
        latitude: '39.772888',
        longitude: '-103.391251',
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        latitude: '-6.914870',
        longitude: '26.137159',
        UserId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        latitude: '36.277439',
        longitude: '-95.836197',
        UserId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Droppoints', null, {});
  }
};
