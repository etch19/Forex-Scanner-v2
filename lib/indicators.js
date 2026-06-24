// ─────────────────────────────────────────────
// Technical Indicators: Bollinger Bands + RSI
// ─────────────────────────────────────────────

function sma(arr, period) {
  if (arr.length < period) return null;
  const slice = arr.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function stddev(arr, period) {
  if (arr.length < period) return null;
  const slice = arr.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / period;
  return Math.sqrt(variance);
}

export function bollingerBands(closes, length = 20, mult = 2.0) {
  if (closes.length < length) return null;
  const basis = sma(closes, length);
  const dev   = stddev(closes, length);
  if (basis === null || dev === null) return null;
  return { upper: basis + mult * dev, basis, lower: basis - mult * dev };
}

// Wilder's smoothing RSI — identical to Pine Script / TradingView
export function rsi(closes, period = 14) {
  if (closes.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses += Math.abs(diff);
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + (diff >= 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? Math.abs(diff) : 0)) / period;
  }
  if (avgLoss === 0) return 100;
  return 100 - 100 / (1 + avgGain / avgLoss);
}

// ─── Signal Evaluation ───────────────────────
// Returns: null | "PRE_UP" | "PRE_DOWN" | "UP" | "DOWN"
export function evaluateSignals(closes, cfg = {}) {
  const {
    bbLength  = 20, bbMult    = 2.0,
    rsiLength = 14, rsiUpThr  = 38, rsiDnThr = 62,
    proxPct   = 0.02, proxConfirm = 0.005,
  } = cfg;

  if (closes.length < bbLength + 5) return { ready: false };

  const bb      = bollingerBands(closes, bbLength, bbMult);
  const rsiVal  = rsi(closes, rsiLength);
  if (!bb || rsiVal === null) return { ready: false };

  const price = closes.at(-1);
  const distToLowerPct = Math.abs(price - bb.lower) / bb.lower * 100;
  const distToUpperPct = Math.abs(price - bb.upper) / bb.upper * 100;

  // PRE signal: approaching (within proxPct)
  const preUp   = distToLowerPct <= proxPct || rsiVal < rsiUpThr;
  const preDown = distToUpperPct <= proxPct || rsiVal > rsiDnThr;

  // CONFIRM signal: touched / crossed (within proxConfirm or beyond)
  const confirmUp   = distToLowerPct <= proxConfirm || price <= bb.lower;
  const confirmDown = distToUpperPct <= proxConfirm || price >= bb.upper;

  let signal = null;
  if      (confirmUp && !confirmDown) signal = "UP";
  else if (confirmDown && !confirmUp) signal = "DOWN";
  else if (preUp && !preDown)         signal = "PRE_UP";
  else if (preDown && !preUp)         signal = "PRE_DOWN";

  return {
    ready: true, signal, price,
    bb, rsi: rsiVal,
    distToLowerPct, distToUpperPct,
  };
}
