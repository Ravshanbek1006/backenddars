import express from "express";

const app = express();
const PORT = 3002;

app.use(express.json());

const categories = ["Electronics", "Home", "Office", "Sports", "Kids"];

const products = Array.from({ length: 30 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    name: `Product ${id}`,
    price: 10 + id * 3,
    category: categories[id % categories.length],
    inStock: id % 2 === 0
  };
});

let idCounter = products.length + 1;

function toNumber(value) {
  if (value === undefined) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function parsePagination(query) {
  const page = query.page === undefined ? 1 : toNumber(query.page);
  const limit = query.limit === undefined ? 10 : toNumber(query.limit);

  if (!Number.isInteger(page) || page < 1) {
    return { ok: false, message: "Invalid page" };
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    return { ok: false, message: "Invalid limit" };
  }

  return { ok: true, page, limit };
}

function validateNewProduct({ name, price, category, inStock }) {
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedCategory = typeof category === "string" ? category.trim() : "";
  const numericPrice = Number(price);

  if (!trimmedName) {
    return { ok: false, message: "Name is required" };
  }
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return { ok: false, message: "Price must be a positive number" };
  }
  if (!trimmedCategory) {
    return { ok: false, message: "Category is required" };
  }
  if (typeof inStock !== "boolean") {
    return { ok: false, message: "inStock must be boolean" };
  }

  return {
    ok: true,
    name: trimmedName,
    price: numericPrice,
    category: trimmedCategory,
    inStock
  };
}

function validatePatch(body) {
  const updates = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      return { ok: false, message: "Name must be a non-empty string" };
    }
    updates.name = body.name.trim();
  }

  if (body.price !== undefined) {
    const numericPrice = Number(body.price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return { ok: false, message: "Price must be a positive number" };
    }
    updates.price = numericPrice;
  }

  if (body.category !== undefined) {
    if (typeof body.category !== "string" || body.category.trim().length === 0) {
      return { ok: false, message: "Category must be a non-empty string" };
    }
    updates.category = body.category.trim();
  }

  if (body.inStock !== undefined) {
    if (typeof body.inStock !== "boolean") {
      return { ok: false, message: "inStock must be boolean" };
    }
    updates.inStock = body.inStock;
  }

  if (Object.keys(updates).length === 0) {
    return { ok: false, message: "No valid fields to update" };
  }

  return { ok: true, updates };
}

app.get("/products", (req, res) => {
  const pagination = parsePagination(req.query);
  if (!pagination.ok) {
    res.status(400).json({ error: pagination.message });
    return;
  }

  const minPrice = toNumber(req.query.minPrice);
  const maxPrice = toNumber(req.query.maxPrice);
  if (req.query.minPrice !== undefined && minPrice === null) {
    res.status(400).json({ error: "Invalid minPrice" });
    return;
  }
  if (req.query.maxPrice !== undefined && maxPrice === null) {
    res.status(400).json({ error: "Invalid maxPrice" });
    return;
  }
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    res.status(400).json({ error: "minPrice cannot be greater than maxPrice" });
    return;
  }

  const nameFilter =
    typeof req.query.name === "string" && req.query.name.trim().length > 0
      ? req.query.name.trim().toLowerCase()
      : null;
  const searchQuery =
    typeof req.query.q === "string" && req.query.q.trim().length > 0
      ? req.query.q.trim().toLowerCase()
      : null;

  let filtered = products.slice();
  if (minPrice !== null) {
    filtered = filtered.filter((product) => product.price >= minPrice);
  }
  if (maxPrice !== null) {
    filtered = filtered.filter((product) => product.price <= maxPrice);
  }
  if (nameFilter) {
    filtered = filtered.filter(
      (product) => product.name.toLowerCase() === nameFilter
    );
  }
  if (searchQuery) {
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(searchQuery)
    );
  }

  const total = filtered.length;
  const start = (pagination.page - 1) * pagination.limit;
  const end = start + pagination.limit;
  const results = filtered.slice(start, end);

  res.status(200).json({
    page: pagination.page,
    limit: pagination.limit,
    total,
    products: results
  });
});

app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const product = products.find((item) => item.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.status(200).json({ product });
});

app.post("/products", (req, res) => {
  const validation = validateNewProduct(req.body ?? {});
  if (!validation.ok) {
    res.status(400).json({ error: validation.message });
    return;
  }

  const newProduct = {
    id: idCounter,
    name: validation.name,
    price: validation.price,
    category: validation.category,
    inStock: validation.inStock
  };
  idCounter += 1;
  products.push(newProduct);

  res.status(201).json({ product: newProduct });
});

app.patch("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const product = products.find((item) => item.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const validation = validatePatch(req.body ?? {});
  if (!validation.ok) {
    res.status(400).json({ error: validation.message });
    return;
  }

  Object.assign(product, validation.updates);
  res.status(200).json({ product });
});

app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  products.splice(index, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Pagination API running on http://localhost:${PORT}`);
});
