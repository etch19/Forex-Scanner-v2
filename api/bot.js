// ─────────────────────────────────────────────
// /api/bot — Telegram Webhook Handler
// POST /api/bot  (set this as your bot webhook URL)
//
// Commands:
//   /start   — تشغيل البوت
//   /stop    — إيقاف البوت
//   /tf1     — السكان على دقيقة
//   /tf5     — السكان على 5 دقائق
//   /status  — الحالة الحالية
// ─────────────────────────────────────────────

import { sendTelegram, buildStatusMessage } from "../lib/telegram.js";
import {
  isBotActive, setBotActive,
  getTimeframe, setTimeframe,
  getAllStates,
} from "../lib/state.js";
import { PAIRS } from "../lib/config.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const token     = process.env.TELEGRAM_TOKEN;
  const allowedId = process.env.TELEGRAM_CHAT_ID;

  const body = req.body;
  const msg  = body?.message || body?.edited_message;
  if (!msg) return res.status(200).end("ok");

  const chatId = String(msg.chat?.id);
  const text   = (msg.text || "").trim().toLowerCase();

  // ── Security: only respond to your chat ──
  if (chatId !== String(allowedId)) {
    return res.status(200).end("ok");
  }

  let reply = "";

  if (text === "/start" || text === "/تشغيل") {
    setBotActive(true);
    reply = `✅ <b>البوت شغّال الآن</b>\n\nسيبدأ السكان فوراً في الدقيقة القادمة.\nالإطار الزمني: ${getTimeframe() === "5" ? "٥ دقائق" : "دقيقة"}`;

  } else if (text === "/stop" || text === "/إيقاف") {
    setBotActive(false);
    reply = `🛑 <b>البوت متوقف</b>\n\nلن تصلك أي إشارات حتى تكتب /start`;

  } else if (text === "/tf1") {
    setTimeframe("1");
    reply = `⏱ <b>تم التغيير إلى: دقيقة واحدة</b>\n\nالسكان الآن على شمعة الدقيقة.`;

  } else if (text === "/tf5") {
    setTimeframe("5");
    reply = `⏱ <b>تم التغيير إلى: ٥ دقائق</b>\n\nالسكان الآن على شمعة ٥ دقائق.`;

  } else if (text === "/status" || text === "/حالة") {
    reply = buildStatusMessage(isBotActive(), getTimeframe(), PAIRS);

  } else if (text === "/help" || text === "/مساعدة" || text === "/start@" + process.env.BOT_USERNAME) {
    reply =
      `🤖 <b>أوامر البوت</b>\n` +
      `━━━━━━━━━━━━━━\n` +
      `/start — ▶️ تشغيل البوت\n` +
      `/stop  — ⏹ إيقاف البوت\n` +
      `/tf1   — ⏱ السكان على دقيقة\n` +
      `/tf5   — ⏱ السكان على 5 دقائق\n` +
      `/status — 📊 الحالة الحالية\n` +
      `━━━━━━━━━━━━━━\n` +
      `<i>الأزواج: ${PAIRS.join(", ")}</i>`;

  } else {
    // Unknown command — show help hint
    reply = `❓ أمر غير معروف. اكتب /help لقائمة الأوامر.`;
  }

  try {
    await sendTelegram(token, chatId, reply);
  } catch (e) {
    console.error("Telegram send error:", e.message);
  }

  return res.status(200).end("ok");
}
