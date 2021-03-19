'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [{
      title: "Geprek Sambal Matah",
      price: 18000,
      image: "sambal mata.png",
      userId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: "Geprek Keju",
      price: 20000,
      image: "geprek_keju.png",
      userId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
