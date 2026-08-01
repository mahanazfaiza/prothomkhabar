
/* =====================================================================
   ==  v2 EXTENSION  ===================================================
   Everything below is additive. No function defined above is replaced;
   the only touch-points are LANG_HOOKS (called from setLang) and the
   localStorage upgrade of the tracker, both marked in the original code.

   Module layout (each is a self-contained IIFE returning a tiny public
   API, so nothing leaks into the global scope except the module name):

     Util      shared helpers: bilingual text, storage, DOM building
     Planner   1. personalized meal planner
     Recipes   2. Bangladeshi recipe library
     Guides    3/4/9/11/12. portions, texture, milk, teething, screens
     FirstAid  5. choking vs gagging
     Milestones 6. feeding milestone tracker
     Shopping  7/8. gear guide + retailer directory
     BLWPro    10. BLW mastery guide with checklists
   ===================================================================== */

/* ---------------------------------------------------------------------
   UTIL — shared primitives used by every module
   --------------------------------------------------------------------- */
const Util = (function(){

  /* Pick the right half of a bilingual pair. Every piece of new content is
     stored as {bn:'…', en:'…'} so a single call handles the whole app. */
  function t(pair){
    if(pair === null || pair === undefined) return '';
    if(typeof pair === 'string') return pair;
    return (state.lang === 'bn' ? pair.bn : pair.en) || pair.en || pair.bn || '';
  }

  /* Bilingual pair from two loose arguments — shorthand for inline strings. */
  function tt(bn, en){ return state.lang === 'bn' ? bn : en; }

  /* Escape user-controlled strings before injecting into innerHTML.
     All catalogue content is authored here, but notes typed by a caregiver
     are not, so anything user-sourced goes through this. */
  function esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  /* Namespaced localStorage wrapper. Wrapped in try/catch because private
     browsing modes and file:// contexts can throw on access. */
  const PREFIX = 'pk2.';
  function load(key, fallback){
    try{
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    }catch(e){ return fallback; }
  }
  function save(key, value){
    try{ localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
    catch(e){ return false; }
  }

  /* Bangla numerals — used for age badges and counts so numbers match the
     surrounding script when the app is in Bangla. */
  const BN_DIGITS = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  function num(n){
    if(state.lang !== 'bn') return String(n);
    return String(n).replace(/[0-9]/g, d => BN_DIGITS[+d]);
  }

  /* Deterministic-ish shuffle helper so "generate another plan" varies. */
  function pick(arr, seedShift){
    if(!arr || !arr.length) return null;
    const i = Math.floor(Math.random() * arr.length + (seedShift||0)) % arr.length;
    return arr[i];
  }
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  /* Star rating markup for the shopping guide (filled + dimmed). */
  function stars(n){
    return '<span class="gear-stars">' + '★'.repeat(n) +
           '<span class="dim">' + '★'.repeat(5-n) + '</span></span>';
  }

  /* Reusable collapsible section. */
  function accordion(titleHtml, bodyHtml, open){
    return `<details class="acc"${open ? ' open' : ''}>
      <summary>${titleHtml}</summary>
      <div class="acc-body">${bodyHtml}</div>
    </details>`;
  }

  /* Reusable empty state. */
  function empty(icon, title, msg){
    return `<div class="v-empty pop-in">
      <span class="ee-icon">${icon}</span>
      <div class="ee-title">${title}</div>
      <p>${msg}</p>
    </div>`;
  }

  /* Bulleted list from an array of bilingual pairs. */
  function list(items, cls){
    return `<ul class="${cls||'plain'}">` +
      items.map(i => `<li>${t(i)}</li>`).join('') + '</ul>';
  }

  /* Look up a food from the existing FOODS database by id. Modules reuse the
     original catalogue rather than duplicating food data. */
  function food(id){ return FOODS.find(f => f.id === id) || null; }
  function foodName(id){
    const f = food(id);
    return f ? (state.lang==='bn' ? f.name_bn : f.name_en) : id;
  }
  function foodIcon(id){ const f = food(id); return f ? f.icon : '🍽'; }

  return { t, tt, esc, load, save, num, pick, shuffle, stars, accordion, empty, list, food, foodName, foodIcon };
})();

/* Modules register a re-render callback here; setLang() runs them all so
   JS-generated content follows the Bangla/English toggle exactly like the
   markup-based [lang-bn]/[lang-en] spans do. */
const LANG_HOOKS = [];


/* =====================================================================
   MODULE 1 — PERSONALIZED MEAL PLANNER
   Plan structure follows WHO/UNICEF complementary feeding guidance:
     6-8 months   2-3 meals/day + 1 optional snack
     9-11 months  3-4 meals/day + 1-2 snacks
     12-23 months 3-4 meals/day + 1-2 snacks, family foods
   Milk remains the primary source of nutrition until about 12 months.
   ===================================================================== */
const Planner = (function(){

  /* ---- Age band reference table (meals, snacks, milk, water) ---- */
  const BANDS = [
    { max:8,  meals:2, snacks:1, id:'6-8',
      milk:{bn:'দিনে ৬-৮ বার বুকের দুধ, অথবা ~৭০০-৯০০ মি.লি. ফর্মুলা',
            en:'6-8 breastfeeds a day, or roughly 700-900 ml formula'},
      water:{bn:'খাবারের সাথে খোলা কাপে ২-৪ চুমুক (দিনে ~৬০ মি.লি. পর্যন্ত)',
             en:'2-4 sips from an open cup with meals (up to about 60 ml a day)'} },
    { max:11, meals:3, snacks:1, id:'9-11',
      milk:{bn:'দিনে ৫-৬ বার বুকের দুধ, অথবা ~৬০০-৮০০ মি.লি. ফর্মুলা',
            en:'5-6 breastfeeds a day, or roughly 600-800 ml formula'},
      water:{bn:'প্রতি বেলার সাথে খোলা কাপে পানি (দিনে ~১২০ মি.লি. পর্যন্ত)',
             en:'Water in an open cup with every meal (up to about 120 ml a day)'} },
    { max:17, meals:3, snacks:2, id:'12-17',
      milk:{bn:'দিনে ৩-৪ বার বুকের দুধ, অথবা ~৩৫০-৫০০ মি.লি. পূর্ণ ননিযুক্ত দুধ',
            en:'3-4 breastfeeds a day, or about 350-500 ml whole milk'},
      water:{bn:'দিনে ~৪-৬ কাপ (প্রায় ১০০০ মি.লি. পর্যন্ত) — খাবারের সাথে ও মাঝে',
             en:'About 4-6 cups a day (up to roughly 1000 ml), with and between meals'} },
    { max:24, meals:3, snacks:2, id:'18-24',
      milk:{bn:'দিনে ২-৩ বার বুকের দুধ, অথবা ~৩৫০-৫০০ মি.লি. দুধ (অতিরিক্ত দুধ খেলে খাবারে অরুচি হয়)',
            en:'2-3 breastfeeds a day, or about 350-500 ml milk (too much milk suppresses appetite for food)'},
      water:{bn:'দিনে ~৫-৭ কাপ পানি, নিজে কাপ থেকে খেতে উৎসাহ দিন',
             en:'About 5-7 cups of water a day — encourage independent cup drinking'} },
  ];
  function band(age){ return BANDS.find(b => age <= b.max) || BANDS[BANDS.length-1]; }

  /* ---- Allergen groups the caregiver can exclude ---- */
  const ALLERGENS = [
    { id:'dairy',  label:{bn:'দুধ/দুগ্ধজাত', en:'Dairy'} },
    { id:'egg',    label:{bn:'ডিম', en:'Egg'} },
    { id:'fish',   label:{bn:'মাছ', en:'Fish'} },
    { id:'shellfish', label:{bn:'চিংড়ি/শেলফিশ', en:'Shellfish'} },
    { id:'nuts',   label:{bn:'বাদাম', en:'Tree nuts / peanut'} },
    { id:'wheat',  label:{bn:'গম/গ্লুটেন', en:'Wheat / gluten'} },
    { id:'soy',    label:{bn:'সয়া', en:'Soy'} },
    { id:'sesame', label:{bn:'তিল', en:'Sesame'} },
  ];

  /* ---- Meal bank ----------------------------------------------------
     Each entry maps onto foods already in the FOODS database (`uses`) so
     the planner and the food catalogue never disagree. Fields:
       slot      breakfast | amsnack | lunch | pmsnack | dinner
       minAge    earliest age in months
       veg       suitable for a vegetarian plan
       tiers     budget tiers this dish fits
       methods   blw | trad | mixed  (which feeding styles it suits)
       allerg    allergen group ids present
       texture / portion / recipe / prep / benefit  bilingual detail
  ------------------------------------------------------------------- */
  const MEALS = [
    /* ---------- BREAKFAST ---------- */
    { id:'b-ricecereal', slot:'breakfast', minAge:6, veg:true, tiers:['budget','mid','premium'], methods:['trad','mixed'], allerg:[], uses:['ricecereal','banana'],
      name:{bn:'চালের গুঁড়ার জাউ ও কলা', en:'Rice-flour porridge with banana'}, icon:'🥣',
      recipe:{bn:'২ টেবিল চামচ চালের গুঁড়া + ১ কাপ পানি/বুকের দুধ + ২ চা চামচ চটকানো পাকা কলা।', en:'2 tbsp rice flour + 1 cup water or breastmilk + 2 tsp mashed ripe banana.'},
      prep:{bn:'চালের গুঁড়া ঠান্ডা পানিতে গুলে নিয়ে অল্প আঁচে ৭-৮ মিনিট নাড়তে নাড়তে রান্না করুন। নামিয়ে হালকা গরম হলে কলা মিশিয়ে দিন।', en:'Whisk the flour into cold water, cook on low heat for 7-8 minutes while stirring, cool to lukewarm, then stir in the banana.'},
      texture:{bn:'মসৃণ, ঘন তরল — চামচ থেকে ধীরে পড়ে', en:'Smooth, thick pouring consistency'},
      portion:{bn:'২-৪ টেবিল চামচ', en:'2-4 tablespoons'},
      benefit:{bn:'সহজপাচ্য কার্বোহাইড্রেট ও শক্তি; কলা থেকে পটাশিয়াম ও প্রাকৃতিক মিষ্টতা।', en:'Easily digested carbohydrate for energy; potassium and natural sweetness from banana.'} },

    { id:'b-suji', slot:'breakfast', minAge:6, veg:true, tiers:['budget','mid','premium'], methods:['trad','mixed'], allerg:['wheat','dairy'], uses:['suji','milkcooking','ghee'],
      name:{bn:'সুজির হালকা পায়েস', en:'Soft suji porridge'}, icon:'🥣',
      recipe:{bn:'২ টেবিল চামচ সুজি + ১ কাপ দুধ/পানি + ১/৪ চা চামচ ঘি।', en:'2 tbsp semolina + 1 cup milk or water + 1/4 tsp ghee.'},
      prep:{bn:'ঘিয়ে সুজি হালকা ভেজে নিন যতক্ষণ না সুগন্ধ বের হয়, তারপর দুধ/পানি ঢেলে দলা ভাঙতে ভাঙতে ৫ মিনিট রান্না করুন। চিনি বা লবণ দেবেন না।', en:'Toast the suji in ghee until fragrant, add the liquid and cook 5 minutes, whisking out lumps. No sugar or salt.'},
      texture:{bn:'দলামুক্ত, মসৃণ পরিজ', en:'Lump-free smooth porridge'},
      portion:{bn:'৩-৫ টেবিল চামচ', en:'3-5 tablespoons'},
      benefit:{bn:'শক্তিঘন; ঘি থেকে অতিরিক্ত ক্যালরি যা ছোট পেটে বেশি পুষ্টি পৌঁছায়।', en:'Energy dense; ghee adds calories that pack more nutrition into a small stomach.'} },

    { id:'b-eggstrip', slot:'breakfast', minAge:6, veg:false, tiers:['budget','mid','premium'], methods:['blw','mixed'], allerg:['egg'], uses:['egg','eggyolk'],
      name:{bn:'ডিমের অমলেট স্ট্রিপ', en:'Omelette finger strips'}, icon:'🍳',
      recipe:{bn:'১টি ডিম + ১ চা চামচ দুধ/পানি + সামান্য তেল (লবণ ছাড়া)।', en:'1 egg + 1 tsp milk or water + a little oil, no salt.'},
      prep:{bn:'ফেটানো ডিম ছড়িয়ে পাতলা অমলেট বানিয়ে সম্পূর্ণ সেদ্ধ হলে আঙুলের সমান লম্বা স্ট্রিপ করে কেটে দিন।', en:'Cook a thin, fully-set omelette and cut into finger-length strips baby can grip.'},
      texture:{bn:'নরম কিন্তু ধরে রাখা যায় এমন স্ট্রিপ', en:'Soft but graspable strips'},
      portion:{bn:'১/২ থেকে ১টি ডিম', en:'Half to one egg'},
      benefit:{bn:'সম্পূর্ণ প্রোটিন, কোলিন ও আয়রন — মস্তিষ্কের বিকাশে সহায়ক।', en:'Complete protein, choline and iron — supports brain development.'} },

    { id:'b-chira', slot:'breakfast', minAge:8, veg:true, tiers:['budget','mid'], methods:['trad','mixed'], allerg:['dairy'], uses:['chira','banana','milkcooking'],
      name:{bn:'ভেজানো চিড়া ও কলা', en:'Soaked chira with banana'}, icon:'🌾',
      recipe:{bn:'৩ টেবিল চামচ চিড়া + ১/৪ কাপ দুধ/পানি + ১/২টি পাকা কলা।', en:'3 tbsp flattened rice + 1/4 cup milk or water + half a ripe banana.'},
      prep:{bn:'চিড়া ধুয়ে ১০ মিনিট ভিজিয়ে নরম করুন, চটকে কলা মিশিয়ে দিন। শুকনো চিড়া কখনো দেবেন না।', en:'Rinse and soak the chira for 10 minutes until soft, mash and fold in the banana. Never serve it dry.'},
      texture:{bn:'নরম, হালকা দানাদার চটকানো', en:'Soft, lightly textured mash'},
      portion:{bn:'৩-৫ টেবিল চামচ', en:'3-5 tablespoons'},
      benefit:{bn:'দ্রুত শক্তি ও কিছুটা আয়রন; দেশি, সস্তা ও সহজলভ্য।', en:'Quick energy plus some iron; local, cheap and always available.'} },

    { id:'b-oats', slot:'breakfast', minAge:6, veg:true, tiers:['mid','premium'], methods:['trad','mixed'], allerg:['dairy'], uses:['oats','apple'],
      name:{bn:'ওটস ও আপেলের পরিজ', en:'Oat and apple porridge'}, icon:'🥣',
      recipe:{bn:'২ টেবিল চামচ ওটস + ১ কাপ পানি/দুধ + ১/৪ কাপ গ্রেট করা আপেল।', en:'2 tbsp oats + 1 cup water or milk + 1/4 cup grated apple.'},
      prep:{bn:'ওটস ও আপেল একসাথে ৮-১০ মিনিট সেদ্ধ করে মিহি করে চটকে দিন।', en:'Simmer the oats and apple together 8-10 minutes, then mash smooth.'},
      texture:{bn:'ঘন, মসৃণ পরিজ', en:'Thick, smooth porridge'},
      portion:{bn:'৩-৫ টেবিল চামচ', en:'3-5 tablespoons'},
      benefit:{bn:'দ্রবণীয় ফাইবার হজমে সাহায্য করে; ধীরে মুক্ত হওয়া শক্তি।', en:'Soluble fibre supports digestion; slow-release energy.'} },

    { id:'b-ruti', slot:'breakfast', minAge:9, veg:true, tiers:['budget','mid'], methods:['blw','mixed'], allerg:['wheat'], uses:['ruti','ghee'],
      name:{bn:'নরম আটার রুটি রোল', en:'Soft ruti rolls'}, icon:'🫓',
      recipe:{bn:'১টি পাতলা আটার রুটি + সামান্য ঘি বা মসৃণ ডাল।', en:'1 thin wheat flatbread + a little ghee or smooth dal.'},
      prep:{bn:'গরম রুটিতে সামান্য ঘি মাখিয়ে রোল করে আঙুলের সমান টুকরা করুন — শুকনো/শক্ত রুটি নয়।', en:'Brush warm ruti with ghee, roll it up and cut into finger-sized pieces. Never dry or stiff ruti.'},
      texture:{bn:'নরম, ভাঁজ করা যায় এমন', en:'Soft and foldable'},
      portion:{bn:'১/২ থেকে ১টি রুটি', en:'Half to one ruti'},
      benefit:{bn:'পারিবারিক খাবারে যুক্ত হওয়ার সহজ ধাপ; শক্তি ও কিছু আয়রন।', en:'An easy bridge into family meals; energy plus some iron.'} },

    /* ---------- MORNING SNACK ---------- */
    { id:'s-papaya', slot:'amsnack', minAge:6, veg:true, tiers:['budget','mid','premium'], methods:['blw','trad','mixed'], allerg:[], uses:['papaya'],
      name:{bn:'পাকা পেঁপের টুকরা', en:'Ripe papaya spears'}, icon:'🍈',
      recipe:{bn:'পাকা পেঁপে, খোসা ও বীজ ছাড়া।', en:'Ripe papaya, peeled and deseeded.'},
      prep:{bn:'আঙুলের সমান লম্বা টুকরা করুন; পিচ্ছিল হলে সামান্য সুজিতে গড়িয়ে নিন যাতে ধরতে সুবিধা হয়।', en:'Cut into finger-length spears; roll in a little suji if slippery so baby can grip.'},
      texture:{bn:'নরম, দাঁত ছাড়াই চটকে যায়', en:'Soft enough to squash between gums'},
      portion:{bn:'২-৩ টুকরা', en:'2-3 spears'},
      benefit:{bn:'ভিটামিন এ ও সি, প্রাকৃতিক এনজাইম হজমে সহায়ক।', en:'Vitamin A and C, plus natural enzymes that aid digestion.'} },

    { id:'s-yogurt', slot:'amsnack', minAge:6, veg:true, tiers:['mid','premium'], methods:['trad','mixed'], allerg:['dairy'], uses:['yogurt','banana'],
      name:{bn:'টক দই ও ফল', en:'Plain yogurt with fruit'}, icon:'🥣',
      recipe:{bn:'৩ টেবিল চামচ চিনি ছাড়া টক দই + ১ টেবিল চামচ চটকানো ফল।', en:'3 tbsp unsweetened plain yogurt + 1 tbsp mashed fruit.'},
      prep:{bn:'ঘরে পাতা টক দই ব্যবহার করুন; চিনি বা মধু কখনো নয় (১ বছরের নিচে মধু নিষিদ্ধ)।', en:'Use home-set plain yogurt; never add sugar or honey (honey is unsafe under 12 months).'},
      texture:{bn:'ঘন, মসৃণ', en:'Thick and smooth'},
      portion:{bn:'৩-৪ টেবিল চামচ', en:'3-4 tablespoons'},
      benefit:{bn:'ক্যালসিয়াম, প্রোটিন ও অন্ত্রের জন্য উপকারী ব্যাকটেরিয়া।', en:'Calcium, protein and gut-friendly bacteria.'} },

    { id:'s-sweetpotato', slot:'amsnack', minAge:6, veg:true, tiers:['budget','mid','premium'], methods:['blw','mixed'], allerg:[], uses:['sweetpotato'],
      name:{bn:'মিষ্টি আলুর স্টিক', en:'Steamed sweet potato sticks'}, icon:'🍠',
      recipe:{bn:'১টি ছোট মিষ্টি আলু।', en:'1 small sweet potato.'},
      prep:{bn:'খোসা ছাড়িয়ে আঙুলের সমান স্টিক করে ১২-১৫ মিনিট ভাপে সেদ্ধ করুন — আঙুলের চাপে সহজে ভাঙা উচিত।', en:'Peel, cut into finger sticks and steam 12-15 minutes — it should squash easily between your fingers.'},
      texture:{bn:'নরম কিন্তু আকৃতি ধরে রাখে', en:'Soft but holds its shape'},
      portion:{bn:'২-৩ স্টিক', en:'2-3 sticks'},
      benefit:{bn:'বিটা-ক্যারোটিন (ভিটামিন এ) ও ফাইবারে সমৃদ্ধ।', en:'Rich in beta-carotene (vitamin A) and fibre.'} },

    { id:'s-cucumber', slot:'amsnack', minAge:9, veg:true, tiers:['budget','mid','premium'], methods:['blw','mixed'], allerg:[], uses:['cucumber'],
      name:{bn:'শসার ঠান্ডা স্টিক', en:'Chilled cucumber spears'}, icon:'🥒',
      recipe:{bn:'১/২টি শসা, খোসা ছাড়ানো।', en:'Half a cucumber, peeled.'},
      prep:{bn:'লম্বা স্টিক করে কেটে ফ্রিজে ঠান্ডা করুন — দাঁত ওঠার সময় মাড়ির আরামের জন্য চমৎকার। কখনো গোল চাকতি নয়।', en:'Cut into long spears and chill — excellent for sore teething gums. Never round coins.'},
      texture:{bn:'শক্ত-খাস্তা: শুধু চিবানোর জন্য, গিলে ফেলার মতো টুকরা ভাঙে না', en:'Firm and crunchy: for gnawing, does not break into swallowable chunks'},
      portion:{bn:'১-২ স্টিক (সরাসরি তদারকিতে)', en:'1-2 spears, under direct supervision'},
      benefit:{bn:'পানি সরবরাহ করে ও দাঁত ওঠার ব্যথায় আরাম দেয়।', en:'Hydrating and soothing for teething discomfort.'} },

    /* ---------- LUNCH ---------- */
    { id:'l-khichuri', slot:'lunch', minAge:6, veg:true, tiers:['budget','mid','premium'], methods:['trad','mixed','blw'], allerg:[], uses:['khichuri','rice','moong','pumpkin','ghee'],
      name:{bn:'সবজি খিচুড়ি', en:'Vegetable khichuri'}, icon:'🍛',
      recipe:{bn:'২ টেবিল চামচ চাল + ১ টেবিল চামচ মুগ ডাল + ১/৪ কাপ কুচানো সবজি (কুমড়া/গাজর/আলু) + ১/২ চা চামচ ঘি + সামান্য হলুদ।', en:'2 tbsp rice + 1 tbsp moong dal + 1/4 cup chopped vegetables (pumpkin, carrot, potato) + 1/2 tsp ghee + a pinch of turmeric.'},
      prep:{bn:'সব উপকরণ ৩ কাপ পানিতে ২০-২৫ মিনিট সেদ্ধ করুন যতক্ষণ না সব গলে যায়। লবণ ও মরিচ ছাড়া রান্না করুন, শেষে ঘি মেশান। BLW-এর জন্য ঘন করে রান্না করে ছোট লাড্ডু আকারে গড়ে দিন।', en:'Simmer everything in 3 cups water for 20-25 minutes until fully collapsed. Cook without salt or chilli; stir in ghee at the end. For BLW, cook it thicker and roll into small balls baby can pick up.'},
      texture:{bn:'৬-৮ মাস: মসৃণ চটকানো · ৯+ মাস: হালকা দলাযুক্ত', en:'6-8 months: smooth mash · 9+ months: soft lumpy'},
      portion:{bn:'১/২ কাপ (~৪-৬ টেবিল চামচ)', en:'About half a cup (4-6 tablespoons)'},
      benefit:{bn:'একবাটিতে সম্পূর্ণ খাবার — কার্ব, প্রোটিন, সবজি ও চর্বি একসাথে; ঘি চর্বিতে-দ্রবণীয় ভিটামিন শোষণে সাহায্য করে।', en:'A complete one-bowl meal: carbohydrate, protein, vegetables and fat together; the ghee helps absorb fat-soluble vitamins.'} },

    { id:'l-fishrice', slot:'lunch', minAge:8, veg:false, tiers:['budget','mid'], methods:['trad','mixed'], allerg:['fish'], uses:['fish','rice','potato'],
      name:{bn:'মাছ-ভাত মাখা', en:'Mashed fish and rice'}, icon:'🐟',
      recipe:{bn:'১ টুকরা রুই/তেলাপিয়া + ৩ টেবিল চামচ নরম ভাত + ১টি ছোট সেদ্ধ আলু + সামান্য হলুদ।', en:'1 piece of rui or tilapia + 3 tbsp soft rice + 1 small boiled potato + a pinch of turmeric.'},
      prep:{bn:'মাছ হলুদ দিয়ে সেদ্ধ করে সব কাঁটা দুইবার হাত দিয়ে বেছে ফেলুন। ভাত ও আলুর সাথে মিশিয়ে চটকে দিন। কাঁটা বাছাই সবচেয়ে গুরুত্বপূর্ণ ধাপ।', en:'Poach the fish with turmeric, then check twice by hand for every bone. Mash together with the rice and potato. Bone-checking is the single most important step.'},
      texture:{bn:'মসৃণ, আঁশমুক্ত মাখা', en:'Smooth, fibre-free mash'},
      portion:{bn:'১/২ কাপ', en:'About half a cup'},
      benefit:{bn:'উচ্চমানের প্রোটিন, ওমেগা-৩ ও আয়োডিন — মস্তিষ্ক ও চোখের বিকাশে সহায়ক।', en:'High-quality protein, omega-3 and iodine — supports brain and eye development.'} },

    { id:'l-molakhichuri', slot:'lunch', minAge:9, veg:false, tiers:['budget'], methods:['trad','mixed'], allerg:['fish'], uses:['mola','khichuri','spinach'],
      name:{bn:'মলা মাছের খিচুড়ি', en:'Mola fish khichuri'}, icon:'🐠',
      recipe:{bn:'২ টেবিল চামচ চাল + ১ টেবিল চামচ ডাল + ২-৩টি মলা মাছ + ১ টেবিল চামচ কুচানো শাক।', en:'2 tbsp rice + 1 tbsp dal + 2-3 small mola fish + 1 tbsp chopped leafy greens.'},
      prep:{bn:'মাছ আলাদা সেদ্ধ করে সম্পূর্ণ চটকে নিন (ছোট মাছেও সূক্ষ্ম কাঁটা থাকে), তারপর রান্না করা খিচুড়িতে মিশিয়ে দিন।', en:'Cook the fish separately and mash it completely — even small fish have fine bones — then stir into the cooked khichuri.'},
      texture:{bn:'মসৃণ, সম্পূর্ণ চটকানো', en:'Completely smooth mash'},
      portion:{bn:'১/২ কাপ', en:'About half a cup'},
      benefit:{bn:'বাংলাদেশের সবচেয়ে সাশ্রয়ী আয়রন, ক্যালসিয়াম ও ভিটামিন এ-এর উৎসগুলোর একটি।', en:'One of the cheapest sources of iron, calcium and vitamin A available in Bangladesh.'} },

    { id:'l-chickenrice', slot:'lunch', minAge:8, veg:false, tiers:['mid','premium'], methods:['trad','mixed','blw'], allerg:[], uses:['chicken','rice','carrot'],
      name:{bn:'মুরগি-সবজি ভাত', en:'Chicken and vegetable rice'}, icon:'🍗',
      recipe:{bn:'২ টেবিল চামচ হাড়ছাড়া মুরগির কিমা + ৩ টেবিল চামচ ভাত + ১/৪ কাপ গাজর/মটরশুঁটি।', en:'2 tbsp boneless minced chicken + 3 tbsp rice + 1/4 cup carrot or peas.'},
      prep:{bn:'মুরগি ও সবজি নরম হওয়া পর্যন্ত সেদ্ধ করে ভাতের সাথে মিশিয়ে চটকে দিন। BLW-এর জন্য মুরগির নরম স্ট্রিপ আলাদা দিন।', en:'Simmer chicken and vegetables until tender, mix with rice and mash. For BLW, serve soft chicken strips alongside instead.'},
      texture:{bn:'নরম, মিহি কিমা', en:'Soft, finely minced'},
      portion:{bn:'১/২ কাপ', en:'About half a cup'},
      benefit:{bn:'হিম-আয়রন ও জিংক — রোগ প্রতিরোধ ক্ষমতা ও বৃদ্ধিতে সহায়ক।', en:'Haem iron and zinc — supports immunity and growth.'} },

    { id:'l-liverrice', slot:'lunch', minAge:8, veg:false, tiers:['budget','mid'], methods:['trad','mixed'], allerg:[], uses:['liver','rice','potato'],
      name:{bn:'কলিজা-ভাত মাখা', en:'Liver and rice mash'}, icon:'🍖',
      recipe:{bn:'১ টেবিল চামচ মুরগির কলিজা + ৩ টেবিল চামচ ভাত + ১টি ছোট আলু।', en:'1 tbsp chicken liver + 3 tbsp rice + 1 small potato.'},
      prep:{bn:'কলিজা ভালোভাবে সেদ্ধ করে মিহি করে চটকে ভাত-আলুর সাথে মেশান। সপ্তাহে ১-২ বারের বেশি নয় (ভিটামিন এ বেশি)।', en:'Cook the liver through, mash finely and mix with rice and potato. Limit to 1-2 times a week due to its high vitamin A content.'},
      texture:{bn:'মসৃণ মাখা', en:'Smooth mash'},
      portion:{bn:'১/৩ কাপ', en:'About a third of a cup'},
      benefit:{bn:'অত্যন্ত সহজে শোষিত আয়রন — ৬ মাসের পর আয়রনের ঘাটতি প্রতিরোধে সেরা দেশি খাবারগুলোর একটি।', en:'Exceptionally bioavailable iron — one of the best local foods for preventing the post-6-month iron gap.'} },

    { id:'l-daltofu', slot:'lunch', minAge:6, veg:true, tiers:['mid','premium'], methods:['blw','mixed'], allerg:['soy'], uses:['tofu','lentil','rice'],
      name:{bn:'ডাল-ভাত ও টফু কিউব', en:'Dal-rice with tofu cubes'}, icon:'🧊',
      recipe:{bn:'৩ টেবিল চামচ মসুর ডাল-ভাত + ৪-৫টি নরম টফু কিউব।', en:'3 tbsp dal and rice + 4-5 soft tofu cubes.'},
      prep:{bn:'টফু ১.৫ সে.মি. কিউব করে কেটে সামান্য ভাপিয়ে নিন; পিচ্ছিল হলে সুজিতে গড়িয়ে দিন।', en:'Cut tofu into 1.5 cm cubes and warm through; roll in suji if slippery.'},
      texture:{bn:'নরম কিউব + মসৃণ ডাল', en:'Soft cubes with smooth dal'},
      portion:{bn:'১/২ কাপ', en:'About half a cup'},
      benefit:{bn:'উদ্ভিজ্জ প্রোটিন, ক্যালসিয়াম ও আয়রন — নিরামিষ পরিবারের জন্য চমৎকার।', en:'Plant protein, calcium and iron — excellent for vegetarian families.'} },

    { id:'l-beefkhichuri', slot:'lunch', minAge:10, veg:false, tiers:['mid','premium'], methods:['trad','mixed'], allerg:[], uses:['beef','khichuri'],
      name:{bn:'গরুর মাংসের খিচুড়ি', en:'Beef khichuri'}, icon:'🥩',
      recipe:{bn:'২ টেবিল চামচ মিহি কিমা + খিচুড়ির উপকরণ।', en:'2 tbsp finely minced beef + the khichuri base.'},
      prep:{bn:'কিমা প্রেসার কুকারে সম্পূর্ণ নরম করে সেদ্ধ করুন, তারপর খিচুড়ির সাথে মিশিয়ে আরও ৫ মিনিট রান্না করুন। আঁশযুক্ত টুকরা থাকলে বাদ দিন।', en:'Pressure-cook the mince until completely tender, then fold into the khichuri and cook 5 more minutes. Discard any stringy pieces.'},
      texture:{bn:'খুব মিহি কিমা, আঁশমুক্ত', en:'Very fine mince, no stringy fibres'},
      portion:{bn:'১/২ কাপ', en:'About half a cup'},
      benefit:{bn:'আয়রন, জিংক ও ভিটামিন বি১২ — সলিড শুরুর পর সবচেয়ে গুরুত্বপূর্ণ পুষ্টি উপাদানগুলোর মধ্যে পড়ে।', en:'Iron, zinc and vitamin B12 — among the most important nutrients once solids begin.'} },

    /* ---------- AFTERNOON SNACK ---------- */
    { id:'p-avocado', slot:'pmsnack', minAge:6, veg:true, tiers:['premium'], methods:['blw','mixed'], allerg:[], uses:['avocado'],
      name:{bn:'অ্যাভোকাডো স্টিক', en:'Avocado spears'}, icon:'🥑',
      recipe:{bn:'১/৪টি পাকা অ্যাভোকাডো।', en:'A quarter of a ripe avocado.'},
      prep:{bn:'লম্বা টুকরা করে সুজি বা গুঁড়া করা চিড়ায় গড়িয়ে দিন যাতে পিচ্ছিল না লাগে।', en:'Cut into spears and roll in suji or crushed chira so it is not too slippery to hold.'},
      texture:{bn:'ক্রিমি, নরম', en:'Creamy and soft'},
      portion:{bn:'২-৩ টুকরা', en:'2-3 spears'},
      benefit:{bn:'স্বাস্থ্যকর চর্বি — মস্তিষ্কের বিকাশে গুরুত্বপূর্ণ।', en:'Healthy fats that are important for brain development.'} },

    { id:'p-pumpkinball', slot:'pmsnack', minAge:8, veg:true, tiers:['budget','mid','premium'], methods:['blw','mixed'], allerg:[], uses:['pumpkin','rice'],
      name:{bn:'কুমড়া-ভাতের বল', en:'Pumpkin rice balls'}, icon:'🎃',
      recipe:{bn:'১/৪ কাপ সেদ্ধ কুমড়া + ১/৪ কাপ ভাত।', en:'1/4 cup cooked pumpkin + 1/4 cup rice.'},
      prep:{bn:'দুটো একসাথে চটকে ছোট ছোট বল বানিয়ে দিন — হাতে ধরে খাওয়ার জন্য চমৎকার।', en:'Mash together and roll into small balls — ideal for practising the pincer grasp.'},
      texture:{bn:'নরম, ধরে রাখার মতো বল', en:'Soft balls that hold together'},
      portion:{bn:'৩-৪টি বল', en:'3-4 balls'},
      benefit:{bn:'ভিটামিন এ ও শক্তি; হাত-চোখের সমন্বয় অনুশীলনের সুযোগ।', en:'Vitamin A and energy, plus fine-motor practice.'} },

    { id:'p-chanacubes', slot:'pmsnack', minAge:6, veg:true, tiers:['budget','mid'], methods:['blw','mixed'], allerg:['dairy'], uses:['chana'],
      name:{bn:'তাজা ছানার কিউব', en:'Fresh chana cubes'}, icon:'🧀',
      recipe:{bn:'১/৪ কাপ ঘরে তৈরি লবণহীন ছানা।', en:'1/4 cup home-made unsalted chana.'},
      prep:{bn:'দুধ জ্বাল দিয়ে লেবুর রস দিয়ে ছানা কেটে ছেঁকে নিন, চেপে ছোট কিউব করুন। বাজারের নোনতা পনির নয়।', en:'Split hot milk with lemon juice, strain, press and cut into small cubes. Not shop-bought salted cheese.'},
      texture:{bn:'নরম, ভেঙে যায় এমন কিউব', en:'Soft, crumbly cubes'},
      portion:{bn:'৪-৫টি কিউব', en:'4-5 cubes'},
      benefit:{bn:'ক্যালসিয়াম ও সম্পূর্ণ প্রোটিন, হাড়ের গঠনে সহায়ক।', en:'Calcium and complete protein for bone development.'} },

    { id:'p-mango', slot:'pmsnack', minAge:6, veg:true, tiers:['budget','mid','premium'], methods:['blw','trad','mixed'], allerg:[], uses:['mango'],
      name:{bn:'পাকা আমের টুকরা', en:'Ripe mango spears'}, icon:'🥭',
      recipe:{bn:'১/৪টি পাকা আম।', en:'A quarter of a ripe mango.'},
      prep:{bn:'লম্বা টুকরা করে দিন; খুব পাকা হলে চটকে চামচে দিন।', en:'Cut into long spears; if very ripe, mash and offer on a spoon instead.'},
      texture:{bn:'রসালো, নরম', en:'Juicy and soft'},
      portion:{bn:'২-৩ টুকরা', en:'2-3 spears'},
      benefit:{bn:'ভিটামিন এ ও সি; উদ্ভিজ্জ আয়রনের শোষণ বাড়ায়।', en:'Vitamin A and C; the vitamin C boosts absorption of plant iron.'} },

    /* ---------- DINNER ---------- */
    { id:'d-daalbhat', slot:'dinner', minAge:6, veg:true, tiers:['budget','mid','premium'], methods:['trad','mixed','blw'], allerg:[], uses:['lentil','rice','ghee'],
      name:{bn:'ডাল-ভাত মাখা', en:'Dal and rice mash'}, icon:'🍚',
      recipe:{bn:'৩ টেবিল চামচ নরম ভাত + ২ টেবিল চামচ ঘন মসুর ডাল + ১/৪ চা চামচ ঘি।', en:'3 tbsp soft rice + 2 tbsp thick red-lentil dal + 1/4 tsp ghee.'},
      prep:{bn:'ডাল হলুদ দিয়ে নরম করে সেদ্ধ করে ভাতের সাথে চটকে নিন; ঘি মিশিয়ে দিন। লবণ ছাড়া রান্না করুন।', en:'Cook the dal soft with turmeric, mash into the rice and stir in ghee. Cook without salt.'},
      texture:{bn:'নরম, সামান্য দলাযুক্ত', en:'Soft with a little texture'},
      portion:{bn:'১/২ কাপ', en:'About half a cup'},
      benefit:{bn:'ভাত ও ডাল একসাথে সম্পূর্ণ প্রোটিন তৈরি করে — বাংলাদেশের ঘরোয়া খাবারের সবচেয়ে নির্ভরযোগ্য ভিত্তি।', en:'Rice and dal together form a complete protein — the most dependable base of the Bangladeshi home diet.'} },

    { id:'d-vegmash', slot:'dinner', minAge:6, veg:true, tiers:['budget','mid','premium'], methods:['trad','mixed'], allerg:[], uses:['lau','potato','carrot'],
      name:{bn:'মিশ্র সবজি মাখা', en:'Mixed vegetable mash'}, icon:'🥕',
      recipe:{bn:'১/৪ কাপ করে লাউ, আলু ও গাজর + ১/৪ চা চামচ তেল।', en:'1/4 cup each of bottle gourd, potato and carrot + 1/4 tsp oil.'},
      prep:{bn:'সব সবজি একসাথে নরম করে সেদ্ধ করে চটকে নিন; সামান্য সেদ্ধ পানি দিয়ে পাতলা করুন।', en:'Steam everything until soft, mash and loosen with a little of the cooking water.'},
      texture:{bn:'মসৃণ মাখা (৬-৮ মাস) বা কাঁটাচামচে ভাঙা (৯+ মাস)', en:'Smooth mash at 6-8 months, fork-crushed at 9+ months'},
      portion:{bn:'৪-৬ টেবিল চামচ', en:'4-6 tablespoons'},
      benefit:{bn:'বিভিন্ন সবজির স্বাদে অভ্যস্ত করে; ফাইবার ও ভিটামিন সরবরাহ করে।', en:'Builds acceptance of vegetable flavours while providing fibre and vitamins.'} },

    { id:'d-eggkhichuri', slot:'dinner', minAge:8, veg:false, tiers:['budget','mid'], methods:['trad','mixed'], allerg:['egg'], uses:['egg','khichuri'],
      name:{bn:'ডিম-খিচুড়ি', en:'Egg khichuri'}, icon:'🍳',
      recipe:{bn:'১/২ কাপ খিচুড়ি + ১টি সম্পূর্ণ সেদ্ধ ডিম।', en:'1/2 cup khichuri + 1 hard-boiled egg.'},
      prep:{bn:'ডিম সম্পূর্ণ সেদ্ধ করে চটকে গরম খিচুড়িতে মিশিয়ে দিন। আধা-সেদ্ধ ডিম কখনো নয়।', en:'Hard-boil the egg, mash it and fold into the warm khichuri. Never partially cooked egg.'},
      texture:{bn:'নরম, হালকা দানাদার', en:'Soft with light texture'},
      portion:{bn:'১/২ কাপ', en:'About half a cup'},
      benefit:{bn:'প্রোটিন, আয়রন ও কোলিন এক বেলায়।', en:'Protein, iron and choline in one meal.'} },

    { id:'d-familyplate', slot:'dinner', minAge:12, veg:true, tiers:['budget','mid','premium'], methods:['blw','mixed','trad'], allerg:[], uses:['rice','lentil','spinach','chicken'],
      name:{bn:'পরিবারের খাবার (মানিয়ে নেওয়া)', en:'Adapted family plate'}, icon:'🍽',
      recipe:{bn:'পরিবারের রান্না করা ভাত, ডাল, সবজি ও মাছ/মাংস — লবণ ও ঝাল যোগ করার আগে আলাদা করে রাখা।', en:"The family's rice, dal, vegetables and fish or meat — portioned out before salt and chilli are added."},
      prep:{bn:'রান্নার শেষে লবণ-মরিচ দেওয়ার আগে বাচ্চার অংশ তুলে রাখুন। বড় টুকরা ছোট করে কেটে বা কাঁটাচামচে ভেঙে দিন।', en:"Set aside baby's share before seasoning. Cut or fork-crush any large pieces."},
      texture:{bn:'কাটা/ভাঙা পারিবারিক খাবার', en:'Chopped or crushed family food'},
      portion:{bn:'৩/৪ কাপ', en:'About three-quarters of a cup'},
      benefit:{bn:'পারিবারিক খাবারে পূর্ণ অন্তর্ভুক্তি — দীর্ঘমেয়াদে ভালো খাদ্যাভ্যাস গড়ে তোলার সবচেয়ে শক্তিশালী উপায়।', en:'Full inclusion in family meals — the single strongest predictor of good long-term eating habits.'} },

    { id:'d-shrimpveg', slot:'dinner', minAge:10, veg:false, tiers:['mid','premium'], methods:['trad','mixed'], allerg:['shellfish'], uses:['shrimp','lau','rice'],
      name:{bn:'চিংড়ি-লাউ ভাত', en:'Shrimp and bottle gourd rice'}, icon:'🍤',
      recipe:{bn:'৩-৪টি ছোট চিংড়ি + ১/৪ কাপ লাউ + ৩ টেবিল চামচ ভাত।', en:'3-4 small shrimp + 1/4 cup bottle gourd + 3 tbsp rice.'},
      prep:{bn:'চিংড়ির খোসা ও শিরা সম্পূর্ণ ফেলে ভালোভাবে সেদ্ধ করে মিহি কুচি করুন, লাউ ও ভাতের সাথে মেশান।', en:'Shell and devein completely, cook through, chop finely and mix with the gourd and rice.'},
      texture:{bn:'মিহি কুচি', en:'Finely chopped'},
      portion:{bn:'১/২ কাপ', en:'About half a cup'},
      benefit:{bn:'চর্বিহীন প্রোটিন ও আয়োডিন; প্রথমবার দিনের প্রথম ভাগে দিন।', en:'Lean protein and iodine; introduce it early in the day the first time.'} },
  ];

  const SLOTS = [
    { id:'breakfast', label:{bn:'সকালের নাশতা', en:'Breakfast'},        icon:'🌅' },
    { id:'amsnack',   label:{bn:'সকালের হালকা খাবার', en:'Morning snack'}, icon:'☀️' },
    { id:'lunch',     label:{bn:'দুপুরের খাবার', en:'Lunch'},            icon:'🍽' },
    { id:'pmsnack',   label:{bn:'বিকেলের হালকা খাবার', en:'Afternoon snack'}, icon:'🌤' },
    { id:'dinner',    label:{bn:'রাতের খাবার', en:'Dinner'},             icon:'🌙' },
  ];

  const METHODS = [
    { id:'blw',   label:{bn:'BLW (নিজে হাতে)', en:'Baby-led weaning'} },
    { id:'trad',  label:{bn:'প্রথাগত (চামচে)', en:'Traditional (spoon)'} },
    { id:'mixed', label:{bn:'মিশ্র পদ্ধতি', en:'Mixed approach'} },
  ];
  const DIETS = [
    { id:'nonveg', label:{bn:'আমিষ (মাছ-মাংস সহ)', en:'Non-vegetarian'} },
    { id:'veg',    label:{bn:'নিরামিষ', en:'Vegetarian'} },
  ];
  const BUDGETS = [
    { id:'budget',  label:{bn:'৳ সাশ্রয়ী', en:'৳ Budget'} },
    { id:'mid',     label:{bn:'৳৳ মাঝারি', en:'৳৳ Medium'} },
    { id:'premium', label:{bn:'৳৳৳ প্রিমিয়াম', en:'৳৳৳ Premium'} },
  ];

  /* Persisted form state so the caregiver's setup survives a reload. */
  let cfg = Util.load('planner', { age:8, method:'mixed', diet:'nonveg', budget:'budget', allergies:[] });
  let lastPlan = null;

  function saveCfg(){ Util.save('planner', cfg); }

  /* ---- Form construction ---- */
  function buildForm(){
    const ageSel = document.getElementById('pl-age');
    if(!ageSel) return;
    ageSel.innerHTML = '';
    for(let m=6; m<=24; m++){
      const o = document.createElement('option');
      o.value = m;
      o.textContent = Util.num(m) + ' ' + Util.tt('মাস','months');
      ageSel.appendChild(o);
    }
    ageSel.value = cfg.age;
    ageSel.onchange = e => { cfg.age = +e.target.value; saveCfg(); };

    fillSelect('pl-method', METHODS, 'method');
    fillSelect('pl-diet',   DIETS,   'diet');
    fillSelect('pl-budget', BUDGETS, 'budget');

    const box = document.getElementById('pl-allergies');
    box.innerHTML = '';
    ALLERGENS.forEach(a => {
      const on = cfg.allergies.indexOf(a.id) > -1;
      const lab = document.createElement('label');
      lab.className = 'v-check' + (on ? ' on' : '');
      lab.innerHTML = `<input type="checkbox" ${on?'checked':''}> <span>${Util.t(a.label)}</span>`;
      lab.querySelector('input').onchange = e => {
        if(e.target.checked){ if(cfg.allergies.indexOf(a.id)<0) cfg.allergies.push(a.id); }
        else cfg.allergies = cfg.allergies.filter(x => x !== a.id);
        lab.classList.toggle('on', e.target.checked);
        saveCfg();
      };
      box.appendChild(lab);
    });
  }

  function fillSelect(elId, opts, key){
    const sel = document.getElementById(elId);
    sel.innerHTML = '';
    opts.forEach(o => {
      const el = document.createElement('option');
      el.value = o.id; el.textContent = Util.t(o.label);
      sel.appendChild(el);
    });
    sel.value = cfg[key];
    sel.onchange = e => { cfg[key] = e.target.value; saveCfg(); };
  }

  /* ---- Candidate filtering ---- */
  function eligible(meal){
    if(cfg.age < meal.minAge) return false;
    if(cfg.diet === 'veg' && !meal.veg) return false;
    if(meal.tiers.indexOf(cfg.budget) < 0) return false;
    if(meal.methods.indexOf(cfg.method) < 0) return false;
    if(meal.allerg.some(a => cfg.allergies.indexOf(a) > -1)) return false;
    return true;
  }

  /* ---- Plan generation ---- */
  function build(){
    const b = band(cfg.age);
    /* Snack slots only appear once the age band allows them. */
    const wanted = ['breakfast','lunch','dinner'];
    if(b.snacks >= 1) wanted.splice(1, 0, 'amsnack');
    if(b.snacks >= 2) wanted.push('pmsnack');
    /* 6-8 months starts at 2 meals; drop dinner on the youngest band so the
       plan matches WHO minimum meal frequency rather than overshooting. */
    if(b.meals === 2 && cfg.age < 8) wanted.splice(wanted.indexOf('dinner'), 1);

    const used = {};
    const plan = wanted.map(slot => {
      let pool = MEALS.filter(m => m.slot === slot && eligible(m));
      /* Fall back to any eligible meal if the slot pool is empty after
         filtering (e.g. vegetarian + premium + several allergies). */
      if(!pool.length) pool = MEALS.filter(m => eligible(m));
      pool = pool.filter(m => !used[m.id]);
      if(!pool.length) return { slot, meal:null };
      const chosen = Util.shuffle(pool)[0];
      used[chosen.id] = true;
      return { slot, meal: chosen };
    });
    return { band:b, items:plan };
  }

  function generate(regen){
    lastPlan = build();
    renderPlan();
    if(regen){
      const out = document.getElementById('planner-output');
      out.classList.remove('anim-in');
      void out.offsetWidth;      /* force reflow so the animation replays */
      out.classList.add('anim-in');
    }
  }

  /* ---- Rendering ---- */
  function renderPlan(){
    const out = document.getElementById('planner-output');
    if(!out) return;
    if(!lastPlan){
      out.innerHTML = Util.empty('🍱',
        Util.tt('এখনো কোনো পরিকল্পনা তৈরি হয়নি','No plan generated yet'),
        Util.tt('উপরে বাচ্চার তথ্য দিয়ে "পরিকল্পনা তৈরি করুন" বোতামে চাপ দিন — সাথে সাথেই একদিনের সম্পূর্ণ মেনু পেয়ে যাবেন।',
                'Fill in your baby\'s details above and press "Generate plan" to get a full day\'s menu instantly.'));
      return;
    }
    const b = lastPlan.band;
    const realMeals = lastPlan.items.filter(i => i.meal && i.slot!=='amsnack' && i.slot!=='pmsnack').length;
    const realSnacks = lastPlan.items.filter(i => i.meal && (i.slot==='amsnack' || i.slot==='pmsnack')).length;

    let html = `<div class="plan-summary anim-in">
      <div class="stat"><div class="sv">${Util.num(cfg.age)}</div><div class="sl">${Util.tt('মাস বয়স','months old')}</div></div>
      <div class="stat"><div class="sv">${Util.num(realMeals)}</div><div class="sl">${Util.tt('প্রধান বেলা','main meals')}</div></div>
      <div class="stat"><div class="sv">${Util.num(realSnacks)}</div><div class="sl">${Util.tt('হালকা খাবার','snacks')}</div></div>
      <div class="stat"><div class="sv">${cfg.age < 12 ? '🍼' : '🥛'}</div><div class="sl">${cfg.age < 12 ? Util.tt('দুধই প্রধান','milk still primary') : Util.tt('খাবারই প্রধান','food now primary')}</div></div>
    </div>`;

    html += '<div class="plan-day">';
    lastPlan.items.forEach(item => {
      const slotDef = SLOTS.find(s => s.id === item.slot);
      if(!item.meal){
        html += `<div class="meal-card"><div class="slot">${slotDef.icon} ${Util.t(slotDef.label)}</div>
          <p class="v-muted" style="margin-top:8px;">${Util.tt('এই বেলার জন্য উপযুক্ত কোনো খাবার পাওয়া যায়নি — অ্যালার্জি বা বাজেটের ফিল্টার কিছুটা শিথিল করে দেখুন।','No suitable dish matched this slot — try relaxing an allergy or budget filter.')}</p></div>`;
        return;
      }
      const m = item.meal;
      html += `<div class="meal-card">
        <div class="slot">${slotDef.icon} ${Util.t(slotDef.label)}</div>
        <div class="dish"><span class="mi">${m.icon}</span><span>${Util.t(m.name)}</span></div>
        <div class="v-row"><div class="v-k">${Util.tt('উপকরণ','Recipe')}</div><p>${Util.t(m.recipe)}</p></div>
        <div class="v-row"><div class="v-k">${Util.tt('প্রস্তুত প্রণালী','Preparation')}</div><p>${Util.t(m.prep)}</p></div>
        <div class="v-row"><div class="v-k">${Util.tt('টেক্সচার','Texture')}</div><p>${Util.t(m.texture)}</p></div>
        <div class="v-row"><div class="v-k">${Util.tt('পরিবেশন পরিমাণ','Serving size')}</div><p>${Util.t(m.portion)}</p></div>
        <div class="v-row"><div class="v-k mut">${Util.tt('পুষ্টিগুণ','Why it helps')}</div><p class="v-muted">${Util.t(m.benefit)}</p></div>
        ${m.uses && m.uses.length ? `<div class="chip-row">${m.uses.slice(0,4).map(id=>`<span class="chip">${Util.foodIcon(id)} ${Util.foodName(id)}</span>`).join('')}</div>` : ''}
      </div>`;
    });
    html += '</div>';

    html += `<div class="plan-reminders">
      <div class="reminder"><b>🤱 ${Util.tt('বুকের দুধ / ফর্মুলা','Breastmilk / formula')}</b>${Util.t(b.milk)}</div>
      <div class="reminder"><b>💧 ${Util.tt('পানি','Water')}</b>${Util.t(b.water)}</div>
      <div class="reminder"><b>⏱ ${Util.tt('সময়ের নিয়ম','Timing rule')}</b>${Util.tt('খাবারের ৩০-৪৫ মিনিট আগে দুধ না দেওয়াই ভালো, যাতে বাচ্চার ক্ষুধা থাকে। ১২ মাসের নিচে দুধই প্রধান পুষ্টি — খাবার তার পরিপূরক।','Avoid a milk feed in the 30-45 minutes before a meal so baby arrives hungry. Under 12 months milk is still the primary nutrition and food complements it.')}</div>
      <div class="reminder"><b>🧂 ${Util.tt('লবণ ও চিনি','Salt and sugar')}</b>${Util.tt('১ বছরের নিচে বাড়তি লবণ ও চিনি নয়, এবং ১ বছরের নিচে মধু একেবারেই নয় (বোটুলিজমের ঝুঁকি)।','No added salt or sugar under 12 months, and no honey at all under 12 months due to botulism risk.')}</div>
    </div>`;

    out.innerHTML = html;
  }

  function init(){
    buildForm();
    renderPlan();
  }

  /* Re-render on language change: rebuild labels and the visible plan. */
  LANG_HOOKS.push(function(){ buildForm(); renderPlan(); });

  return { init, generate, BANDS, band };
})();
