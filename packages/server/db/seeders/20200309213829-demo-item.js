'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Items', [
      {
        name: 'Beras',
        description: '5 kg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Minyak Goreng',
        description: '1 liter',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mie Instan',
        description: 'Indomie',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sabun',
        description: '50 gram',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Obat',
        description: 'Maag, sakit kepala, flu, dll',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Items', null, {});
  }
};
