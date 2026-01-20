import express from "express";

const app = express();
const PORT = 3001;

app.use(express.json());

const products = [
  { id: 1, title: "Mouse", price: 100 },
  { id: 2, title: "Keyboard", price: 200 }
];
let idCounter = 3;

function validateProductInput({ title, price }) {
  const trimmedTitle = typeof title === "string" ? title.trim() : "";
  const numericPrice = Number(price);

  if (!trimmedTitle) {
    return { ok: false, message: "Title is required" };
  }
  if (trimmedTitle.length < 2) {
    return { ok: false, message: "Title must be at least 2 chars" };
  }
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return { ok: false, message: "Price must be a positive number" };
  }

  return { ok: true, title: trimmedTitle, price: numericPrice };
}

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

  res.json({ product });
});

app.post("/products", (req, res) => {
  const validation = validateProductInput(req.body ?? {});
  if (!validation.ok) {
    res.status(400).json({ error: validation.message });
    return;
  }

  const newProduct = {
    id: idCounter,
    title: validation.title,
    price: validation.price
  };
  idCounter += 1;
  products.push(newProduct);

  res.status(201).json({ product: newProduct });
});

app.put("/products/:id", (req, res) => {
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

  const validation = validateProductInput(req.body ?? {});
  if (!validation.ok) {
    res.status(400).json({ error: validation.message });
    return;
  }

  product.title = validation.title;
  product.price = validation.price;

  res.json({ product });
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

  const [removed] = products.splice(index, 1);
  res.json({ deleted: removed });
});

app.get("/products/error", (req, res, next) => {
  next(new Error("Intentional product error"));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Products CRUD running on http://localhost:${PORT}`);
});

