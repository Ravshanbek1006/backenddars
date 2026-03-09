const router = require("express").Router();
const {
  createCategory,
  getCategories,
} = require("../controllers/category.controller");

router.post("/categories", createCategory);
router.get("/categories", getCategories);

module.exports = router;
