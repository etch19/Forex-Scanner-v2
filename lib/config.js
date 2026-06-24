// ─────────────────────────────────────────────
// Central Configuration
// ─────────────────────────────────────────────

export const PAIRS = [
  "EURUSD", "USDJPY", "GBPUSD",
  "USDCHF", "AUDUSD", "USDCAD", "NZDUSD",
];

export const INDICATOR_SETTINGS = {
  bbLength:     20,
  bbMult:       2.0,
  rsiLength:    14,
  rsiUpThr:     38,    // RSI below this → PRE_UP
  rsiDnThr:     62,    // RSI above this → PRE_DOWN
  proxPct:      0.02,  // % distance from band → PRE signal
  proxConfirm:  0.005, // % distance from band → CONFIRM signal
};

export const BARS_NEEDED = 60; // candles to fetch per scan
