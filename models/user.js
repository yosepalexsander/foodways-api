'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Product, {
        as: {
          singular: "product",
          plural: "products"
        },
        foreignKey: {
          name: "userId"
        }
      })

      User.hasMany(models.Transaction, {
        as: {
          singular: "transaction",
          plural: "transactions"
        },
        foreignKey: {
          name: "customerId"
        }
      })
      User.hasMany(models.Transaction, {
        as: {
          singular: "transaction",
          plural: "transactions"
        },
        foreignKey: {
          name: "restaurantId"
        }
      })

    }
  };
  User.init({
    fullName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    location: DataTypes.STRING,
    image: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};