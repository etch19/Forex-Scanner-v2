// ─────────────────────────────────────────────
// Telegram Sender + Message Formatter
// ─────────────────────────────────────────────

const TG_API = "https://api.telegram.org";

export async function sendTelegram(token, chatId, text, extra = {}) {
  const res = await fetch(`${TG_API}/bot${token}/sendMessage`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({
      chat_id:    chatId,
      text,
      parse_mode: "HTML",
      ...extra,
    }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram: ${data.description}`);
  return data;
}

// ── Message Builders ─────────────────────────
// Format: clean, emoji-based, easy to read at a glance

function nowTime() {
  return new Date().toLocaleTimeString("ar-EG", {
    hour: "2-digit", minute: "2-digit",
    timeZone: "Asia/Riyadh",
  });
}

export function buildMessage(symbol, signal, tf, price) {
  const time   = nowTime();
  const tfText = tf === "5" ? "٥ دقائق" : "دقيقة";
  const priceF = price?.toFixed(5) ?? "";

  switch (signal) {
    case "PRE_UP":
      return (
        `⏳ <b>تحضير — صعود محتمل</b>\n` +
        `━━━━━━━━━━━━━━\n` +
        `🟡 ${symbol}  |  ${tfText}\n` +
        `⏰ ${time}\n` +
        `💰 السعر: ${priceF}\n` +
        `━━━━━━━━━━━━━━\n` +
        `📌 <i>انتظر تأكيد الدخول في الشمعة القادمة ↑</i>`
      );

    case "PRE_DOWN":
      return (
        `⏳ <b>تحضير — هبوط محتمل</b>\n` +
        `━━━━━━━━━━━━━━\n` +
        `🟡 ${symbol}  |  ${tfText}\n` +
        `⏰ ${time}\n` +
        `💰 السعر: ${priceF}\n` +
        `━━━━━━━━━━━━━━\n` +
        `📌 <i>انتظر تأكيد الدخول في الشمعة القادمة ↓</i>`
      );

    case "UP":
      return (
        `🟢 <b>إشارة دخول — صعود</b>\n` +
        `━━━━━━━━━━━━━━\n` +
        `📈 ${symbol}  |  ${tfText}\n` +
        `⏰ ${time}\n` +
        `💰 السعر: ${priceF}\n` +
        `━━━━━━━━━━━━━━\n` +
        `✅ <b>ادخل الشمعة القادمة ⬆️ فوق</b>`
      );

    case "DOWN":
      return (
        `🔴 <b>إشارة دخول — هبوط</b>\n` +
        `━━━━━━━━━━━━━━\n` +
        `📉 ${symbol}  |  ${tfText}\n` +
        `⏰ ${time}\n` +
        `💰 السعر: ${priceF}\n` +
        `━━━━━━━━━━━━━━\n` +
        `✅ <b>ادخل الشمعة القادمة ⬇️ تحت</b>`
      );

    default:
      return null;
  }
}

// ── Status / Control Messages ─────────────────
export function buildStatusMessage(active, tf, pairs) {
  const tfText = tf === "5" ? "٥ دقائق" : "دقيقة";
  const status = active ? "🟢 يعمل" : "🔴 متوقف";
  return (
    `⚙️ <b>حالة البوت</b>\n` +
    `━━━━━━━━━━━━━━\n` +
    `الحالة: ${status}\n` +
    `الإطار الزمني: ${tfText}\n` +
    `الأزواج: ${pairs.join(", ")}\n` +
    `━━━━━━━━━━━━━━\n` +
    `الأوامر:\n` +
    `/start — تشغيل\n` +
    `/stop — إيقاف\n` +
    `/tf1 — سكان دقيقة\n` +
    `/tf5 — سكان 5 دقائق\n` +
    `/status — الحالة الحالية`
  );
}
