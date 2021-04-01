"use strict";

const fs = require("fs");
const path = require("path");
const { User } = require("../../models");

/**
 * Get users
 * @param {Request} req Http Request 
 * @param {Response} res Http Reponse
 * @returns {Promise<void>}
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
      message: "get users successfully",
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
 * Get user detail
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>}
 */
exports.getUserDetail = async (req, res) => {
  const { id } = req.params;
  try {
    let user = await User.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"]
      }
    });
    user = JSON.parse(JSON.stringify(user));
    res.status(200).send({
      status: "success",
      message: "user detail successfully get",
      data: {
        user: {
          ...user,
          image: `${process.env.DOMAIN}/uploads/${user.image}`
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
 *  Update user data
 * @param {Request} req Http Request
 * @param {Response} res Http Response
 * @returns {Promise<void>}
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
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

    if (user.id !== req.user.id) {
      return res.status(401).send({
        status: "error",
        message: "your permission is not allowed"
      })
    };

    if (req.files) {
      //remove file from upload folder
      if (user.image) {
        fs.unlink(path.join(process.cwd(), `uploads/${user.image}`), (err) => {
          if (err) throw err;
          console.log('file deleted')
        })
      }

      const updatedUser = await User.update(
        {
          ...req.body,
          image: req.files.image[0].filename
        },
        {
          where: {
            id
          }
        }
      );
    } else {
      const updatedUser = await User.update(req.body,
        {
          where: {
            id
          }
        }
      );
    }

    res.status(200).send({
      status: "success",
      message: "user has successfully updated",
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
 *  Delete user
 * @param {Request} req Http Request 
 * @param {Response} res Http Response
 * @returns {Promise<void>}
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { image } = await User.findOne({
      where: {
        id
      }
    });

    // if (image) {
    //   //remove file from upload folder
    //   fs.unlink(path.join(process.cwd(), `uploads/${image}`), (err) => {
    //     if (err) throw err;
    //     console.log('file deleted')
    //   })
    // }

    await User.destroy({
      where: {
        id
      }
    });

    res.status(200).send({
      status: "success",
      message: "user has successfully deleted",
      data: {
        id: 1
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: "error",
      message: "internal server error"
    });
  }
};
