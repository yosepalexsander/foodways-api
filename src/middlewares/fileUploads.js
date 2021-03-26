const multer = require("multer");

/**
 *  Middleware to handle file types request
 * @param {string} imageFile specific fields in form data
 * @returns 
 */
exports.fileUploads = (imageFile) => {

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads")
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })

  const fileFilter = (req, file, cb) => {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = {
          message: "Only image are allowed"
        }
        return cb(new Error("Only image are allowed!"), false)
      }
    }
    cb(null, true)
  }

  const maxSize = 10 * 1000 * 1000 //10 MB maximum size

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    }
  }).fields([
    {
      name: imageFile,
      maxCount: 1
    }
  ])

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError)
        return res.status(400).send({
          status: "error",
          message: req.fileValidationError
        })

      // if (!req.files && !err)
      //   return res.status(400).send({
      //     status: "error",
      //     message: "files field is empty, please upload some image"
      //   })

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).send({
            status: "error",
            message: "File size is too large, maximum is 10MB"
          });
        }
        return res.status(400).send({ message: err });
      }

      return next();
    })
  }
}