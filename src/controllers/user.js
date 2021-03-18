const { User } = require("../../models/");
const Joi = require("joi");
const hashing = require("../utils/hashing");
const jwtUtils = require("../utils/jwt");
/**
 * Get Users
 * @param {Request} req Request 
 * @param {Response} res Reponse
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"]
      }
    });
    res.status(200).send({
      status: "success",
      message: "users successfully get",
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
 * Get User Detail
 * @param {Request} req Request
 * @param {Response} res Response
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
      message: "user detail successfully get",
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
 *  Create New User
 * @param {Request} req Request
 * @param {Response} res Response
 * @returns Response
 */
exports.createUser = async (req, res) => {
  const { body } = req;

  const { email, password, fullName, gender, phone, role } = body;
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net"]
      }
    }).min(10).max(30).required(),
    password: Joi.string().min(8).max(50).required(),
    fullName: Joi.string().min(8).max(40).required(),
    gender: Joi.string().min(4).max(6).required(),
    phone: Joi.string().regex(/^(08|\+62)/).min(10).max(13).required(),
    role: Joi.string().min(4).max(8).required(),
  })

  const { error } = schema.validate({ email, password, fullName, gender, phone, role });
  if (error) return res.status(400).send({
    status: "validation failed",
    message: error.details[0].message
  })
  try {
    const hashedPass = await hashing.hashPassword(password);
    const data = {
      ...body,
      password: hashedPass
    }
    const user = await User.create(data);
    const accessToken = jwtUtils.generateAccessToken({
      name: user.fullName,
      role: user.role
    })
    res.status(200).send({
      status: "success",
      message: "user successfully created",
      data: {
        user: {
          fullName: user.fullName,
          token: accessToken,
          role: user.role
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
 *  Update User Data
 * @param {Request} req Request
 * @param {Response} res Response
 * @returns Response
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const { email, fullName, gender, phone, role } = body;
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
  })

  const { error } = schema.validate({ email, password, fullName, gender, phone, role });
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

    const updatedUser = await User.update(body, {
      where: {
        id
      }
    });

    res.status(200).send({
      status: "success",
      message: "user successfully updated",
      data: {
        updatedUser
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
 *  Delete User
 * @param {Request} req Request 
 * @param {Response} res Response
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
      message: "user successfully deleted",
      data: {
        id: id
      }
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "internal server error"
    });
  }
};
