import http from "node:http";

const students = [
  { id: 1, name: "Ali", age: 15 },
  { id: 2, name: "Laylo", age: 14 }
];
let idCounter = 3;

let totalRequests = 0;
let lastRequestTime = null;

function updateStats(req) {
  totalRequests += 1;
  lastRequestTime = new Date().toISOString();
  console.log(`[REQUEST] ${req.method} ${req.url}`);
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json"
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  updateStats(req);

  if (req.method === "GET" && req.url === "/students") {
    console.log("[GET /students] handler start");
    setTimeout(() => {
      console.log("[GET /students] timeout callback");
      sendJson(res, 200, { students });
    }, 500);
    return;
  }

  if (req.method === "POST") {
    if (req.url !== "/students") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (error) {
        sendJson(res, 400, { error: "Invalid JSON" });
        return;
      }

      const newStudent = {
        id: idCounter,
        name: parsed.name,
        age: parsed.age
      };
      idCounter += 1;
      students.push(newStudent);

      setImmediate(() => {
        console.log(
          "[POST /students] after parsing body (setImmediate/setTimeout 0)"
        );
      });

      sendJson(res, 201, { students });
    });

    return;
  }

  if (req.method === "GET" && req.url === "/stats") {
    sendJson(res, 200, {
      totalRequests,
      studentsCount: students.length,
      lastRequestTime
    });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Student API running on http://localhost:${PORT}`);
});

