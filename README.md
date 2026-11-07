# UNIT IV MEET - Live Medal Tally System
Deployable to GitHub & Vercel with Google Apps Script Live Gateway.

## Folder Contents
- `index.html`: The complete, responsive athletic tournament board.
- `api/gateway.js`: The Vercel serverless gateway that bridges Google Sheets with Vercel in real-time.
- `vercel.json`: Configuration for Vercel routing.
- `Code.gs`: The backend script for your Google Sheet.

---

## Quick Step-by-Step Instructions

### Step 1: In Google Sheets (Deploy API Gateway)
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Copy and paste the code from `Code.gs` into the editor.
3. Click the blue **Deploy** button (top right) > **New deployment**.
4. Select type: **Web app**.
5. Set **Execute as**: `Me`.
6. Set **Who has access**: `Anyone`.
7. Click **Deploy** and **copy the Web App URL** (ends in `/exec`).

---

### Step 2: Upload Files to GitHub
1. Go to [github.com](https://github.com) and create a new repository (e.g. `unit-iv-meet`).
2. Upload the files in this folder:
   - `index.html`
   - `vercel.json`
   - `api/gateway.js`

---

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** > **Project**.
3. Find your `unit-iv-meet` GitHub repository and click **Import**.
4. Under **Environment Variables**, add:
   - **Name**: `APPS_SCRIPT_URL`
   - **Value**: *(Paste your Google Apps Script URL from Step 1)*
5. Click **Deploy**!

Within seconds, you will receive your live, high-speed link (e.g., `https://unit-iv-meet.vercel.app`) that automatically updates whenever scores are changed in Google Sheets!
