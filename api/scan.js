// ─────────────────────────────────────────────
// /api/scan — Main Scanner (called by GitHub Actions cron)
// GET /api/scan
// ─────────────────────────────────────────────

import { fetchCandles }              from "../lib/tradingview.js";
import { evaluateSignals }           from "../lib/indicators.js";
import { sendTelegram, buildMessage } from "../lib/telegram.js";
import { isBotActive, getTimeframe, isNewSignal } from "../lib/state.js";
import { PAIRS, INDICATOR_SETTINGS, BARS_NEEDED } from "../lib/config.js";

export default async function handler(req, res) {
  // ── Auth ─────────────────────────────────
  const secret = process.env.CRON_SECRET;
  const auth   = req.headers["authorization"];
  if (secret && auth !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ── Bot ON/OFF check ──────────────────────
  if (!isBotActive()) {
    return res.status(200).json({ skipped: true, reason: "Bot is OFF" });
  }

  const token  = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ error: "Missing Telegram env vars" });
  }

  const tf      = getTimeframe(); // "1" or "5"
  const results = [];
  const alerts  = [];
  const errors  = [];

  // ── Scan all pairs in parallel ────────────
  await Promise.allSettled(
    PAIRS.map(async (symbol) => {
      try {
        const closes = await fetchCandles(symbol, tf, BARS_NEEDED);
        const eval_  = evaluateSignals(closes, INDICATOR_SETTINGS);

        results.push({
          symbol,
          signal:  eval_.signal ?? "—",
          price:   eval_.price?.toFixed(5),
          rsi:     eval_.rsi?.toFixed(2),
          bbU:     eval_.bb?.upper?.toFixed(5),
          bbL:     eval_.bb?.lower?.toFixed(5),
        });

        // Rising-edge: only fire on NEW signal
        if (eval_.ready && isNewSignal(symbol, tf, eval_.signal)) {
          const msg = buildMessage(symbol, eval_.signal, tf, eval_.price);
          if (msg) {
            await sendTelegram(token, chatId, msg);
            alerts.push({ symbol, signal: eval_.signal });
          }
        }
      } catch (err) {
        errors.push({ symbol, error: err.message });
      }
    })
  );

  return res.status(200).json({
    ts:      new Date().toISOString(),
    tf,
    scanned: results.length,
    alerts:  alerts.length,
    results,
    alerts,
    errors,
  });
}
