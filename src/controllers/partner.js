'use strict';

const sequelize = require("sequelize");
const { User } = require("../../models");

/**
 * Get popular restaurant by count transaction
 * @param {Request} req Http Request 
 * @param {Response} res Http Reponse
 * @returns {Promise<void>}
 */
exports.getPopularPartner = async (req, res) => {
  try {
    let users = await User.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
                SELECT COUNT(*)
                FROM transactions AS transaction
                WHERE
                    transaction.restaurantId = user.id
                    AND
                    transaction.status = "success"
            )`), 'transactionCount'
          ]
        ],
        exclude: ["createdAt", "updatedAt", "password"]
      },
      order: [[sequelize.literal('transactionCount'), 'DESC']],
      limit: 4
    });

    users = JSON.parse(JSON.stringify(users));

    users = users.map(user => {
      return {
        ...user,
        image: `http://res.cloudinary.com/devprojects/image/upload/${user.image}`
      }
    })
    res.status(200).send({
      status: "success",
      message: "get popular partner successfully",
      data: {
        users
      }
    })
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "internal server error"
    })
  }
};