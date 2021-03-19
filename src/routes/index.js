const { Router } = require("express");
const { authentication } = require("../middleware/jwtAuthentication");
const router = Router();

const {
  getUsers,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
  verifyUser
} = require("../controllers/user");

const {
  getProducts,
  getProductsByUserId,
  getProductDetail,
  createProduct,
} = require("../controllers/product");

router.get('/users', getUsers);
router.get('/user/:id', getUserDetail);
router.post('/register', createUser);
router.post('/login', verifyUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

router.get('/products', getProducts);
router.get('/products/:userId', getProductsByUserId);
router.get('/product/:id', getProductDetail);
router.post('/product', authentication, createProduct);
module.exports = router;
