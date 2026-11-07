/**
 * VERCEL TRANSPARENT GATEWAY WRAPPER
 * 
 * Every time someone visits your Vercel URL, this gateway fetches 
 * the LIVE HTML and LIVE JSON directly from Google Apps Script.
 * 
 * When you edit Index.html or Code.gs in Apps Script, Vercel updates 
 * automatically without needing to edit or upload to GitHub ever again!
 */

export default async function handler(req, res) {
  // Set your Google Apps Script Web App URL in Vercel Environment Variables:
  // Key: APPS_SCRIPT_URL
  const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE";

  // Build target URL preserving query parameters (e.g. ?api=1)
  const targetUrl = new URL(APPS_SCRIPT_URL);
  for (const [key, val] of Object.entries(req.query || {})) {
    targetUrl.searchParams.set(key, val);
  }

  try {
    const upstreamRes = await fetch(targetUrl.toString(), {
      method: req.method,
      redirect: 'follow', // Automatically follows Google's 302 redirect
      headers: {
        'Accept': req.headers.accept || '*/*',
        'User-Agent': req.headers['user-agent'] || 'Vercel-Gateway'
      }
    });

    const contentType = upstreamRes.headers.get('content-type') || 'text/html; charset=utf-8';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Always fetch fresh code
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (contentType.includes('application/json')) {
      const json = await upstreamRes.json();
      return res.status(200).json(json);
    } else {
      const text = await upstreamRes.text();
      return res.status(200).send(text);
    }
  } catch (error) {
    return res.status(500).send(`Gateway Error: ${error.message}`);
  }
}
