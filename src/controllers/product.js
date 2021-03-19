"use strict";

const { Product, User } = require("../../models/")

/**
 *  get all products
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Response} Response
 */
exports.getProducts = async (req, res) => {

  try {
    const products = await Product.findAll({
      include: [{
        model: User,
        as: "user",
        attributes: {
          exclude: ["password", "image", "role", "createdAt", "updatedAt"]
        }
      }],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"]
      }
    })
    res.status(200).send({
      status: "success",
      data: {
        products
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
 *  get products by user id
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Response} Http Response
 */
exports.getProductsByUserId = async (req, res) => {

  const { userId } = req.params;
  try {
    const products = await Product.findAll({
      where: {
        userId: userId
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"]
      }
    })
    res.status(200).send({
      status: "success",
      data: {
        products
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
 *  get product detail by id
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Response} Http Response
 */
exports.getProductDetail = async (req, res) => {

  const { id } = req.params;
  try {
    const product = await Product.findOne({
      where: {
        id
      },
      include: [{
        model: User,
        as: "user",
        attributes: {
          exclude: ["password", "image", "role", "createdAt", "updatedAt"]
        }
      }],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"]
      }
    })
    res.status(200).send({
      status: "success",
      data: {
        product
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
 *  create product
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Response} Http Response
 */
exports.createProduct = async (req, res) => {

  const { body, user: { id: userId, role } } = req;
  if (role === "user") return res.status(403).send({
    status: "error",
    message: "access denied"
  })
  try {
    const { id } = await Product.create({
      ...body,
      userId
    })

    const product = await Product.findOne({
      where: {
        id
      },
      include: [{
        model: User,
        as: "user",
        attributes: {
          exclude: ["password", "image", "role", "createdAt", "updatedAt"]
        }
      }],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"]
      }
    })
    res.status(200).send({
      status: "success",
      data: {
        product
      }
    })
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Internal Server Error"
    })
  }
};