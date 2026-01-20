import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

const users = [
  { id: 1, name: "Ali", age: 15 },
  { id: 2, name: "Vali", age: 16 },
  { id: 3, name: "Abbos", age: 14 }
];
let idCounter = 4;

function toNumber(value) {
  if (value === undefined) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function validateUserInput({ name, age }) {
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const numericAge = Number(age);

  if (!trimmedName) {
    return { ok: false, message: "Name is required" };
  }
  if (trimmedName.length < 2) {
    return { ok: false, message: "Name must be at least 2 chars" };
  }
  if (!Number.isFinite(numericAge) || numericAge <= 0) {
    return { ok: false, message: "Age must be a positive number" };
  }

  return { ok: true, name: trimmedName, age: numericAge };
}

app.get("/users", (req, res) => {
  const minAge = toNumber(req.query.minAge);
  const maxAge = toNumber(req.query.maxAge);

  let result = users.slice();
  if (minAge !== null) {
    result = result.filter((user) => user.age >= minAge);
  }
  if (maxAge !== null) {
    result = result.filter((user) => user.age <= maxAge);
  }

  res.json({ users: result });
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const user = users.find((item) => item.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ user });
});

app.post("/users", (req, res) => {
  const validation = validateUserInput(req.body ?? {});
  if (!validation.ok) {
    res.status(400).json({ error: validation.message });
    return;
  }

  const newUser = {
    id: idCounter,
    name: validation.name,
    age: validation.age
  };
  idCounter += 1;
  users.push(newUser);

  res.status(201).json({ user: newUser });
});

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const user = users.find((item) => item.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const validation = validateUserInput(req.body ?? {});
  if (!validation.ok) {
    res.status(400).json({ error: validation.message });
    return;
  }

  user.name = validation.name;
  user.age = validation.age;

  res.json({ user });
});

app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const index = users.findIndex((item) => item.id === id);
  if (index === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const [removed] = users.splice(index, 1);
  res.json({ deleted: removed });
});

app.get("/users/error", (req, res, next) => {
  next(new Error("Intentional user error"));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`CRUD server running on http://localhost:${PORT}`);
});

