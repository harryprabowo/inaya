'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Notifications', [
      {
        message: 'Notification 1',
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        message: 'Notification 2',
        UserId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        message: 'Notification 3',
        UserId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        message: 'Notification 4',
        UserId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        message: 'Notification 5',
        UserId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        message: 'Notification 6',
        UserId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Notifications', null, {});
  }
};
