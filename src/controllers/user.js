const { User } = require("../../models/");

/**
 * Get Users
 * @param {*} req Request 
 * @param {*} res Reponse
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"]
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
 * @param {*} req Request
 * @param {*} res Response
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
 *  Delete User
 * @param {*} req Request 
 * @param {*} res Response
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
