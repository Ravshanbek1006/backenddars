import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE_PATH = path.join(__dirname, "logs.txt");

export async function log(message) {
  const timestamp = new Date().toISOString();
  const line = `${timestamp} - ${message}\n`;

  await fs.appendFile(LOG_FILE_PATH, line, { encoding: "utf8" });
}

export async function readLogs() {
  try {
    return await fs.readFile(LOG_FILE_PATH, "utf8");
  } catch (error) {
    const reason = error && error.message ? error.message : String(error);
    console.error(`Log faylini o'qib bo'lmadi: ${reason}`);
    return null;
  }
}

