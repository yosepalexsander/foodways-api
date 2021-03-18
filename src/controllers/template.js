
exports.functionName = async (req, res) => {
  try {
    res.status(200).send({
      status: "success",
      message: "Users Successfully Get",
      data: {
        users
      }
    })
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Internal Server Error"
    })
  }
};