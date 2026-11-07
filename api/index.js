module.exports = async function handler(req, res) {
  const scriptUrl = process.env.APPS_SCRIPT_URL;

  // Friendly check if environment variable is missing
  if (!scriptUrl || !scriptUrl.startsWith('http')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unit IV Meet - Setup Required</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 520px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          h2 { color: #facc15; margin-top: 0; }
          ol { text-align: left; line-height: 1.8; color: #cbd5e1; padding-left: 20px; }
          code { background: #0f172a; color: #38bdf8; padding: 3px 6px; border-radius: 6px; font-size: 13px; }
          a { color: #38bdf8; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>⚙️ Almost Ready!</h2>
          <p style="color: #94a3b8;">You need to link your Google Apps Script URL in Vercel:</p>
          <ol>
            <li>Go to your <b>Vercel Project (unit42026)</b> &rarr; <b>Settings</b> &rarr; <b>Environment Variables</b>.</li>
            <li>Add Key: <code>APPS_SCRIPT_URL</code></li>
            <li>Add Value: <i>(Your Apps Script Web App link ending in /exec)</i></li>
            <li>Go to <b>Deployments</b> tab &rarr; click <b>...</b> on the latest deployment &rarr; <b>Redeploy</b>.</li>
          </ol>
        </div>
      </body>
      </html>
    `);
  }

  try {
    const targetUrl = new URL(scriptUrl);
    if (req.query) {
      for (const [key, val] of Object.entries(req.query)) {
        targetUrl.searchParams.set(key, val);
      }
    }

    const upstreamRes = await fetch(targetUrl.toString(), {
      method: req.method,
      redirect: 'follow',
      headers: {
        'Accept': req.headers.accept || '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Vercel-Gateway'
      }
    });

    const contentType = upstreamRes.headers.get('content-type') || 'text/html; charset=utf-8';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (contentType.includes('application/json')) {
      const json = await upstreamRes.json();
      return res.status(200).json(json);
    } else {
      const text = await upstreamRes.text();
      return res.status(200).send(text);
    }
  } catch (error) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(`<h3>Gateway Error: ${error.message}</h3>`);
  }
};
