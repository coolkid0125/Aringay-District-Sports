export default async function handler(req, res) {
  // If an environment variable is set on Vercel, it uses it; otherwise fallback to the URL below:
  const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE";

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      redirect: 'follow',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script responded with HTTP ${response.status}`);
    }

    const data = await response.json();

    // Cache on Vercel edge for 10 seconds, then revalidate for live score updates
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=5');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
