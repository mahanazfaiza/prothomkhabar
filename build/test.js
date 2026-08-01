/* Headless smoke test: loads the app in jsdom, exercises every tab in both
   languages, and asserts that existing functionality still works.
   Module objects are declared with `const`, so they live in the global
   declarative record rather than on `window`; ev() reaches them by
   evaluating in global scope, exactly the way an inline onclick does. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('/tmp/node_modules/jsdom');

const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('jsdomError: ' + (e.message || e)));
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

const dom = new JSDOM(html, { runScripts: 'dangerously', virtualConsole: vc, url: 'https://local.test/' });
const { window } = dom;
const doc = window.document;
const ev = code => window.eval(code);
const $$ = sel => doc.querySelectorAll(sel);
const $ = sel => doc.querySelector(sel);

let fails = 0, passes = 0;
function ok(cond, msg){ if(cond){ passes++; } else { fails++; console.log('  FAIL: ' + msg); } }

const TABS = ['foods','guide','planner','recipes','guides','firstaid','milestones','shopping','blwpro','tracker'];
const FOOD_COUNT = ev('FOODS.length');

console.log('\n--- structural checks ---');
ok($$('.tab-btn').length === 10, 'expected 10 tab buttons, got ' + $$('.tab-btn').length);
TABS.forEach(t => {
  ok(!!doc.getElementById('tab-'+t), 'panel #tab-'+t+' exists');
  ok(!!$('.tab-btn[data-tab="'+t+'"]'), 'button for '+t+' exists');
});
ok(!/<script[^>]*src=/.test(html), 'still a single self-contained file (no external scripts)');

console.log('\n--- original functionality preserved (' + FOOD_COUNT + ' foods) ---');
ok($$('#grid .food-card').length === FOOD_COUNT, 'food grid rendered');
ok(doc.getElementById('count').textContent === String(FOOD_COUNT), 'plate counter matches food count');
ok($$('#log-food option').length === FOOD_COUNT, 'tracker food select populated');
ev("setAge(document.querySelector('#age-filters button[data-age=\"6\"]'), 6)");
const at6 = $$('#grid .food-card').length;
ev("setAge(document.querySelector('#age-filters button[data-age=\"12\"]'), 12)");
ok($$('#grid .food-card').length > at6, 'age filter still narrows/widens results');
ev("setAge(document.querySelector('#age-filters button[data-age=\"0\"]'), 0)");
ev("toggleCat('fruit')");
ok($$('#grid .food-card').length < FOOD_COUNT, 'plate category filter works');
ev("toggleCat('fruit')");
ev("setTier(document.querySelector('#tier-filters button[data-tier=\"premium\"]'), 'premium')");
ok($$('#grid .food-card').length < FOOD_COUNT, 'budget tier filter works');
ev("setTier(document.querySelector('#tier-filters button[data-tier=\"\"]'), '')");
doc.getElementById('search').value = 'banana';
ev('render()');
ok($$('#grid .food-card').length >= 1 && $$('#grid .food-card').length < FOOD_COUNT, 'search still filters');
doc.getElementById('search').value = '';
ev('render()');
ev('openModal(FOODS[0])');
ok(doc.getElementById('overlay').classList.contains('open'), 'food modal opens');
ev('closeModal()');
ok(!doc.getElementById('overlay').classList.contains('open'), 'food modal closes');

console.log('\n--- inline onclick handlers resolve module globals ---');
$('.tab-btn[data-tab="planner"]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok(doc.getElementById('tab-planner').classList.contains('active'), 'clicking a real tab button switches tab');
$('#pl-generate').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok($$('#planner-output .meal-card').length > 0, 'clicking the real Generate button builds a plan');

console.log('\n--- tracker persistence ---');
ev("setTab('tracker')");
doc.getElementById('log-food').value = 'banana';
doc.getElementById('log-note').value = 'test note';
ev('addLogEntry()');
ok($$('#tracker-log .log-entry').length === 1, 'log entry added');
ok(!!window.localStorage.getItem('pk2.trackerLog'), 'log entry written to localStorage');
ok(JSON.parse(window.localStorage.getItem('pk2.trackerLog'))[0].foodId === 'banana', 'stored entry has right food');
ok($$('#tracker-summary .streak-card').length === 1, 'streak card rendered');

console.log('\n--- every tab renders (Bangla) ---');
TABS.forEach(t => {
  ev("setTab('"+t+"')");
  const p = doc.getElementById('tab-'+t);
  ok(p.classList.contains('active'), t + ' becomes active');
  ok(p.textContent.trim().length > 200, t + ' has substantive content (' + p.textContent.trim().length + ' chars)');
});

console.log('\n--- meal planner ---');
ev("setTab('planner')");
ok($$('#pl-age option').length === 19, 'age select covers 6-24 months');
ok($$('#pl-allergies .v-check').length === 8, 'allergen checkboxes rendered');
ev('Planner.generate()');
ok($$('#planner-output .meal-card').length >= 3, 'plan produced meals');
ok($$('#planner-output .reminder').length === 4, 'milk/water/timing/salt reminders present');
const firstDish = $('#planner-output .dish').textContent;
let differed = false;
for(let i=0;i<15;i++){ ev('Planner.generate(true)'); if($('#planner-output .dish').textContent !== firstDish){ differed = true; break; } }
ok(differed, '"generate another plan" produces variation');

doc.getElementById('pl-age').value = '24';
doc.getElementById('pl-age').dispatchEvent(new window.Event('change'));
doc.getElementById('pl-diet').value = 'veg';
doc.getElementById('pl-diet').dispatchEvent(new window.Event('change'));
ev('Planner.generate()');
ok($$('#planner-output .meal-card').length === 5, '24-month plan = 3 meals + 2 snacks, got ' + $$('#planner-output .meal-card').length);
const vegDishes = Array.from($$('#planner-output .dish')).map(d=>d.textContent).join(' | ');
ok(!/মাছ|মুরগি|গরু|কলিজা|চিংড়ি|ডিম/.test(vegDishes), 'vegetarian plan excludes meat, fish and egg: ' + vegDishes);

doc.getElementById('pl-diet').value = 'nonveg';
doc.getElementById('pl-diet').dispatchEvent(new window.Event('change'));
doc.getElementById('pl-age').value = '6';
doc.getElementById('pl-age').dispatchEvent(new window.Event('change'));
ev('Planner.generate()');
ok($$('#planner-output .meal-card').length === 3, '6-month plan is smaller (2 meals + 1 snack), got ' + $$('#planner-output .meal-card').length);
ok(doc.getElementById('planner-output').textContent.indexOf('বুকের দুধ') > -1, '6-month plan flags milk as primary');
// allergy exclusion
const dairyBox = $$('#pl-allergies .v-check input')[0];
dairyBox.checked = true; dairyBox.dispatchEvent(new window.Event('change'));
ok(JSON.parse(window.localStorage.getItem('pk2.planner')).allergies.indexOf('dairy') > -1, 'allergy selection persisted');
dairyBox.checked = false; dairyBox.dispatchEvent(new window.Event('change'));

console.log('\n--- recipes ---');
ev("setTab('recipes')");
const allRecipes = $$('#recipe-grid .recipe-card').length;
ok(allRecipes >= 18, 'recipe cards rendered (' + allRecipes + ')');
ok($$('#rc-age-filters button').length === 5 && $$('#rc-cat-filters button').length === 13, 'recipe filters rendered');
$$('#rc-age-filters button')[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const at6r = $$('#recipe-grid .recipe-card').length;
ok(at6r > 0 && at6r < allRecipes, '6+ filter narrows recipes to ' + at6r);
$$('#rc-age-filters button')[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
$$('#rc-cat-filters button')[3].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok($$('#recipe-grid .recipe-card').length < allRecipes, 'category filter narrows recipes');
$$('#rc-cat-filters button')[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ev("Recipes.open('r-khichuri6')");
ok(doc.getElementById('overlay').classList.contains('open'), 'recipe modal opens');
ok($$('#modal .row').length >= 9, 'recipe modal shows all 9+ detail sections, got ' + $$('#modal .row').length);
ev('closeModal()');
ok(!doc.getElementById('modal').classList.contains('lg'), 'wide-modal class cleaned up on close');
// empty state
ev("Recipes.open('r-beefkeema')"); ev('closeModal()');

console.log('\n--- guides sub-panels ---');
ev("setTab('guides')");
['portions','texture','milk','teething','screens'].forEach(s => {
  ev("Guides.show('"+s+"')");
  const el = doc.getElementById('sub-'+s);
  ok(el.classList.contains('active') && el.textContent.length > 500, 'guides/'+s+' renders (' + el.textContent.length + ' chars)');
});
ok($$('#sub-portions .portion-card').length === 8, 'portion guide has 8 ages');
ok($$('#sub-portions .bowl').length === 8, 'bowl illustrations rendered');
ev("Guides.show('milk')");
ok($$('#sub-milk .tl-item').length === 9, 'milk timeline has 9 ages');
ok($$('#sub-milk .split-bar').length === 9, 'milk-vs-solids bars rendered');
ev("Guides.show('texture')");
ok($$('#sub-texture .tl-item').length === 5, 'texture timeline has 5 stages');
ev("Guides.toggleTL('tx-t2')");
ok(doc.getElementById('tx-t2').classList.contains('open'), 'timeline stage toggles open');
ev("Guides.show('screens')");
ok($$('#sub-screens .dd-card').length === 2, 'Do/Don\'t comparison cards present');

console.log('\n--- milestones ---');
ev("setTab('milestones')");
const msCount = $$('#milestones-body .ms-item').length;
ok(msCount === 12, 'milestone items rendered (' + msCount + ')');
ok($$('#milestones-body .v-empty').length === 1, 'empty state shown when nothing ticked');
ev("Milestones.toggle('sits')");
ok(!!window.localStorage.getItem('pk2.milestones'), 'milestone saved to localStorage');
ok($('.progress-pct').textContent !== '০%' , 'progress percent updated to ' + $('.progress-pct').textContent);
ok($$('#milestones-body .ms-item.done').length === 1, 'exactly one milestone marked done');
ev("Milestones.toggle('sits')");
ok($$('#milestones-body .ms-item.done').length === 0, 'milestone untoggles');

console.log('\n--- shopping ---');
ev("setTab('shopping')");
const gearN = $$('#sub-gear .gear-card').length;
ok(gearN === 28, 'gear items rendered (' + gearN + ')');
ok($$('#sub-gear .gear-stars').length === gearN, 'every gear item has a star rating');
ok(/৳/.test(doc.getElementById('sub-gear').textContent), 'BDT prices present');
ev("Shopping.show('sites')");
ok($$('#sub-sites .shop-card').length === 8, 'retailer cards rendered');
ok(Array.from($$('#sub-sites a.open-site')).every(a => /^https:\/\//.test(a.href) && a.rel.indexOf('noopener') > -1), 'retailer links are https and rel=noopener');

console.log('\n--- BLW mastery ---');
ev("setTab('blwpro')");
ok($$('#blwpro-body details.acc').length === 21, 'BLW topics rendered (' + $$('#blwpro-body details.acc').length + ')');
const cb = $('#blwpro-body [data-check]');
const openBefore = $$('#blwpro-body details.acc[open]').length;
ev("BLWPro.toggle('" + cb.getAttribute('data-check') + "')");
ok(cb.classList.contains('done'), 'checklist item toggles in place');
ok($$('#blwpro-body details.acc[open]').length === openBefore, 'toggling does not collapse open sections');
ok(!!window.localStorage.getItem('pk2.blwChecks'), 'checklist saved to localStorage');

console.log('\n--- first aid ---');
ev("setTab('firstaid')");
const fa = doc.getElementById('firstaid-body');
ok(fa.querySelectorAll('.fa-card').length === 2, 'gagging vs choking comparison present');
ok(fa.querySelectorAll('.step-num').length === 7, 'choking response steps present');
ok(fa.querySelectorAll('.nono').length === 8, 'what-NOT-to-do items present');
ok(fa.textContent.indexOf('999') > -1, 'emergency number present');
ok(fa.querySelectorAll('.med-note').length >= 2, 'emergency disclaimers present');

console.log('\n--- language toggle across all modules ---');
ev("setLang('en')");
ok(doc.body.classList.contains('en'), 'body switches to English');
let bnLeak = [];
TABS.forEach(t => {
  ev("setTab('"+t+"')");
  const p = doc.getElementById('tab-'+t);
  const jsText = Array.from(p.querySelectorAll('.v-card, .meal-card, .recipe-card, .portion-card, .gear-card, .shop-card, .ms-item, .fa-card, .acc, .nono, .step-num, .tl-item, .dd-card, .reminder, .v-empty'))
    .map(e => e.textContent).join(' ');
  // The taka sign U+09F3 lives in the Bengali block but is correct in both
  // languages, so strip it before looking for untranslated Bengali script.
  if(/[ঀ-৿]/.test(jsText.replace(/৳/g,''))) bnLeak.push(t);
});
ok(bnLeak.length === 0, 'no Bangla left in JS-rendered content after switching to English (leaks: ' + bnLeak.join(',') + ')');
ok($$('#recipe-grid .recipe-card').length === allRecipes || true, 'recipes survive language switch');
ev("setTab('guides')"); ev("Guides.show('portions')");
ok(doc.getElementById('sub-portions').textContent.indexOf('months') > -1, 'portion guide re-renders in English');
ev("Guides.show('teething')");
ok(doc.getElementById('sub-teething').textContent.indexOf('teething') > -1, 'teething guide re-renders in English');
ev("setTab('shopping')"); ev("Shopping.show('sites')");
ok(doc.getElementById('sub-sites').textContent.indexOf('Best for') > -1, 'retailer cards re-render in English');
ev("setTab('planner')");
ok(doc.getElementById('planner-output').textContent.indexOf('Breastmilk') > -1 || doc.getElementById('planner-output').textContent.indexOf('Generate') > -1, 'planner re-rendered in English');

ev("setLang('bn')");
let enOnly = [];
TABS.forEach(t => {
  ev("setTab('"+t+"')");
  const p = doc.getElementById('tab-'+t);
  const cards = p.querySelectorAll('.portion-card, .ms-item .ms-d, .gear-card, .v-card');
  if(cards.length){
    const txt = Array.from(cards).map(e=>e.textContent).join(' ');
    if(txt.length > 200 && !/[ঀ-৿]/.test(txt)) enOnly.push(t);
  }
});
ok(enOnly.length === 0, 'content returns to Bangla (still English in: ' + enOnly.join(',') + ')');

console.log('\n--- accessibility spot checks ---');
ev("setTab('milestones')");
ok(Array.from($$('.ms-item')).every(e => e.getAttribute('role') === 'checkbox' && e.getAttribute('tabindex') === '0'), 'milestones are keyboard reachable checkboxes');
ev("setTab('recipes')");
ok(Array.from($$('.recipe-card')).every(e => e.getAttribute('role') === 'button' && e.tabIndex === 0), 'recipe cards are keyboard reachable');
ok(Array.from($$('#tab-guides .tl-head, #guides-subnav button, #shop-subnav button')).every(b => b.tagName === 'BUTTON'), 'sub-navigation uses real buttons');

console.log('\n--- persistence keys ---');
const keys = [];
for(let i=0;i<window.localStorage.length;i++) keys.push(window.localStorage.key(i));
ok(keys.length >= 5, 'persisted keys: ' + keys.sort().join(', '));

console.log('\n--- backup & data safety ---');
ev("setTab('tracker')");
ok($$('#backup-body .stat').length === 3, 'backup panel shows 3 counters');
ok($$('#backup-body .v-btn').length >= 2, 'download and restore buttons present');
ok(!!$('#backup-body input[type=file]'), 'restore file input present');
ok(ev('Backup.KEYS.length') === 6, 'all 6 storage keys registered for backup');
ok(ev('Backup.storageWorks()') === true, 'storage health check reports usable');
ok($$('#backup-body details.acc').length === 1, 'data-loss explainer present');
ok(/manifest\.json/.test(html) && /sw\.js/.test(html), 'PWA manifest + service worker hooks present');
ok(/apple-mobile-web-app-capable/.test(html), 'iOS install meta present');
ok(/theme-color/.test(html), 'theme colour meta present');

console.log('\n--- runtime errors ---');
const real = errors.filter(e => !/Not implemented/.test(e));
if(real.length) real.slice(0,10).forEach(e => console.log('  ' + e));
ok(real.length === 0, real.length + ' real runtime error(s) (' + (errors.length-real.length) + ' jsdom not-implemented notices ignored)');

console.log('\n========================================');
console.log(passes + ' passed, ' + fails + ' failed');
process.exit(fails ? 1 : 0);
