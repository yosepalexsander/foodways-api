"use strict";

const { User } = require("../../models");
const Joi = require("joi");
/**
 * get users
 * @param {Request} req Http Request 
 * @param {Response} res Http Reponse
 */
exports.getUsers = async (req, res) => {
  try {
    let users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"]
      }
    });

    users = JSON.parse(JSON.stringify(users));

    users = users.map(user => {
      return {
        ...user,
        image: `${process.env.DOMAIN}/uploads/${user.image}`
      }
    })
    res.status(200).send({
      status: "success",
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

/**
 * get user detail
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 */
exports.getUserDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ["createAt", "updatedAt"]
      }
    });
    res.status(200).send({
      status: "success",
      data: {
        user
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
 *  update user data
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns Http Response
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, fullName, gender, phone, role, location } = req.body;
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net"]
      }
    }).min(10).max(30).required(),
    fullName: Joi.string().min(8).max(40).required(),
    gender: Joi.string().min(4).max(6).required(),
    phone: Joi.string().min(10).max(13).required(),
    role: Joi.string().min(4).max(8).required(),
    location: Joi.string()
  })

  const { error } = schema.validate({ email, fullName, gender, phone, role, location });
  if (error) return res.status(400).send({
    status: "validation failed",
    message: error.details[0].message
  })

  try {
    const user = await User.findOne({
      where: {
        id
      }
    });

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "user is not found"
      })
    };

    const updatedUser = await User.update({
      ...req.body,
      image: req.files.image[0].filename
    }, {
      where: {
        id
      }
    });

    res.status(200).send({
      status: "success",
      data: {
        id: 1
      }
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "internal server error"
    });
  }
};

/**
 *  delete user
 * @param {Request} req Http Request 
 * @param {Response} res Http Response
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.destroy({
      where: {
        id: id
      }
    });

    res.status(200).send({
      status: "success",
      data: {
        id: 1
      }
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "internal server error"
    });
  }
};
