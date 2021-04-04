"use strict";

const { Op } = require("sequelize")
const { Product, Order, Transaction, User } = require("../../models");

/**
 *  Get partner transactions 
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>}
 */
exports.getTransactions = async (req, res) => {
  const { user: { id, role } } = req;
  if (role === "user") return res.status(403).send({
    status: "error",
    message: "access denied"
  });

  try {
    const transactions = await Transaction.findAll({
      where: {
        restaurantId: id
      },
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: ["id", "fullName", "location", "email"]
        },
        {
          model: Order,
          as: "orders",
          attributes: [["product_id", "id"], "title", "price", "image", "qty"]
        }
      ],
      attributes: {
        exclude: ["updatedAt", "customerId"]
      }
    });

    res.status(200).send({
      status: "success",
      message: "resources has successfully get",
      data: {
        transactions
      }
    })

  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Internal Server Error"
    })
  }
};

/**
 *  Get detail transaction
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>}
 */

exports.getDetailTransaction = async (req, res) => {
  const { params: { id } } = req;

  try {
    let transaction = await Transaction.findOne({
      where: {
        id
      },
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: ["id", "fullName", "location"]
        },
        {
          model: User,
          as: "restaurant",
          attributes: ["id", "fullName", "location"]
        },
        {
          model: Order,
          as: "orders",
          attributes: [["product_id", "id"], "title", "price", "image", "qty"]
        }
      ],
      attributes: {
        exclude: ["updatedAt", "customerId", "restaurantId"]
      }
    });
    transaction = JSON.parse(JSON.stringify(transaction));
    const orders = transaction.orders.map(product => {
      return {
        ...product,
        image: `${process.env.DOMAIN}/uploads/${product.image}`
      }
    })
    res.status(200).send({
      status: "success",
      message: "resource has successfully get",
      data: {
        transaction: {
          ...transaction,
          orders: orders
        }
      }
    })
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "internal server error"
    })
  }
};

/**
 *  Create transaction
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>}
 */

exports.createTransaction = async (req, res) => {
  const { body: { restaurant_id, products, deliveryLocation }, user } = req;
  const ids = products.map(product => product.id);
  const quantities = products.map(product => product.qty);
  try {

    const { id: transactionId } = await Transaction.create({
      status: "waiting approve",
      restaurantId: restaurant_id,
      deliveryLocation: deliveryLocation,
      customerId: user.id
    })

    const productData = await Product.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"]
      },
      raw: true
    })

    const order = await Order.bulkCreate(
      productData.map((product, idx) => ({
        transactionId,
        product_id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty: quantities[idx]
      }))
    );

    // get created transaction
    const transaction = await Transaction.findOne({
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: ["id", "fullName", "location", "email"]
        },
        {
          model: Order,
          as: "orders",
          attributes: [["product_id", "id"], "title", "price", "image", "qty"]
        }
      ],
      where: {
        id: transactionId
      },
      attributes: ["id", "status", "restaurantId"]
    })

    res.status(201).send({
      status: "success",
      messge: "resource has successfully created",
      data: {
        transaction
      }
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: "error",
      message: "Internal Server Error"
    })
  }
};

/**
 *  Update transaction status
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>}
 */

exports.updateTransaction = async (req, res) => {
  const {
    body,
    params: { id },
    user
  } = req;

  try {
    const transaction = await Transaction.findOne({
      where: { id }
    });
    if (!transaction) {
      return res.status(404).send({
        status: "error",
        message: "resource not found"
      })
    };

    if (user.role === "user") {
      if (transaction.customerId !== user.id) {
        return res.status(403).send({
          status: "error",
          message: "you don't have permission for this resource"
        })
      };
    } else {
      if (transaction.restaurantId !== user.id) {
        return res.status(403).send({
          status: "error",
          message: "you don't have permission for this resource"
        })
      };
    }

    const success = await Transaction.update(body,
      { where: { id } }
    );

    const updatedTransaction = await Transaction.findOne({
      where: {
        id
      },
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: ["id", "fullName", "location"]
        },
        {
          model: User,
          as: "restaurant",
          attributes: ["id", "fullName", "location"]
        },
        {
          model: Order,
          as: "orders",
          attributes: [["product_id", "id"], "title", "price", "image", "qty"]
        }
      ],
      attributes: {
        exclude: ["updatedAt", "customerId", "restaurantId"]
      }
    });
    res.status(200).send({
      status: "success",
      message: "resource has successfully updated",
      data: {
        transaction: updatedTransaction
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: "error",
      message: "internal server error"
    })
  }
};

/**
 *  Delete transaction
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>} Http Response
 */
exports.deleteTransaction = async (req, res) => {
  const {
    params: { id },
    user: { role }
  } = req;

  if (role === "user") return res.status(403).send({
    status: "error",
    message: "access denied"
  })

  try {
    await Transaction.destroy({
      where: {
        id
      }
    })
    res.status(200).send({
      status: "success",
      message: "resource has successfully deleted",
      data: {
        id
      }
    })
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "internal server error"
    })
  }
};


/**
 *  Get customer transactions
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>} Http Response
 */
exports.getCustomerTransactions = async (req, res) => {
  const { user: { id, role } } = req;
  if (role === "partner") return res.status(403).send({
    status: "error",
    message: "access denied"
  });
  try {
    const transactions = await Transaction.findAll({
      where: {
        customerId: id
      },
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Order,
          as: "orders",
          attributes: [["product_id", "id"], "title", "price", "image", "qty"]
        },
        {
          model: User,
          as: "restaurant",
          attributes: ["id", "fullName"],
          paranoid: false
        }
      ],
      attributes: {
        exclude: ["updatedAt", "customerId"]
      },
    });

    res.status(200).send({
      status: "success",
      message: "resources has successfully get",
      data: {
        transactions
      }
    })

  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Internal Server Error"
    })
  }
}