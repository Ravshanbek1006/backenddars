import express from "express";

const app = express();
const PORT = 3000;

const users = ["Ali", "Vali", "Abbos"];

app.use(express.urlencoded({ extended: false }));

function renderPage({ message = "", messageType = "info" } = {}) {
  const messageBlock = message
    ? `<p class="${messageType}">${message}</p>`
    : "";
  const listItems = users.map((user) => `<li>${user}</li>`).join("");

  return `<!doctype html>
<html lang="uz">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini CRUD - Users</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; }
      ul { padding-left: 18px; }
      .success { color: #0a7a29; }
      .error { color: #b00020; }
      form { margin-top: 12px; }
      input { padding: 6px 8px; }
      button { padding: 6px 12px; margin-left: 6px; }
    </style>
  </head>
  <body>
    <h1>Users</h1>
    ${messageBlock}
    <ul>${listItems}</ul>
    <form action="/users" method="post">
      <input type="text" name="name" placeholder="Ism kiriting" />
      <button type="submit">Qo'shish</button>
    </form>
    <form action="/users" method="get">
      <button type="submit">Yangilash</button>
    </form>
  </body>
</html>`;
}

app.get("/users", (req, res) => {
  res.send(renderPage());
});

app.post("/users", (req, res) => {
  const rawName = req.body?.name;
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (!name) {
    res.status(400).send(renderPage({ message: "Name required", messageType: "error" }));
    return;
  }

  if (name.length < 3) {
    res.status(400).send(renderPage({ message: "Min 3 chars", messageType: "error" }));
    return;
  }

  const exists = users.some((user) => user.toLowerCase() === name.toLowerCase());
  if (exists) {
    res.status(400).send(renderPage({ message: "Already exists", messageType: "error" }));
    return;
  }

  users.push(name);
  res.send(renderPage({ message: "✅ Qo'shildi", messageType: "success" }));
});

app.listen(PORT, () => {
  console.log(`Mini CRUD server running on http://localhost:${PORT}`);
});

