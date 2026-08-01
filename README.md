# প্রথম খাবার (Prothom Khabar)

A free, bilingual (বাংলা / English) guide for Bangladeshi families starting their baby on solid food.

**Live site:** `https://<your-username>.github.io/prothomkhabar/`
*(replace with your URL once GitHub Pages is enabled — see [PUBLISHING.md](PUBLISHING.md))*

---

## What's inside

| | |
|---|---|
| 🍽 **খাবার তালিকা** | 100 foods with age, allergen, choking and serving guidance |
| 📖 **BLW গাইড** | Baby-led weaning vs traditional spoon-feeding |
| 🍱 **মিল প্ল্যানার** | A day's plan built around age, feeding method, diet, allergies and budget |
| 🍲 **রেসিপি** | 19 Bangladeshi recipes with storage, freezing and reheating instructions |
| 📏 **বয়সভিত্তিক গাইড** | Portions, texture progression, milk vs solids, teething, screen-free meals |
| 🚨 **ফার্স্ট এইড** | Gagging vs choking, step-by-step response, what never to do |
| 🎯 **মাইলস্টোন** | Feeding milestone tracker with progress |
| 🛒 **কেনাকাটা** | 28 items rated by priority with Bangladeshi prices, plus where to buy |
| 👐 **BLW মাস্টারি** | 21 practical topics with checklists |
| 📋 **ট্র্যাকার** | Daily food log, streaks, reaction notes, backup and restore |

## Privacy

There is no account and no server. Everything a caregiver records stays in their own browser and is never uploaded. The Tracker tab includes **Download backup** / **Restore from backup** so data can be moved to a new phone.

## Works offline

Once opened from the live URL, the app can be installed to the home screen and used with no internet connection.

## Editing the app

`index.html` is a single self-contained file and can be edited directly. For larger changes, the source parts live in `build/`:

```bash
cd build
python3 splice.py     # rebuilds ../index.html from base.html + the parts
node test.js          # 128 automated checks (needs: npm install jsdom)
```

`build/base.html` is the original v1 app, kept untouched. `splice.py` reapplies every v2 change to it using exact anchors and fails loudly if anything no longer matches, so the two never silently drift apart.

See [DEVELOPER-NOTES.md](DEVELOPER-NOTES.md) for architecture, performance notes and roadmap.

## When you update the app

After changing `index.html`, bump the version in `sw.js`:

```js
const CACHE_VERSION = 'pk-v2.0.0';   →   'pk-v2.0.1'
```

Without this, returning visitors keep seeing the old cached version.

---

## Disclaimer

Content is educational and based on general WHO, UNICEF, AAP and NHS complementary feeding guidance. It does not replace a pediatrician, a dietitian, or emergency services. In an emergency call **999**.
