const router = require("express").Router();
const {
  createProduct,
  getProducts,
  getProductsByCategory,
} = require("../controllers/product.controller");

router.post("/products", createProduct);
router.get("/products", getProducts);
router.get("/categories/:id/products", getProductsByCategory);

module.exports = router;
