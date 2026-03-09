const router = require("express").Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controller");

router.post("/api/users", createUser);
router.get("/api/users", getUsers);
router.get("/api/users/:id", getUserById);
router.put("/api/users/:id", updateUserById);
router.delete("/api/users/:id", deleteUserById);

module.exports = router;
