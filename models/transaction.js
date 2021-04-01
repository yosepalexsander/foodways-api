'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User, {
        as: "userOrder",
        foreignKey: {
          name: "customerId"
        }
      })
      Transaction.belongsTo(models.User, {
        as: "restaurant",
        foreignKey: {
          name: "restaurantId"
        }
      })
      Transaction.hasMany(models.Order, {
        as: "orders",
        foreignKey: {
          name: "transactionId"
        }
      })
    }
  };
  Transaction.init({
    status: DataTypes.STRING,
    deliveryLocation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};