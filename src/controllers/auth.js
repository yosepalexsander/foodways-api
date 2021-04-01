"use strict";

const { User } = require("../../models");
const Joi = require("joi");
const hashing = require("../utils/hashing");
const { generateAccessToken } = require("../utils/jwt");

/**
 *  register new user
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>}
 */
exports.register = async (req, res) => {
  const { email, password, fullName, gender, phone, role } = req.body;
  const schema = Joi.object({
    email: Joi.string().email().min(10).max(30).required(),
    password: Joi.string().min(8).max(50).required(),
    fullName: Joi.string().min(3).max(40).required(),
    gender: Joi.string().min(4).max(6).required(),
    phone: Joi.string().regex(/^(0|\+62)/).min(10).max(13).required(),
    role: Joi.string().min(4).max(8).required(),
  })

  const { error } = schema.validate({ email, password, fullName, gender, phone, role });
  if (error) return res.status(400).send({
    status: "error",
    message: error.details[0].message
  })

  try {
    const isEmailExist = await User.findOne({
      where: {
        email
      }
    })

    if (isEmailExist) return res.status(400).send({
      status: "error",
      message: "email has already existed"
    })

    const hashedPass = await hashing.hashPassword(password);

    const user = await User.create({
      ...req.body,
      password: hashedPass
    });
    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role
    })

    res.status(200).send({
      status: "success",
      message: "resource has been registered",
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          gender: user.gender,
          role: user.role,
          phone: user.phone,
          location: user.location || null,
          image: `${process.env.DOMAIN}/uploads/null`,
          token: accessToken
        }
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
 *  verify user login 
 * @param {Request} req Http Request 
 * @param {Response} res Http Response
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const schema = Joi.object({
    email: Joi.string().email().min(10).max(30).required(),
    password: Joi.string().min(8).max(50).required(),
  })

  const { error } = schema.validate({ email, password });
  if (error) return res.status(400).send({
    status: "error",
    message: error.details[0].message
  })

  try {
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (!user) return res.status(404).send({
      status: "error",
      message: "resource is not found"
    })

    const isValid = await hashing.comparePassword(password, user.password)
    if (!isValid) return res.status(400).send({
      status: "error",
      message: "your credentials is not valid"
    });

    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role
    });

    res.status(200).send({
      status: "success",
      message: "your credentials is valid",
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          gender: user.gender,
          role: user.role,
          phone: user.phone,
          location: user.location,
          image: `${process.env.DOMAIN}/uploads/${user.image}`,
          token: accessToken
        }
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
 *  user authentication token validation
 * @param {Request} req Http Request 
 * @param {Response} res Http Response
 * @returns {Promise<void>}
 */
exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"]
      }
    });

    res.send({
      status: "success",
      message: "client is valid",
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          gender: user.gender,
          phone: user.phone,
          role: user.role,
          location: user.location,
          image: `${process.env.DOMAIN}/uploads/${user.image}`
        }
      },
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "internal server error",
    });
  }
};