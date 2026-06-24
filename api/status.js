// /api/status — Health check & state dump
import { getAllStates } from "../lib/state.js";
import { PAIRS, INDICATOR_SETTINGS } from "../lib/config.js";

export default function handler(req, res) {
  return res.status(200).json({
    service:   "Forex BB+RSI Scanner",
    timestamp: new Date().toISOString(),
    pairs:     PAIRS,
    settings:  INDICATOR_SETTINGS,
    ...getAllStates(),
  });
}
