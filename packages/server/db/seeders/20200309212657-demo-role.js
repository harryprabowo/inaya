'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles',[
      {
        name: 'Super Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Warehouse Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Droppoint Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
