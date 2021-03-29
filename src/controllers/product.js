"use strict";

const fs = require("fs");
const path = require("path");
const { Product, User } = require("../../models")

/**
 *  Get all products
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>}
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
      message: "resources has successfully get",
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
 * @returns {Promise<void>}
 */
exports.getProductsByUserId = async (req, res) => {

  const { userId } = req.params;
  try {
    let products = await Product.findAll({
      where: {
        userId: userId
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"]
      }
    })
    products = JSON.parse(JSON.stringify(products))

    products = products.map(product => ({
      ...product,
      image: `${process.env.DOMAIN}/uploads/${product.image}`
    }))
    res.status(200).send({
      status: "success",
      message: "resource has successfully get",
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
 * @returns {Promise<void>}
 */
exports.getProductDetail = async (req, res) => {

  const { id } = req.params;
  try {
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

    product = JSON.parse(JSON.stringify(product));
    res.status(200).send({
      status: "success",
      message: "resource has successfully get",
      data: {
        product: {
          ...product,
          image: `${process.env.DOMAIN}/uploads/${product.image}`
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
 *  Create product
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>}
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
    res.status(201).send({
      status: "success",
      message: "resource has successfully created",
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
 *  Update product by id
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>}
 */
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { body, user: { id: userId, role } } = req;
  if (role === "user") return res.status(403).send({
    status: "error",
    message: "access denied"
  })

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
      },
      raw: true
    });

    if (!product)
      return res.status(404).send({
        status: "error",
        message: "resource doesn't exist"
      });
    if (product['user.id'] !== userId) {
      return res.status(401).send({
        status: "error",
        message: "you have not permission to edit this resource"
      });
    }
    if (req.files) {
      //remove file from upload folder
      if (product.image) {
        fs.unlink(path.join(process.cwd(), `uploads/${product.image}`), (err) => {
          if (err) throw err;
          console.log('file deleted')
        })
      }
      const success = await Product.update({
        ...body,
        image: req.files.image[0].filename
      },
        { where: { id } }
      )
    } else {
      const success = await Product.update(body,
        { where: { id } }
      )
    }

    let updatedProduct = await Product.findOne({
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
      },
    })
    updatedProduct = JSON.parse(JSON.stringify(updatedProduct))
    res.status(200).send({
      status: "success",
      message: "resource has successfully updated",
      data: {
        ...updatedProduct,
        image: `${process.env.DOMAIN}/uploads/${updatedProduct.image}`
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
 *  Delete product by id
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>}
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
    fs.unlink(path.join(process.cwd(), `uploads/${image}`), (err) => {
      if (err) throw err;
      console.log('file deleted')
    })

    await Product.destroy({
      where: {
        id
      }
    })

    res.status(200).send({
      status: "success",
      message: "resource has successfully deleted",
      data: {
        id: 1
      }
    })
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Internal Server Error"
    })
  }
};