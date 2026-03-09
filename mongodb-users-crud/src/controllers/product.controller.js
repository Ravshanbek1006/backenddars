const mongoose = require("mongoose");
const Product = require("../models/Product");

async function createProduct(req, res, next) {
  try {
    const { categoryId, ...rest } = req.body;

    if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: "Valid categoryId is required" });
    }

    const product = await Product.create({
      ...rest,
      category: categoryId,
    });

    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}

async function getProducts(req, res, next) {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.json({ results: products.length, data: products });
  } catch (err) {
    next(err);
  }
}

async function getProductsByCategory(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const products = await Product.find({ category: id })
      .populate("category")
      .sort({ createdAt: -1 });

    res.json({ results: products.length, data: products });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductsByCategory,
};
