module.exports = async function handler(req, res) {
  const scriptUrl = process.env.APPS_SCRIPT_URL;

  if (!scriptUrl || !scriptUrl.startsWith('http')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`<h3>Please configure APPS_SCRIPT_URL in Vercel Environment Variables.</h3>`);
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

    const isApiCall = (req.query && req.query.api === '1');

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (isApiCall) {
      res.setHeader('Content-Type', 'application/json');
      const json = await upstreamRes.json();
      return res.status(200).json(json);
    } else {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      const text = await upstreamRes.text();
      return res.status(200).send(text);
    }
  } catch (error) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(`<h3>Gateway Connection Error: ${error.message}</h3>`);
  }
};
