# 🏡 ARIA — AI Home Buying Agent

> **100% free to run. No backend. No API keys. No servers. Hosted on GitHub Pages.**

Live demo after setup: `https://YOUR-USERNAME.github.io/aria-agent/`

---

## File Structure

```
aria-agent/
├── index.html                    ← Main page
├── css/
│   └── style.css                 ← All styles (dark luxury theme)
├── js/
│   ├── data.js                   ← Mock property/school/crime data
│   ├── agent.js                  ← ReAct reasoning engine
│   ├── ui.js                     ← DOM rendering
│   └── app.js                    ← Event wiring
└── .github/
    └── workflows/
        └── deploy.yml            ← Auto-deploy to GitHub Pages
```

---

## How to Launch (Step-by-Step)

### Step 1 — Create a GitHub account
Go to https://github.com and sign up (free).

### Step 2 — Create a new repository
1. Click the **+** icon (top right) → **New repository**
2. Name it: `aria-agent`
3. Set visibility: **Public** (required for free GitHub Pages)
4. Click **Create repository**

### Step 3 — Upload your files
**Option A — GitHub web UI (easiest, no Git needed):**
1. In your new repo, click **Add file** → **Upload files**
2. Drag and drop ALL files and folders from this project:
   - `index.html`
   - `css/` folder
   - `js/` folder
   - `.github/` folder
3. Scroll down → click **Commit changes**

**Option B — Git command line:**
```bash
cd aria-static
git init
git add .
git commit -m "Initial ARIA deploy"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/aria-agent.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages
1. Go to your repo → click **Settings** tab
2. In the left sidebar → click **Pages**
3. Under **Source** → select **GitHub Actions**
4. That's it — the workflow will run automatically

### Step 5 — Wait ~60 seconds
Go to the **Actions** tab in your repo.
You'll see a workflow running called **"Deploy ARIA to GitHub Pages"**.
When it shows a green ✅, your site is live.

### Step 6 — Visit your site
Go to: `https://YOUR-USERNAME.github.io/aria-agent/`

Replace `YOUR-USERNAME` with your actual GitHub username.

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| GitHub Pages hosting | **Free** |
| Custom domain | Free (github.io subdomain) |
| API keys | **None needed** |
| Backend server | **None needed** |
| Database | **None needed** |
| CDN | Free (GitHub's) |
| **Total** | **₹0 / month** |

---

## After Launch — Updates

Every time you push changes to the `main` branch, GitHub Actions automatically rebuilds and redeploys your site. No manual steps needed.

To update a file:
1. Edit it on GitHub.com directly, **or**
2. Edit locally and `git push`

---

## Add a Custom Domain (Optional, Still Free)
1. Buy a domain (e.g. `ariaagent.in` from GoDaddy/Namecheap, ~₹700/year)
2. In repo Settings → Pages → **Custom domain** → enter your domain
3. Add a `CNAME` DNS record at your registrar pointing to `YOUR-USERNAME.github.io`

---

## Troubleshooting

**Site shows 404** — Make sure `index.html` is in the root of the repo (not inside a subfolder).

**Workflow fails** — Check the Actions tab for error details. Usually a file path issue.

**`.github` folder not uploading** — On Windows, folders starting with `.` may be hidden. Enable "Show hidden files" in File Explorer first.

**Changes not showing** — Clear your browser cache (Ctrl+Shift+R).
