# Publishing to GitHub Pages

## Files to upload

Put all six in the **root** of the repository, not in a folder:

```
index.html            ← the app (must be named exactly this)
manifest.json         ← makes it installable
sw.js                 ← makes it work offline
icon-192.png
icon-512.png
apple-touch-icon.png
```

`index.html` works on its own. The other five only add the install-and-offline behaviour — nothing breaks if you skip them, but they are what protects a mother's saved data on iPhone, so upload them.

## Steps

1. Create a repository on GitHub, e.g. `prothom-khabar`. Make it **public** (GitHub Pages needs public on the free plan).
2. Click **Add file → Upload files**, drag in all six, then **Commit changes**.
3. Go to **Settings → Pages**.
4. Under *Source* choose **Deploy from a branch**; set branch to `main` and folder to `/ (root)`. Save.
5. Wait 1–2 minutes. Your site is live at:
   `https://<your-username>.github.io/prothom-khabar/`

That URL is what you share. It is HTTPS, which the offline feature requires — so it works on Pages but not when opening the file from your desktop.

## When you update the app later

Re-upload `index.html`, **and** open `sw.js` and bump the version line:

```js
const CACHE_VERSION = 'pk-v2.0.0';   →   'pk-v2.0.1'
```

Without that bump, people who already visited keep seeing the old cached version. This is the single most common mistake with offline web apps.

---

# How mothers keep their data

## It saves automatically

Everything a mother records — the food log, milestones, BLW checklists, planner settings and language choice — is written to her phone's browser storage the moment she taps. Closing the tab, reloading, or restarting the phone does not lose it. Nothing is sent to any server; there is no account and no database.

Verified by test: two food entries plus a milestone recorded, browser fully closed and reopened, all restored intact.

## Tell mothers to do this one thing

Once a month, open the **📋 ট্র্যাকার** tab, scroll to **🔒 আপনার তথ্য ও ব্যাকআপ**, and tap **💾 ব্যাকআপ ডাউনলোড করুন**. That saves a small `.json` file. Send it to yourself on WhatsApp or email.

If she gets a new phone, or clears her browser, she opens the app there and taps **📂 ব্যাকআপ থেকে ফেরান**, picks that file, and everything comes back.

The app explains this in Bangla inside that panel, so you do not have to teach it separately.

## What can still lose data, and what the app does about it

| Risk | What happens | Handled by |
|---|---|---|
| Clearing browser data/history | App data is erased too | Backup file |
| New phone, or a different browser | Starts empty (Chrome and the in-app Facebook browser are separate) | Backup file |
| iPhone Safari eviction after ~7 days unused | Data can be deleted by iOS | **Installing to Home Screen** stops this — that is what `sw.js` and `manifest.json` are for |
| Private/incognito mode | Nothing saves at all | The app detects this and shows a red warning telling her to open a normal window |
| Both parents logging separately | The two phones will not merge | App tells them to keep one log and share the backup file |

## Why there is no login

A login needs a server, a database, an ongoing bill and someone to administer it — and storing infant health data under real accounts brings privacy obligations you would have to take on personally. Since you are publishing a static site and stepping away, the backup file gives mothers the same protection with none of that. It also keeps the app working with no internet, which matters more in practice: it is used at the highchair, not at a desk.

If you ever do want accounts, the code is ready for it. `Backup.KEYS` lists every stored key, and `loadTracker()` / `saveTracker()` in the tracker are the only two functions that touch storage — swap those for Firebase Firestore calls and the rest of the app is unchanged.

---

# Suggested repository README

Copy this into `README.md` if you want one:

```markdown
# প্রথম খাবার (Prothom Khabar)

A free, bilingual (বাংলা/English) guide for Bangladeshi families starting
their baby on solid food — 100 foods, meal planner, recipes, portion and
texture guides, choking first aid, milestone tracker and shopping guide.

**Live: https://<username>.github.io/prothom-khabar/**

Works offline once installed. All data stays on your own device; there is
no account and nothing is uploaded.

Content is educational, based on general WHO, UNICEF, AAP and NHS
complementary feeding guidance. It does not replace a pediatrician,
a dietitian, or emergency services. In an emergency call 999.
```

Consider adding a line naming a pediatrician or nutritionist who has reviewed the content, plus a "last reviewed" date. For a health app aimed at infant feeding, that is worth more than any feature.
