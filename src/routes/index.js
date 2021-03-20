const express = require("express");
const { authentication } = require("../middleware/jwtAuthentication");
const { fileUploads } = require("../middleware/fileUploads");
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
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const {
  getTransactions,
  getDetailTransaction,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  getCustomerTransactions } = require("../controllers/transaction");

router.post('/register', register);
router.post('/login', login);

router.get('/users', getUsers);
router.get('/user/:id', getUserDetail);
router.put('/user/:id', fileUploads("image"), updateUser);
router.delete('/user/:id', deleteUser);

router.get('/products', getProducts);
router.get('/products/:userId', getProductsByUserId);
router.get('/product/:id', getProductDetail);
router.post('/product', authentication, fileUploads("image"), createProduct);
router.patch('/product/:id', authentication, updateProduct);
router.delete('/product/:id', authentication, deleteProduct);

router.get('/transactions/:id', authentication, getTransactions);
router.get('/transaction/:id', authentication, getDetailTransaction);
router.post('/transaction', authentication, createTransaction);
router.put('/transaction/:id', authentication, updateTransaction);
router.delete('/transaction/:id', authentication, deleteTransaction);
router.get('/my-transactions', authentication, getCustomerTransactions);
module.exports = router;
