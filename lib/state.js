// ─────────────────────────────────────────────
// State Manager
// • Bot ON/OFF toggle
// • Rising-edge dedup per symbol per timeframe
// • Stores last signal to detect changes
// ─────────────────────────────────────────────

// In-memory (resets on cold start ~10-15min on Vercel free tier)
// For persistent state across cold starts → swap with Vercel KV (see bottom)
const store = {
  botActive: true,         // default ON
  timeframe: "1",          // "1" or "5"
  signals:   new Map(),    // "EURUSD_1" → "PRE_UP" | "UP" | null
};

// ── Bot control ──────────────────────────────
export function isBotActive()         { return store.botActive; }
export function setBotActive(val)     { store.botActive = Boolean(val); }
export function getTimeframe()        { return store.timeframe; }
export function setTimeframe(tf)      { store.timeframe = String(tf); }

// ── Rising-edge detection ─────────────────────
// Returns true only when signal CHANGES (new trigger)
export function isNewSignal(symbol, tf, currentSignal) {
  const key  = `${symbol}_${tf}`;
  const prev = store.signals.get(key) ?? null;
  store.signals.set(key, currentSignal ?? null);
  // Fire when: entering a signal state (prev was different)
  return prev !== currentSignal && currentSignal !== null;
}

export function getAllStates() {
  return {
    botActive: store.botActive,
    timeframe: store.timeframe,
    signals:   Object.fromEntries(store.signals),
  };
}

export function resetSignals() {
  store.signals.clear();
}

// ─────────────────────────────────────────────
// OPTIONAL Vercel KV persistent state
// npm i @vercel/kv  →  uncomment below
// ─────────────────────────────────────────────
// import { kv } from "@vercel/kv";
// export async function isBotActiveKV() {
//   return (await kv.get("bot:active")) !== "false";
// }
// export async function setBotActiveKV(val) {
//   await kv.set("bot:active", String(val));
// }
// export async function isNewSignalKV(symbol, tf, sig) {
//   const key  = `sig:${symbol}_${tf}`;
//   const prev = await kv.get(key);
//   await kv.set(key, sig ?? "null", { ex: 600 });
//   return prev !== String(sig) && sig !== null;
// }
