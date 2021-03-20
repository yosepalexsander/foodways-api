"use strict";
const fs = require("fs");
const path = require("path");
const { Product, User } = require("../../models")

/**
 *  Get all products
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
 *  Get products by user id
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
 *  Get product detail by id
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
 *  Create product
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
      userId,
      image: req.files.image[0].filename
    })

    let product = await Product.findOne({
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
    product = JSON.parse(JSON.stringify(product))
    res.status(200).send({
      status: "success",
      data: {
        ...product,
        image: `${process.env.DOMAIN}/uploads/${product.image}`
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
 *  Update product
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Response} Http Response
 */
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { body, user: { role } } = req;
  if (role === "user") return res.status(403).send({
    status: "error",
    message: "access denied"
  })

  try {
    const success = await Product.update(body,
      {
        where: {
          id
        }
      }
    )

    let product = await Product.findOne({
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
    product = JSON.parse(JSON.stringify(product))
    res.status(200).send({
      status: "success",
      data: {
        ...product,
        image: `${process.env.DOMAIN}/uploads/${product.image}`
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
 *  Delete product
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Response} Http Response
 */
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { user: { role } } = req;
  if (role === "user") return res.status(403).send({
    status: "error",
    message: "access denied"
  })
  try {
    const { image } = await Product.findOne({
      where: {
        id
      }
    });

    //remove file from upload folder
    fs.unlink(path.join(process.cwd(), `uploads/${image}`))

    await Product.destroy({
      where: {
        id
      }
    })

    res.status(200).send({
      status: "success",
      data: {
        id
      }
    })
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Internal Server Error"
    })
  }
};