const { Router } = require("express");
const router = Router();

const {
  getUsers,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/user");


router.get('/users', getUsers);
router.get('/user/:id', getUserDetail);
router.post('/register', createUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;
