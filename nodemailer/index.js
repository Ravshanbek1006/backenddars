import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

const PORT = Number(process.env.PORT) || 3000;
const GMAIL_USER = requireEnv("GMAIL_USER");
const GMAIL_PASS = requireEnv("GMAIL_PASS");
const MAIL_FROM = process.env.MAIL_FROM || GMAIL_USER;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS
  }
});

async function sendWithLogging(to, subject, text, html) {
  const info = await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    text,
    html
  });

  console.log("messageId:", info.messageId);
  console.log("accepted:", info.accepted);
  console.log("rejected:", info.rejected);

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected
  };
}

const app = express();
app.use(express.json());

app.post("/send", async (req, res) => {
  const { to, subject, text, html } = req.body ?? {};

  if (!to || !subject) {
    res.status(400).json({ error: "to and subject are required" });
    return;
  }

  if (!text && !html) {
    res.status(400).json({ error: "text or html is required" });
    return;
  }

  try {
    const result = await sendWithLogging(to, subject, text, html);
    res.status(200).json(result);
  } catch (error) {
    console.error("Send mail error:", error);
    const message = error && error.message ? error.message : "Mail send failed";
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Mail server running on http://localhost:${PORT}`);
});
