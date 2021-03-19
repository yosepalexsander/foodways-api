const express = require("express");
const path = require("path");
const { authentication } = require("../middleware/jwtAuthentication");
const router = express.Router();

const { register, login } = require("../controllers/auth");

const {
  getUsers,
  getUserDetail,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const {
  getProducts,
  getProductsByUserId,
  getProductDetail,
  createProduct,
} = require("../controllers/product");

router.post('/register', register);
router.post('/login', login);

router.get('/users', getUsers);
router.get('/user/:id', getUserDetail);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

router.get('/products', getProducts);
router.get('/products/:userId', getProductsByUserId);
router.get('/product/:id', getProductDetail);
router.post('/product', authentication, createProduct);

router.get('/uploads', express.static(path.join(__dirname, "uploads")))
module.exports = router;
