# ✦ GoalFlow

Your daily goal & task tracking app.

---

## 🚀 How to Deploy to GitHub Pages (Step by Step)

### Step 1 — Create a GitHub account
Go to [github.com](https://github.com) and sign up for free.

### Step 2 — Create a new repository
1. Click the **+** button (top right) → **New repository**
2. Name it exactly: `goalflow`
3. Set it to **Public**
4. Click **Create repository**

### Step 3 — Upload the files
1. On your new repo page, click **uploading an existing file**
2. Drag and drop ALL the files from this zip (keep folder structure)
3. Scroll down, click **Commit changes**

### Step 4 — Enable GitHub Pages with Actions
1. Go to your repo → **Settings** tab
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### Step 5 — Wait 2 minutes
GitHub will automatically build and deploy your app.
Your app will be live at:
```
https://YOUR-USERNAME.github.io/goalflow/
```

---

## ✏️ Changing the app name in the URL

If you want a different URL (e.g. `yourname.github.io/myapp/`):
1. Rename the repository to `myapp`
2. Open `vite.config.js` and change `base: '/goalflow/'` to `base: '/myapp/'`
3. Commit the change

---

## 💻 Running locally (optional)

```bash
npm install
npm run dev
```
Then open http://localhost:5173
