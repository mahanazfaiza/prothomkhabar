# প্রথম খাবার (Prothom Khabar) — v2 Developer Notes

Main file: `index.html` · 470 KB raw / ~118 KB gzipped · zero build step, zero dependencies.
Optional companions for offline install: `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.
See **PUBLISHING.md** for GitHub Pages deployment and how caregivers back up their data.

---

## 1. Summary of new features

### Tabs added (3 → 10)

| Tab | Module | What it does |
|---|---|---|
| 🍱 Meal Planner | `Planner` | Generates a full day's plan from age (6–24m), feeding method (BLW / traditional / mixed), diet (veg / non-veg), 8 allergen exclusions and 3 budget tiers. Each meal card carries recipe, preparation, texture, serving size and nutrition notes, plus milk, water, timing and salt reminders drawn from the matching WHO age band. "Generate another plan" reshuffles. Settings persist. |
| 🍲 Recipes | `Recipes` | 19 Bangladeshi recipes across 13 categories and 4 age bands. Detail view covers ingredients, numbered steps, cooking time, storage, freezer and reheating instructions, texture, serving size, nutrition, allergens and choking precautions. |
| 📏 Age Guides | `Guides` | Five sub-guides behind one sub-nav: **Portions** (8 ages with scaled bowl illustrations, meals/snacks/milk/water per day), **Texture** (5-stage interactive timeline with examples, common mistakes and readiness signs), **Milk vs Solids** (9-age timeline with a milk/solids calorie split bar), **Teething** (signs, cold/soft foods, foods to avoid, meal ideas, hydration, what's normal, when to see a doctor), **Screen-free** (evidence across 5 domains, Do/Don't cards, alternatives, a 6-step transition plan, handling crying). |
| 🚨 First Aid | `FirstAid` | Side-by-side gagging vs choking comparison across signs, sounds, appearance, behaviour and caregiver actions; a 7-step under-1 choking sequence (back blows + chest thrusts, no abdominal thrusts); 8 "what NOT to do" cards; prevention list; when to call and when *not* to intervene; 999 tap-to-call. |
| 🎯 Milestones | `Milestones` | 12 feeding milestones in 5 groups with animated progress percentage. Tap to mark; the achieved date is stored (ready for future charting). |
| 🛒 Shopping | `Shopping` | 28 products with ★1–5 priority, purpose, why it helps, when it becomes useful, quantity, approximate BDT price, cleaning tips and a cheaper substitute for every item. Second sub-tab lists 8 Bangladeshi retailers with strengths, weaknesses, price level and "best for". |
| 👐 BLW Mastery | `BLWPro` | 21 collapsible topics from mental preparation to evidence review, with 6 persisted interactive checklists. |
| 🔒 Data & backup | `Backup` | Lives at the bottom of the existing Tracker tab. Shows live counts of stored records, warns if the browser cannot save (private mode), and provides Download backup / Restore from backup / Erase all. Export is a versioned JSON file; import validates the file signature and refuses foreign or corrupt files without touching existing data. |

### Cross-cutting

- **Bilingual throughout.** All new content is authored as `{bn, en}` pairs and routed through `Util.t()`. Modules register a re-render callback in `LANG_HOOKS`, which the original `setLang()` now invokes — so JS-generated content follows the existing toggle exactly as the `[lang-bn]` / `[lang-en]` markup does. Numbers switch script too (`Util.num`), including gear prices.
- **localStorage persistence** under a single `pk2.*` namespace: `trackerLog`, `milestones`, `blwChecks`, `planner`, `lang`, `lastTab`. Every access is wrapped in try/catch so private browsing and `file://` degrade gracefully to in-memory.
- **The existing food tracker now persists** (it previously reset on reload) via `loadTracker()` / `saveTracker()`, without altering its UI or behaviour.
- **Reusable primitives** in `Util`: `t`, `tt`, `esc`, `load`, `save`, `num`, `shuffle`, `stars`, `accordion`, `empty`, `list`, `food`/`foodName`/`foodIcon`. Shared CSS components: `.v-card`, `.v-grid`, `.v-btn`, `.v-form`, `.chip`, `.acc`, `.v-empty`, `.timeline`, `.subnav`.
- **The planner and recipes reference the existing `FOODS` array by id** rather than duplicating food data, so the catalogue stays the single source of truth.
- **Empty states, subtle animations, collapsible FAQs**, and educational disclaimers on every medical module.

### Design preservation

The original stylesheet is untouched. New rules only *add*; the only selectors shared with the original are `.tabbar`, `.tab-btn`, `.tabpanel`, `.modal`, `.section` and `header`, and every one of those overrides sits inside a `@media` block (≤900px, ≤820px, ≤480px, or print). No palette token, font family or desktop rule was redefined. The tab bar becomes a swipeable single row below 900px so ten tabs don't consume half a phone screen.

### Verification

`build/test.js` runs the app in jsdom and asserts **128 checks**: all original filters, search, modal and tracker behaviour; every tab rendering in both languages; planner age/diet/allergy logic; recipe filtering and modal completeness; timeline and sub-panel rendering; localStorage round-trips; keyboard/ARIA attributes on interactive cards; https + `rel=noopener` on outbound links; backup export/restore round-trips across simulated devices; rejection of malformed backup files; and zero runtime errors. All pass.

---

## 2. File structure for future modularization

The single file is at the point where splitting pays off. Suggested layout, mirroring the current module boundaries so the split is mechanical:

```
prothom-khabar/
├── index.html                   # shell: header, tab bar, empty tab panels
├── css/
│   ├── tokens.css               # :root palette, typography, resets
│   ├── layout.css               # header, tabbar, hero, section, footer
│   ├── components.css           # .v-card .v-grid .v-btn .chip .acc .timeline
│   └── modules/…                # planner.css, firstaid.css, shopping.css
├── js/
│   ├── util.js                  # t/tt/esc/load/save/num/accordion/empty
│   ├── state.js                 # state, LANG_HOOKS, setLang, setTab
│   └── modules/
│       ├── foods.js  planner.js  recipes.js  guides.js
│       ├── firstaid.js  milestones.js  shopping.js  blwpro.js
└── data/
    ├── foods.json     meals.json      recipes.json
    ├── portions.json  textures.json   milk.json
    └── gear.json      retailers.json  blw-topics.json
```

Notes:

- **Split data before code.** The content is ~70% of the file and changes far more often than the logic. Moving the arrays to JSON lets a non-developer edit recipes and prices, and lets you lazy-load per tab.
- Keep each `{bn, en}` pair in one JSON record rather than parallel `foods.bn.json` / `foods.en.json` files — it prevents the two languages drifting apart, which is the usual failure mode.
- Convert the IIFEs to ES modules (`export const Planner = …`) and load with `<script type="module">`. The public APIs are already narrow, so this is close to a rename.
- Replace inline `onclick` with delegated listeners (`data-action="planner:generate"`) — needed anyway once modules stop being globals.
- If you add a bundler, Vite is the lightest fit; a single `vite build` returns you to one deployable file if you prefer.

---

## 3. Performance optimizations

Current state is already good: one request, no framework, 115 KB gzipped, tabs render lazily on first open.

**Quick wins**

1. **Self-host the fonts.** The Google Fonts request is the only network dependency and blocks first paint. Subset Hind Siliguri and Baloo Da 2 to the Bengali + Latin ranges (`pyftsubset --unicodes=U+0980-09FF,U+0000-00FF`), serve as WOFF2, and add `font-display: swap`. Typically 60–70% smaller and removes a third-party round trip — significant on Bangladeshi mobile networks.
2. **Add a service worker** for full offline use. This app's value is highest at the highchair, often without connectivity. Cache-first on the HTML and fonts is roughly 20 lines.
3. **Ship a `manifest.json`** so it installs to the home screen as a PWA. With the service worker, this is the single highest-impact change for real users.
4. **Move data to JSON and `fetch()` per tab.** Cuts the initial parse from ~265 KB of JS to ~40 KB; each tab then pulls only its own data.
5. **Debounce the search input** (150 ms). It currently re-renders 100 cards on every keystroke — imperceptible on desktop, noticeable on a low-end Android.
6. **Batch DOM writes in `render()`.** Build into a `DocumentFragment` and append once rather than 100 individual `appendChild` calls.
7. **`content-visibility: auto`** on `.food-card`, `.recipe-card` and `.gear-card` lets the browser skip layout for off-screen cards — a one-line CSS change worth several frames on long grids.
8. **Compress and lazy-load product images** when you replace the emoji placeholders: WebP, explicit `width`/`height` to prevent layout shift, `loading="lazy"`.
9. **`aria-live="polite"`** on `#planner-output` and `#grid` so screen readers announce updates after a filter or plan regeneration.

**Measure before optimizing further.** Run Lighthouse on a throttled 3G profile; the font request will almost certainly dominate everything else on the list.

---

## 4. Roadmap to v2.0

**Phase 1 — foundation (highest value per unit of effort)**
- ~~Offline PWA: service worker, manifest, install prompt.~~ **Done** — ship `sw.js` + `manifest.json` alongside `index.html`.
- ~~Backup and restore so data survives a lost phone.~~ **Done** — see the Backup module.
- Modularize per section 2 and move content to JSON so a nutritionist can review and edit it without touching code.
- Multi-child profiles: switch between siblings, each with its own age, milestones and tracker.

**Phase 2 — health tracking**
- **Growth charts.** Plot weight, length and head circumference against WHO growth standards with z-score bands. Highest-demand feature and a natural companion to the milestone tracker, which already stores achievement dates.
- **Vaccination tracker** aligned to the Bangladesh EPI schedule, with due-date reminders.
- **Allergen introduction log**: which of the major allergens have been introduced, when, and with what reaction — building on the existing tracker's issue flag.
- Export to PDF so a caregiver can hand a summary to their pediatrician.

**Phase 3 — engagement**
- **Reminders and notifications**: meal times, water, "you haven't offered iron-rich food in 3 days".
- **Cloud sync** (Firebase Firestore or Supabase) so both parents and a grandparent see the same log. Design for offline-first with local writes reconciled on reconnect — connectivity is intermittent. The seam is already isolated: `Backup.KEYS` enumerates every stored key, and `loadTracker()` / `saveTracker()` are the only functions touching storage.
- Photo journal attached to milestones and first-taste entries.
- Weekly summary: variety score, iron-rich meals served, new foods introduced.

**Phase 4 — intelligence and clinical**
- **AI feeding assistant**: natural-language questions ("can I give my 7-month-old ilish?") answered strictly from the app's own vetted content, with citations, refusing anything outside scope and routing medical questions to a doctor. Ground it in the existing database rather than a general model — accuracy matters more than fluency in pediatric nutrition.
- Photo-based portion estimation and choking-risk checks on prepared food.
- **Pediatrician portal**: a shareable read-only link to the growth, milestone and feeding log, so a clinician arrives at the appointment already informed.
- Regional and dialect variants (Chittagonian, Sylheti), plus adaptation for other South Asian cuisines.

**Ongoing**
- Annual clinical review of all content against current WHO, UNICEF, AAP and NHS guidance, with a visible "last reviewed" date.
- Add a named reviewing pediatrician or nutritionist to the footer. For a health app aimed at infant feeding, credibility is a feature.

---

## Build and test

```bash
cd build
python3 splice.py     # rebuild index.html from base.html + parts
node test.js          # 128 assertions in jsdom
```

`splice.py` assembles the JS in the order `[1,2,3,4,5,7,6]` — the bootstrap
(part 6) must come last because it references every other module.

`build/base.html` is the untouched original. `splice.py` applies 10 exact-anchor edits and fails loudly if any anchor is missing or ambiguous, so an accidental change to the original is caught immediately rather than silently mis-applied.

---

*All content is educational and based on general WHO, UNICEF, AAP and NHS complementary feeding guidance. It does not replace a pediatrician, a dietitian or emergency services.*
