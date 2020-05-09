'use strict';
var bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // var hashedPassword_1 = bcrypt.hashSync('anton', 10);
    // var hashedPassword_2 = bcrypt.hashSync('budi', 10);
    // var hashedPassword_3 = bcrypt.hashSync('chris', 10);
    return queryInterface.bulkInsert('Users', [
      {
        username: 'anton',
        hashed_password: bcrypt.hashSync('anton', 10),
        email: 'anton@anton.com',
        RoleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'budi',
        hashed_password: bcrypt.hashSync('budi', 10),
        email: 'budi@budi.com',
        RoleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'chris',
        hashed_password: bcrypt.hashSync('chris', 10),
        email: 'chris@chris.com',
        RoleId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
