'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      fullName: "asep",
      password: "lalala",
      email: "asep@gmail.com",
      phone: "0812808080808",
      location: "[106,-6.1]",
      image: "asep.png",
      role: "partner",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
