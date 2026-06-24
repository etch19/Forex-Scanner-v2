// ─────────────────────────────────────────────
// TradingView Candle Fetcher
// Supports 1m and 5m timeframes
// ─────────────────────────────────────────────

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Referer":    "https://www.tradingview.com/",
  "Origin":     "https://www.tradingview.com",
};

/**
 * Fetch candles from TradingView
 * @param {string} symbol  e.g. "EURUSD"
 * @param {string} tf      "1" or "5"
 * @param {number} bars    number of candles to fetch
 * @returns {number[]}     array of close prices (oldest → newest)
 */
export async function fetchCandles(symbol, tf = "1", bars = 60) {
  const tvSymbol = `FX_IDC:${symbol}`;
  const to       = Math.floor(Date.now() / 1000);
  const secPerBar = tf === "5" ? 300 : 60;
  const from     = to - bars * secPerBar * 3; // 3x buffer for market gaps

  const url = `https://www.tradingview.com/widgetembed/history/?symbol=${encodeURIComponent(tvSymbol)}&resolution=${tf}&from=${from}&to=${to}`;

  const res = await fetch(url, {
    headers: HEADERS,
    signal:  AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`TV HTTP ${res.status} for ${symbol}`);

  const data = await res.json();

  if (data.s === "no_data" || !data.c || data.c.length === 0) {
    throw new Error(`No data — ${symbol} (market closed or weekend)`);
  }

  // Return last `bars` closes
  return data.c.slice(-bars);
}
