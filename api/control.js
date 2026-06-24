// /api/control — Web UI control endpoint
// POST /api/control  body: { action: "start"|"stop"|"tf1"|"tf5", secret }

import { setBotActive, setTimeframe, getAllStates } from "../lib/state.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { action, secret } = req.body || {};
  const envSecret = process.env.CRON_SECRET;

  if (envSecret && secret !== envSecret) {
    return res.status(401).json({ error: "Invalid secret" });
  }

  switch (action) {
    case "start": setBotActive(true);    break;
    case "stop":  setBotActive(false);   break;
    case "tf1":   setTimeframe("1");     break;
    case "tf5":   setTimeframe("5");     break;
    default:
      return res.status(400).json({ error: "Unknown action" });
  }

  return res.status(200).json({ ok: true, state: getAllStates() });
}
