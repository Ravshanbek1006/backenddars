const express = require("express");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
