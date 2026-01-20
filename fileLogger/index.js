import { log, readLogs } from "./logger.js";

async function run() {
  await log("APP STARTED");

  setTimeout(() => {
    void log("FIRST TIMEOUT EVENT");
  }, 2000);

  let tickCount = 0;
  const intervalId = setInterval(() => {
    tickCount += 1;
    void log("INTERVAL TICK");

    if (tickCount >= 3) {
      clearInterval(intervalId);
    }
  }, 1000);

  setTimeout(async () => {
    const logs = await readLogs();
    if (logs) {
      console.log("=== LOGS ===");
      console.log(logs.trimEnd());
      console.log("============");
    }
  }, 5500);
}

void run();

