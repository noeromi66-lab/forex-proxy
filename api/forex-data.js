import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { pair, fromDate, toDate } = req.body;

    if (!pair) {
      return res.status(400).json({ error: "Pair required" });
    }

    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server API key not configured" });
    }

    const url = `https://api.polygon.io/v2/aggs/ticker/${pair}/range/1/hour/${fromDate}/${toDate}?adjusted=true&sort=asc&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "error") {
      return res.status(400).json({ error: data.message });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}
