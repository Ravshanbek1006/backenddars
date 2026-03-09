const mongoose = require("mongoose");
const Category = require("../models/Category");

async function createCategory(req, res, next) {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ data: category });
  } catch (err) {
    next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ results: categories.length, data: categories });
  } catch (err) {
    next(err);
  }
}

module.exports = { createCategory, getCategories };
