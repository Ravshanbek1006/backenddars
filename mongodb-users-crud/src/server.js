require("dotenv").config();

const app = require("./app");
const { connectDb } = require("./utils/connectDb");

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDb(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

