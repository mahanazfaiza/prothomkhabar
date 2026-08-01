
/* =====================================================================
   MODULE 2 — BANGLADESHI RECIPE LIBRARY
   Every recipe uses ingredients available in a normal Bangladeshi kitchen
   or bazaar. Storage and freezer times follow standard food-safety
   guidance for infant food (fridge 24-48h, freezer 1 month, reheat once
   to steaming hot, then cool before serving).
   ===================================================================== */
const Recipes = (function(){

  const CATS = [
    { id:'all',      label:{bn:'সব',           en:'All'},           icon:'🍽' },
    { id:'rice',     label:{bn:'ভাত',          en:'Rice'},          icon:'🍚' },
    { id:'khichuri', label:{bn:'খিচুড়ি',       en:'Khichuri'},      icon:'🍛' },
    { id:'fish',     label:{bn:'মাছ',          en:'Fish'},          icon:'🐟' },
    { id:'chicken',  label:{bn:'মুরগি',        en:'Chicken'},       icon:'🍗' },
    { id:'beef',     label:{bn:'গরু/খাসি',     en:'Beef'},          icon:'🥩' },
    { id:'veg',      label:{bn:'সবজি',         en:'Vegetables'},    icon:'🥕' },
    { id:'fruit',    label:{bn:'ফল',           en:'Fruits'},        icon:'🍌' },
    { id:'finger',   label:{bn:'ফিঙ্গার ফুড',  en:'Finger foods'},  icon:'✋' },
    { id:'breakfast',label:{bn:'নাশতা',        en:'Breakfast'},     icon:'🌅' },
    { id:'snack',    label:{bn:'স্ন্যাকস',     en:'Snacks'},        icon:'🍪' },
    { id:'iron',     label:{bn:'আয়রন-সমৃদ্ধ',  en:'Iron-rich'},     icon:'🩸' },
    { id:'quick',    label:{bn:'দ্রুত রান্না',  en:'Quick meals'},   icon:'⚡' },
  ];

  /* Recipe schema:
     age      minimum months
     cats     one or more category ids
     time     total cooking time in minutes
     ing      ingredient list (bilingual pairs)
     steps    numbered preparation steps
     texture / portion / nutrition / storage / freezer / reheat
     allergens / choking  — safety fields, always shown  */
  const R = [
    /* ---------------- 6+ MONTHS ---------------- */
    { id:'r-ricecereal', icon:'🍼', age:6, cats:['rice','breakfast','quick'], time:12,
      name:{bn:'ঘরে তৈরি চালের জাউ', en:'Homemade Rice Porridge (Jau)'},
      ing:[{bn:'২ টেবিল চামচ চালের গুঁড়া',en:'2 tbsp rice flour'},{bn:'১ কাপ পানি বা বুকের দুধ',en:'1 cup water or breastmilk'},{bn:'১/৪ চা চামচ ঘি (ঐচ্ছিক)',en:'1/4 tsp ghee (optional)'}],
      steps:[{bn:'চাল ভালোভাবে ধুয়ে রোদে শুকিয়ে শুকনো কড়াইয়ে হালকা ভেজে মিহি গুঁড়া করে নিন — একবারে বেশি করে বানিয়ে বয়ামে রাখা যায়।',en:'Wash rice, dry it, toast lightly in a dry pan and grind to a fine powder — make a batch and store it in a jar.'},
             {bn:'২ টেবিল চামচ গুঁড়া ঠান্ডা পানিতে ভালোভাবে গুলে নিন যাতে দলা না থাকে।',en:'Whisk 2 tbsp of the powder into cold water so no lumps form.'},
             {bn:'অল্প আঁচে ৭-৮ মিনিট নাড়তে নাড়তে রান্না করুন যতক্ষণ না ঘন হয়।',en:'Cook on low heat for 7-8 minutes, stirring, until it thickens.'},
             {bn:'নামিয়ে হালকা গরম হলে ঘি মিশিয়ে পরিবেশন করুন। চিনি বা লবণ নয়।',en:'Cool to lukewarm, stir in ghee and serve. No sugar or salt.'}],
      texture:{bn:'মসৃণ, চামচ থেকে ধীরে পড়ে এমন ঘনত্ব',en:'Smooth, drops slowly off a spoon'},
      portion:{bn:'২-৪ টেবিল চামচ (৬ মাস), ৫-৭ টেবিল চামচ (৮ মাস+)',en:'2-4 tbsp at 6 months, 5-7 tbsp from 8 months'},
      nutrition:{bn:'সহজপাচ্য শক্তি; ঘি যোগ করলে ক্যালরি ও চর্বিতে-দ্রবণীয় ভিটামিন শোষণ বাড়ে।',en:'Easily digested energy; adding ghee raises calories and helps absorb fat-soluble vitamins.'},
      storage:{bn:'ফ্রিজে ২৪ ঘণ্টা ঢাকা অবস্থায়।',en:'Covered in the fridge for 24 hours.'},
      freezer:{bn:'আইস কিউব ট্রেতে ভাগ করে ১ মাস।',en:'Portioned in an ice-cube tray for 1 month.'},
      reheat:{bn:'অল্প পানি দিয়ে ফুটন্ত গরম করে নেড়ে ঠান্ডা করে দিন — একবারের বেশি গরম করবেন না।',en:'Reheat with a splash of water until steaming, stir, then cool before serving. Reheat only once.'},
      allergens:{bn:'নেই (ঘি দিলে দুগ্ধজাত)',en:'None (dairy if ghee is used)'},
      choking:{bn:'দলা ভেঙে দিন; খুব ঘন হলে পাতলা করুন।',en:'Break up any lumps; thin it if too stiff.'} },

    { id:'r-khichuri6', icon:'🍛', age:6, cats:['khichuri','rice','veg'], time:25,
      name:{bn:'৬ মাসের নরম সবজি খিচুড়ি', en:'First Vegetable Khichuri (6m)'},
      ing:[{bn:'২ টেবিল চামচ চাল',en:'2 tbsp rice'},{bn:'১ টেবিল চামচ মুগ ডাল',en:'1 tbsp moong dal'},{bn:'১/৪ কাপ মিষ্টি কুমড়া ও গাজর কুচি',en:'1/4 cup diced pumpkin and carrot'},{bn:'১ চিমটি হলুদ',en:'A pinch of turmeric'},{bn:'১/২ চা চামচ ঘি',en:'1/2 tsp ghee'},{bn:'৩ কাপ পানি',en:'3 cups water'}],
      steps:[{bn:'চাল ও ডাল একসাথে ধুয়ে ২০ মিনিট ভিজিয়ে রাখুন — এতে দ্রুত গলে ও হজম সহজ হয়।',en:'Rinse rice and dal together and soak 20 minutes — they break down faster and digest more easily.'},
             {bn:'সবজি, হলুদ ও পানি দিয়ে ঢেকে মাঝারি আঁচে ২০-২৫ মিনিট সেদ্ধ করুন।',en:'Add vegetables, turmeric and water, cover and simmer 20-25 minutes.'},
             {bn:'সব উপকরণ সম্পূর্ণ গলে গেলে ঘি মিশিয়ে চামচের পিঠ দিয়ে চটকে মসৃণ করুন।',en:'When everything has collapsed, stir in ghee and mash smooth with the back of a spoon.'},
             {bn:'লবণ ও মরিচ দেবেন না। পাতলা করতে সেদ্ধ পানি ব্যবহার করুন।',en:'Add no salt or chilli. Loosen with the cooking water if needed.'}],
      texture:{bn:'মসৃণ, ঘন মাখা',en:'Smooth, thick mash'},
      portion:{bn:'৪-৬ টেবিল চামচ',en:'4-6 tablespoons'},
      nutrition:{bn:'কার্বোহাইড্রেট, উদ্ভিজ্জ প্রোটিন, ভিটামিন এ ও চর্বি এক বাটিতে — একটি সম্পূর্ণ বেলা।',en:'Carbohydrate, plant protein, vitamin A and fat in one bowl — a complete meal.'},
      storage:{bn:'ফ্রিজে ২৪ ঘণ্টা।',en:'24 hours in the fridge.'},
      freezer:{bn:'কিউব ট্রেতে ভাগ করে ১ মাস।',en:'Frozen in cubes for up to 1 month.'},
      reheat:{bn:'সামান্য পানি দিয়ে ফুটন্ত গরম করে নেড়ে হালকা গরম হলে দিন।',en:'Reheat with a little water until steaming hot, stir and cool to lukewarm.'},
      allergens:{bn:'ঘি ব্যবহার করলে দুগ্ধজাত',en:'Dairy if ghee is used'},
      choking:{bn:'সবজির টুকরা যেন সম্পূর্ণ গলে যায় তা নিশ্চিত করুন।',en:'Make sure every vegetable piece has fully collapsed.'} },

    { id:'r-sweetpotatostick', icon:'🍠', age:6, cats:['finger','veg','quick','snack'], time:15,
      name:{bn:'মিষ্টি আলুর ফিঙ্গার স্টিক', en:'Sweet Potato Finger Sticks'},
      ing:[{bn:'১টি মাঝারি মিষ্টি আলু',en:'1 medium sweet potato'},{bn:'সামান্য তেল বা ঘি (ঐচ্ছিক)',en:'A little oil or ghee (optional)'}],
      steps:[{bn:'খোসা ছাড়িয়ে বড়দের তর্জনীর সমান লম্বা ও পুরু স্টিক করে কাটুন — মুঠোয় ধরলে মাথাটা বেরিয়ে থাকবে।',en:'Peel and cut into sticks about the size of an adult index finger, so a bit sticks out of baby\'s fist.'},
             {bn:'১২-১৫ মিনিট ভাপে সেদ্ধ করুন।',en:'Steam for 12-15 minutes.'},
             {bn:'দুই আঙুলের হালকা চাপে ভেঙে যায় কিনা পরীক্ষা করুন — এটাই নিরাপত্তার মূল পরীক্ষা।',en:'Test that it squashes under gentle pressure between two fingers — this is the key safety check.'},
             {bn:'হালকা গরম অবস্থায় হাইচেয়ারের ট্রেতে সরাসরি দিন।',en:'Serve lukewarm, straight onto the highchair tray.'}],
      texture:{bn:'নরম কিন্তু আকৃতি ধরে রাখে',en:'Soft but holds its shape'},
      portion:{bn:'২-৩টি স্টিক',en:'2-3 sticks'},
      nutrition:{bn:'বিটা-ক্যারোটিন, ফাইবার ও ধীরে মুক্ত হওয়া শক্তি।',en:'Beta-carotene, fibre and slow-release energy.'},
      storage:{bn:'ফ্রিজে ২ দিন এয়ারটাইট বাক্সে।',en:'2 days in an airtight box in the fridge.'},
      freezer:{bn:'ট্রেতে আলাদা করে জমিয়ে ব্যাগে ভরে ১ মাস।',en:'Freeze flat on a tray, then bag for 1 month.'},
      reheat:{bn:'ভাপে ৩-৪ মিনিট গরম করুন; মাইক্রোওয়েভে গরম করলে ভেতরে গরম দাগ থাকতে পারে, তাই ভালো করে নেড়ে দেখুন।',en:'Steam 3-4 minutes. Microwaving can leave hot spots, so stir and test carefully.'},
      allergens:{bn:'নেই',en:'None'},
      choking:{bn:'শক্ত/আধা-সেদ্ধ স্টিক দেবেন না। গোল চাকতি করে কাটবেন না।',en:'Never serve firm or undercooked sticks, and never cut into round coins.'} },

    { id:'r-daalbhat', icon:'🍚', age:6, cats:['rice','quick'], time:20,
      name:{bn:'ডাল-ভাত মাখা', en:'Classic Dal-Bhat Mash'},
      ing:[{bn:'৩ টেবিল চামচ নরম ভাত',en:'3 tbsp soft-cooked rice'},{bn:'২ টেবিল চামচ ঘন মসুর ডাল',en:'2 tbsp thick masoor dal'},{bn:'১/৪ চা চামচ ঘি',en:'1/4 tsp ghee'}],
      steps:[{bn:'মসুর ডাল হলুদ দিয়ে স্বাভাবিকের চেয়ে বেশি নরম করে সেদ্ধ করুন।',en:'Cook masoor dal with turmeric until softer than you would for adults.'},
             {bn:'পরিবারের ভাত থেকে বাচ্চার অংশ আলাদা করে নিন (লবণ দেওয়ার আগে)।',en:"Take baby's share from the family rice before any salt is added."},
             {bn:'ডাল-ভাত একসাথে চটকে ঘি মিশিয়ে দিন।',en:'Mash the dal into the rice and stir in ghee.'}],
      texture:{bn:'৬-৮ মাস: মসৃণ · ৯+ মাস: হালকা দলাযুক্ত',en:'6-8 months smooth; 9+ months lightly lumpy'},
      portion:{bn:'১/২ কাপ',en:'About half a cup'},
      nutrition:{bn:'ভাত ও ডাল একত্রে সম্পূর্ণ প্রোটিন তৈরি করে।',en:'Rice and dal together make a complete protein.'},
      storage:{bn:'ফ্রিজে ২৪ ঘণ্টা।',en:'24 hours refrigerated.'},
      freezer:{bn:'১ মাস।',en:'Up to 1 month.'},
      reheat:{bn:'সামান্য পানি দিয়ে ভালোভাবে গরম করে নেড়ে ঠান্ডা করুন।',en:'Reheat with a splash of water, stir well and cool.'},
      allergens:{bn:'ঘিতে দুগ্ধজাত',en:'Dairy from the ghee'},
      choking:{bn:'ঝরঝরে শুকনো ভাত নয় — নরম ও একটু আঠালো হওয়া উচিত।',en:'Not dry loose grains — it should be soft and slightly sticky.'} },

    { id:'r-bananamash', icon:'🍌', age:6, cats:['fruit','quick','snack','breakfast'], time:3,
      name:{bn:'কলা-চিড়া মাখা', en:'Banana and Chira Mash'},
      ing:[{bn:'১/২টি পাকা কলা',en:'Half a ripe banana'},{bn:'২ টেবিল চামচ চিড়া',en:'2 tbsp flattened rice'},{bn:'২ টেবিল চামচ দুধ বা পানি',en:'2 tbsp milk or water'}],
      steps:[{bn:'চিড়া ধুয়ে ১০ মিনিট ভিজিয়ে নরম করুন।',en:'Rinse and soak the chira for 10 minutes until soft.'},
             {bn:'কলার সাথে কাঁটাচামচে চটকে নিন।',en:'Mash together with the banana using a fork.'},
             {bn:'সাথে সাথে পরিবেশন করুন — কলা দ্রুত কালচে হয়ে যায়।',en:'Serve immediately — banana browns quickly.'}],
      texture:{bn:'নরম, হালকা দানাদার',en:'Soft with light grain'},
      portion:{bn:'৩-৪ টেবিল চামচ',en:'3-4 tablespoons'},
      nutrition:{bn:'দ্রুত শক্তি, পটাশিয়াম ও কিছুটা আয়রন।',en:'Fast energy, potassium and some iron.'},
      storage:{bn:'সংরক্ষণ করবেন না — তাজা বানিয়ে দিন।',en:'Do not store — make it fresh each time.'},
      freezer:{bn:'ফ্রিজিংয়ের উপযোগী নয়।',en:'Not suitable for freezing.'},
      reheat:{bn:'প্রযোজ্য নয়।',en:'Not applicable.'},
      allergens:{bn:'দুধ ব্যবহার করলে দুগ্ধজাত',en:'Dairy if milk is used'},
      choking:{bn:'শুকনো চিড়া কখনো দেবেন না — অবশ্যই ভিজিয়ে নরম করুন।',en:'Never serve dry chira — always soak it soft first.'} },

    { id:'r-omelettestrip', icon:'🍳', age:6, cats:['finger','breakfast','iron','quick'], time:8,
      name:{bn:'ডিমের ফিঙ্গার স্ট্রিপ', en:'Egg Finger Strips'},
      ing:[{bn:'১টি ডিম',en:'1 egg'},{bn:'১ চা চামচ দুধ বা পানি',en:'1 tsp milk or water'},{bn:'১/২ চা চামচ তেল',en:'1/2 tsp oil'}],
      steps:[{bn:'ডিম ভালোভাবে ফেটিয়ে দুধ মেশান।',en:'Beat the egg well with the milk.'},
             {bn:'নন-স্টিক প্যানে পাতলা করে ছড়িয়ে দুই পিঠ সম্পূর্ণ সেদ্ধ করুন — কুসুম যেন একেবারেই তরল না থাকে।',en:'Spread thin in a non-stick pan and cook both sides fully set — no runny yolk at all.'},
             {bn:'আঙুলের সমান স্ট্রিপ করে কেটে হালকা গরম অবস্থায় দিন।',en:'Cut into finger-width strips and serve warm.'}],
      texture:{bn:'নরম কিন্তু ধরে রাখার মতো',en:'Soft yet graspable'},
      portion:{bn:'১/২ থেকে ১টি ডিম',en:'Half to one egg'},
      nutrition:{bn:'সম্পূর্ণ প্রোটিন, আয়রন ও কোলিন — মস্তিষ্কের বিকাশে গুরুত্বপূর্ণ।',en:'Complete protein, iron and choline, important for brain development.'},
      storage:{bn:'ফ্রিজে ২৪ ঘণ্টা।',en:'24 hours refrigerated.'},
      freezer:{bn:'সুপারিশ করা হয় না — টেক্সচার নষ্ট হয়।',en:'Not recommended — the texture suffers.'},
      reheat:{bn:'ঢাকনা দিয়ে প্যানে অল্প আঁচে গরম করুন।',en:'Warm gently, covered, in a pan.'},
      allergens:{bn:'ডিম (প্রধান অ্যালার্জেন) — প্রথমবার দিনের প্রথম ভাগে অল্প পরিমাণে দিন',en:'Egg, a major allergen — introduce a small amount early in the day'},
      choking:{bn:'সম্পূর্ণ সেদ্ধ হতে হবে; শুকনো/রাবারের মতো হলে দেবেন না।',en:'Must be fully cooked; do not serve if dry and rubbery.'} },

    { id:'r-pumpkinmash', icon:'🎃', age:6, cats:['veg','quick'], time:15,
      name:{bn:'মিষ্টি কুমড়ার মাখা', en:'Pumpkin Mash'},
      ing:[{bn:'১ কাপ কুমড়ার টুকরা',en:'1 cup diced pumpkin'},{bn:'১/৪ চা চামচ ঘি',en:'1/4 tsp ghee'}],
      steps:[{bn:'কুমড়া ১২-১৫ মিনিট ভাপে সেদ্ধ করুন।',en:'Steam the pumpkin 12-15 minutes.'},
             {bn:'চটকে ঘি মিশিয়ে নিন; প্রয়োজনে বুকের দুধ দিয়ে পাতলা করুন।',en:'Mash with ghee, thinning with breastmilk if needed.'}],
      texture:{bn:'মসৃণ পিউরি',en:'Smooth purée'},
      portion:{bn:'৩-৫ টেবিল চামচ',en:'3-5 tablespoons'},
      nutrition:{bn:'ভিটামিন এ-তে অত্যন্ত সমৃদ্ধ, দৃষ্টি ও রোগ প্রতিরোধে সহায়ক।',en:'Very rich in vitamin A for vision and immunity.'},
      storage:{bn:'ফ্রিজে ২ দিন।',en:'2 days in the fridge.'},
      freezer:{bn:'কিউব করে ১ মাস।',en:'1 month as frozen cubes.'},
      reheat:{bn:'ভাপে বা অল্প আঁচে গরম করুন।',en:'Reheat by steaming or on low heat.'},
      allergens:{bn:'ঘিতে দুগ্ধজাত',en:'Dairy from ghee'},
      choking:{bn:'আঁশযুক্ত অংশ ফেলে দিন।',en:'Discard any stringy fibres.'} },

    /* ---------------- 8+ MONTHS ---------------- */
    { id:'r-fishmash', icon:'🐟', age:8, cats:['fish','rice','iron'], time:20,
      name:{bn:'রুই মাছ-ভাত মাখা', en:'Rui Fish and Rice Mash'},
      ing:[{bn:'১ টুকরা রুই মাছ',en:'1 piece of rui fish'},{bn:'৩ টেবিল চামচ ভাত',en:'3 tbsp rice'},{bn:'১টি ছোট আলু',en:'1 small potato'},{bn:'১ চিমটি হলুদ',en:'A pinch of turmeric'}],
      steps:[{bn:'মাছ হলুদ ও সামান্য পানি দিয়ে ৮-১০ মিনিট সেদ্ধ করুন।',en:'Poach the fish with turmeric in a little water for 8-10 minutes.'},
             {bn:'ঠান্ডা হলে হাত দিয়ে ছিঁড়ে প্রতিটি টুকরায় কাঁটা আছে কিনা দুইবার পরীক্ষা করুন — এটি সবচেয়ে গুরুত্বপূর্ণ ধাপ।',en:'Once cool, flake by hand and check every flake twice for bones — this is the most important step.'},
             {bn:'সেদ্ধ আলু ও ভাতের সাথে মিশিয়ে চটকে নিন।',en:'Mash together with the boiled potato and rice.'},
             {bn:'প্রয়োজনে মাছের ঝোল দিয়ে পাতলা করুন।',en:'Loosen with the poaching liquid if needed.'}],
      texture:{bn:'মসৃণ, আঁশ ও কাঁটামুক্ত',en:'Smooth, free of fibres and bones'},
      portion:{bn:'১/২ কাপ',en:'About half a cup'},
      nutrition:{bn:'প্রোটিন, ওমেগা-৩ ফ্যাটি অ্যাসিড, আয়োডিন ও ভিটামিন ডি।',en:'Protein, omega-3 fatty acids, iodine and vitamin D.'},
      storage:{bn:'ফ্রিজে ২৪ ঘণ্টা — মাছ দ্রুত নষ্ট হয়।',en:'24 hours only — fish spoils fast.'},
      freezer:{bn:'১ মাস, তবে আগে ফ্রোজেন মাছ ব্যবহার করে থাকলে পুনরায় জমাবেন না।',en:'1 month, but never refreeze fish that was previously frozen.'},
      reheat:{bn:'একবার মাত্র, ফুটন্ত গরম করে ঠান্ডা করে দিন।',en:'Once only — heat until steaming, then cool.'},
      allergens:{bn:'মাছ (প্রধান অ্যালার্জেন)',en:'Fish, a major allergen'},
      choking:{bn:'কাঁটা — সবচেয়ে বড় ঝুঁকি। উজ্জ্বল আলোতে বেছে নিন, তাড়াহুড়া করবেন না।',en:'Bones are the main hazard. Debone under bright light and never rush it.'} },

    { id:'r-chickenshred', icon:'🍗', age:8, cats:['chicken','finger','iron'], time:25,
      name:{bn:'নরম মুরগির স্ট্রিপ', en:'Soft Shredded Chicken Strips'},
      ing:[{bn:'১টি হাড়ছাড়া মুরগির বুকের টুকরা',en:'1 boneless chicken breast'},{bn:'১ চিমটি হলুদ',en:'A pinch of turmeric'},{bn:'১/২ চা চামচ তেল',en:'1/2 tsp oil'}],
      steps:[{bn:'মুরগি হলুদ দিয়ে ২০ মিনিট সেদ্ধ করুন যতক্ষণ না একেবারে নরম হয়।',en:'Simmer the chicken with turmeric for 20 minutes until very tender.'},
             {bn:'আঁশের বিপরীতে নয়, আঁশ বরাবর লম্বা স্ট্রিপ করে ছিঁড়ুন।',en:'Shred along the grain into long strips, not across it.'},
             {bn:'৯ মাসের নিচে হলে খুব মিহি কিমা করে ভাত/ডালে মিশিয়ে দিন।',en:'Under 9 months, mince very finely and mix into rice or dal instead.'}],
      texture:{bn:'নরম, লম্বা আঁশ — মাড়ি দিয়ে ছেঁড়া যায়',en:'Soft long shreds baby can gum apart'},
      portion:{bn:'২-৩ স্ট্রিপ বা ২ টেবিল চামচ কিমা',en:'2-3 strips or 2 tbsp minced'},
      nutrition:{bn:'হিম-আয়রন, জিংক ও উচ্চমানের প্রোটিন।',en:'Haem iron, zinc and high-quality protein.'},
      storage:{bn:'ফ্রিজে ২ দিন।',en:'2 days refrigerated.'},
      freezer:{bn:'ঝোলসহ জমালে শুকিয়ে যাবে না — ১ মাস।',en:'Freeze in a little of its stock so it does not dry out — 1 month.'},
      reheat:{bn:'সামান্য ঝোল দিয়ে ঢেকে গরম করুন।',en:'Reheat covered with a little stock.'},
      allergens:{bn:'নেই',en:'None'},
      choking:{bn:'শক্ত/শুকনো টুকরা বাদ দিন; গোল কিউব নয়, লম্বা স্ট্রিপ দিন।',en:'Discard tough dry pieces; use long strips rather than round cubes.'} },

    { id:'r-liverpate', icon:'🍖', age:8, cats:['iron','chicken','quick'], time:15,
      name:{bn:'মুরগির কলিজার প্যাটে', en:'Chicken Liver Pâté'},
      ing:[{bn:'৩-৪ টুকরা মুরগির কলিজা',en:'3-4 pieces of chicken liver'},{bn:'১/২ চা চামচ ঘি',en:'1/2 tsp ghee'},{bn:'১ চিমটি হলুদ ও সামান্য পেঁয়াজ',en:'A pinch of turmeric and a little onion'}],
      steps:[{bn:'কলিজা ভালোভাবে ধুয়ে পেঁয়াজ ও হলুদ দিয়ে ১০-১২ মিনিট সম্পূর্ণ সেদ্ধ করুন — ভেতরে গোলাপি থাকা চলবে না।',en:'Rinse well and cook with onion and turmeric for 10-12 minutes until no pink remains inside.'},
             {bn:'ঘি দিয়ে মিহি করে বেটে বা ব্লেন্ড করে মসৃণ প্যাটে বানান।',en:'Blend or pound with the ghee into a smooth pâté.'},
             {bn:'ভাত, রুটি বা সবজির স্টিকে সামান্য মাখিয়ে দিন। সপ্তাহে ১-২ বার।',en:'Spread thinly on rice, ruti or vegetable sticks. Once or twice a week only.'}],
      texture:{bn:'মসৃণ, মাখানোর মতো',en:'Smooth and spreadable'},
      portion:{bn:'১-২ চা চামচ',en:'1-2 teaspoons'},
      nutrition:{bn:'বাংলাদেশে পাওয়া সবচেয়ে ঘন আয়রন ও ভিটামিন এ-এর উৎসগুলোর একটি; ৬ মাসের পর আয়রনের ঘাটতি ঠেকাতে অত্যন্ত কার্যকর।',en:'One of the most iron- and vitamin-A-dense foods available locally; very effective against the post-6-month iron gap.'},
      storage:{bn:'ফ্রিজে ২৪ ঘণ্টা।',en:'24 hours refrigerated.'},
      freezer:{bn:'ছোট ভাগে ১ মাস।',en:'1 month in small portions.'},
      reheat:{bn:'ভালোভাবে গরম করে ঠান্ডা করে দিন।',en:'Reheat thoroughly, then cool.'},
      allergens:{bn:'ঘিতে দুগ্ধজাত',en:'Dairy from ghee'},
      choking:{bn:'ঝুঁকি কম; তবে ভিটামিন এ বেশি বলে পরিমাণে সীমা রাখুন।',en:'Low choking risk, but limit the amount because of its high vitamin A.'} },

    { id:'r-spinachdal', icon:'🥬', age:8, cats:['veg','iron','quick'], time:18,
      name:{bn:'পালং-ডাল', en:'Spinach Dal'},
      ing:[{bn:'৩ টেবিল চামচ মসুর ডাল',en:'3 tbsp masoor dal'},{bn:'১/২ কাপ কুচানো পালং শাক',en:'1/2 cup chopped spinach'},{bn:'১ চিমটি হলুদ, ১/৪ চা চামচ তেল',en:'A pinch of turmeric, 1/4 tsp oil'},{bn:'১ চা চামচ লেবুর রস (শেষে)',en:'1 tsp lemon juice at the end'}],
      steps:[{bn:'ডাল নরম করে সেদ্ধ করুন।',en:'Cook the dal until soft.'},
             {bn:'পালং শাক যোগ করে আরও ৫ মিনিট রান্না করুন।',en:'Add the spinach and cook 5 minutes more.'},
             {bn:'চটকে মসৃণ করে নামানোর পর লেবুর রস মেশান — ভিটামিন সি উদ্ভিজ্জ আয়রনের শোষণ কয়েকগুণ বাড়িয়ে দেয়।',en:'Mash smooth and stir in lemon juice off the heat — vitamin C multiplies absorption of plant iron.'}],
      texture:{bn:'মসৃণ, ঘন',en:'Smooth and thick'},
      portion:{bn:'৪-৫ টেবিল চামচ',en:'4-5 tablespoons'},
      nutrition:{bn:'উদ্ভিজ্জ আয়রন, ফোলেট ও ভিটামিন সি একসাথে।',en:'Plant iron, folate and vitamin C together.'},
      storage:{bn:'ফ্রিজে ২৪ ঘণ্টা।',en:'24 hours refrigerated.'},
      freezer:{bn:'১ মাস।',en:'1 month.'},
      reheat:{bn:'গরম করে নেড়ে ঠান্ডা করুন।',en:'Reheat, stir and cool.'},
      allergens:{bn:'নেই',en:'None'},
      choking:{bn:'শাকের আঁশ লম্বা হলে কুচি করে নিন।',en:'Chop the leaves finely so no long fibres remain.'} },

    { id:'r-suji', icon:'🥣', age:8, cats:['breakfast','snack','quick'], time:10,
      name:{bn:'সুজির নরম হালুয়া', en:'Soft Suji Halwa (no sugar)'},
      ing:[{bn:'২ টেবিল চামচ সুজি',en:'2 tbsp semolina'},{bn:'১ কাপ দুধ বা পানি',en:'1 cup milk or water'},{bn:'১/২ চা চামচ ঘি',en:'1/2 tsp ghee'},{bn:'১ টেবিল চামচ চটকানো কলা বা খেজুর পেস্ট (মিষ্টির জন্য)',en:'1 tbsp mashed banana or date paste for sweetness'}],
      steps:[{bn:'ঘিয়ে সুজি সুগন্ধ বের হওয়া পর্যন্ত ভাজুন।',en:'Toast the suji in ghee until it smells nutty.'},
             {bn:'দুধ ঢেলে ক্রমাগত নেড়ে ৫ মিনিট রান্না করুন যাতে দলা না বাঁধে।',en:'Pour in the milk and stir constantly for 5 minutes so it stays lump-free.'},
             {bn:'নামিয়ে কলা বা খেজুর পেস্ট মেশান — চিনি নয়।',en:'Off the heat, stir in banana or date paste — never sugar.'}],
      texture:{bn:'মসৃণ, ঘন',en:'Smooth and thick'},
      portion:{bn:'৩-৫ টেবিল চামচ',en:'3-5 tablespoons'},
      nutrition:{bn:'শক্তিঘন — কম ওজনের বাচ্চাদের জন্য উপযোগী।',en:'Energy dense — useful for babies who need to gain weight.'},
      storage:{bn:'ফ্রিজে ২৪ ঘণ্টা।',en:'24 hours refrigerated.'},
      freezer:{bn:'সুপারিশ নয় — দানা বেঁধে যায়।',en:'Not recommended — it goes grainy.'},
      reheat:{bn:'দুধ দিয়ে পাতলা করে গরম করুন।',en:'Loosen with milk and reheat.'},
      allergens:{bn:'গম (গ্লুটেন) ও দুগ্ধজাত',en:'Wheat (gluten) and dairy'},
      choking:{bn:'দলা সম্পূর্ণ ভেঙে দিন।',en:'Break up all lumps completely.'} },

    /* ---------------- 9+ MONTHS ---------------- */
    { id:'r-molakhichuri', icon:'🐠', age:9, cats:['khichuri','fish','iron'], time:30,
      name:{bn:'মলা মাছের খিচুড়ি', en:'Mola Fish Khichuri'},
      ing:[{bn:'২ টেবিল চামচ চাল, ১ টেবিল চামচ ডাল',en:'2 tbsp rice, 1 tbsp dal'},{bn:'৩-৪টি মলা মাছ',en:'3-4 mola fish'},{bn:'১ টেবিল চামচ কুচানো শাক',en:'1 tbsp chopped greens'},{bn:'হলুদ ও ১/২ চা চামচ তেল',en:'Turmeric and 1/2 tsp oil'}],
      steps:[{bn:'মলা মাছ ভালোভাবে পরিষ্কার করে হলুদ দিয়ে আলাদা সেদ্ধ করুন।',en:'Clean the mola well and cook separately with turmeric.'},
             {bn:'সম্পূর্ণ চটকে নিন — ছোট মাছেও সূক্ষ্ম কাঁটা থাকে, তাই মসৃণ না হওয়া পর্যন্ত চটকাতে হবে।',en:'Mash completely — even small fish have fine bones, so mash until entirely smooth.'},
             {bn:'চাল-ডাল ও শাক দিয়ে খিচুড়ি রান্না করে শেষে মাছ মিশিয়ে ৫ মিনিট ফুটিয়ে নিন।',en:'Cook the khichuri with the greens, then fold in the fish and simmer 5 more minutes.'}],
      texture:{bn:'নরম, সম্পূর্ণ চটকানো',en:'Soft and fully mashed'},
      portion:{bn:'১/২ কাপ',en:'About half a cup'},
      nutrition:{bn:'আয়রন, ক্যালসিয়াম ও ভিটামিন এ — বাংলাদেশের অন্যতম সাশ্রয়ী পুষ্টিকর খাবার।',en:'Iron, calcium and vitamin A — among the most affordable nutrient-dense foods in Bangladesh.'},
      storage:{bn:'ফ্রিজে ২৪ ঘণ্টা।',en:'24 hours refrigerated.'},
      freezer:{bn:'১ মাস।',en:'1 month.'},
      reheat:{bn:'একবার মাত্র ফুটন্ত গরম করুন।',en:'Reheat once until steaming.'},
      allergens:{bn:'মাছ',en:'Fish'},
      choking:{bn:'কাঁটা — সম্পূর্ণ চটকানো ছাড়া কখনো দেবেন না।',en:'Bones — never serve unless completely mashed.'} },

    { id:'r-vegtikki', icon:'✋', age:9, cats:['finger','veg','snack'], time:20,
      name:{bn:'সবজি টিক্কি (লবণ ছাড়া)', en:'Vegetable Tikki (no salt)'},
      ing:[{bn:'১/২ কাপ সেদ্ধ আলু',en:'1/2 cup boiled potato'},{bn:'১/৪ কাপ সেদ্ধ গাজর ও মটরশুঁটি',en:'1/4 cup boiled carrot and peas'},{bn:'২ টেবিল চামচ সুজি বা চালের গুঁড়া',en:'2 tbsp suji or rice flour'},{bn:'১ চিমটি জিরা গুঁড়া',en:'A pinch of cumin powder'}],
      steps:[{bn:'সব সবজি চটকে সুজি ও জিরা মিশিয়ে মাখুন।',en:'Mash the vegetables, mix in the suji and cumin.'},
             {bn:'ছোট চ্যাপ্টা টিক্কি গড়ে নিন — বাচ্চার হাতের তালুর অর্ধেক আকার।',en:'Shape into small flat patties about half the size of baby\'s palm.'},
             {bn:'নন-স্টিক প্যানে সামান্য তেলে দুই পিঠ ৩-৪ মিনিট করে সেঁকে নিন।',en:'Pan-fry 3-4 minutes each side in a little oil.'}],
      texture:{bn:'বাইরে হালকা শক্ত, ভেতরে নরম',en:'Lightly firm outside, soft inside'},
      portion:{bn:'২টি টিক্কি',en:'2 tikkis'},
      nutrition:{bn:'সবজি গ্রহণে অনীহা থাকলে চমৎকার সমাধান; ফাইবার ও ভিটামিন।',en:'A great solution for vegetable refusal; fibre and vitamins.'},
      storage:{bn:'ফ্রিজে ২ দিন।',en:'2 days refrigerated.'},
      freezer:{bn:'কাঁচা টিক্কি আলাদা করে জমিয়ে ১ মাস।',en:'Freeze uncooked patties separated on a tray for 1 month.'},
      reheat:{bn:'প্যানে ঢেকে গরম করুন যাতে ভেতরটা নরম থাকে।',en:'Reheat covered in a pan so the centre stays soft.'},
      allergens:{bn:'সুজি ব্যবহার করলে গম',en:'Wheat if suji is used'},
      choking:{bn:'শক্ত বা মচমচে হলে দেবেন না; ছোট টুকরা করে দিন।',en:'Do not serve if hard or crisp; break into smaller pieces.'} },

    { id:'r-ruti', icon:'🫓', age:9, cats:['finger','breakfast','quick'], time:15,
      name:{bn:'নরম আটার রুটি রোল', en:'Soft Ruti Roll'},
      ing:[{bn:'১/২ কাপ আটা',en:'1/2 cup wheat flour'},{bn:'গরম পানি',en:'Hot water'},{bn:'১/২ চা চামচ ঘি',en:'1/2 tsp ghee'},{bn:'ভেতরে দেওয়ার জন্য মসৃণ ডাল বা সবজি মাখা',en:'Smooth dal or vegetable mash for the filling'}],
      steps:[{bn:'গরম পানি দিয়ে নরম খামির বানিয়ে ১৫ মিনিট ঢেকে রাখুন — গরম পানিতে মাখলে রুটি অনেক নরম হয়।',en:'Make a soft dough with hot water and rest it 15 minutes — hot water makes a much softer ruti.'},
             {bn:'পাতলা করে বেলে অল্প আঁচে সেঁকে ঘি মাখিয়ে নিন।',en:'Roll thin, cook on low heat and brush with ghee.'},
             {bn:'ভেতরে ডাল/সবজি দিয়ে রোল করে আঙুলের সমান টুকরা করুন।',en:'Spread the filling, roll it up and cut into finger-sized pieces.'}],
      texture:{bn:'নরম, ভাঁজযোগ্য — শুকনো নয়',en:'Soft and foldable, never dry'},
      portion:{bn:'১/২ থেকে ১টি রুটি',en:'Half to one ruti'},
      nutrition:{bn:'শক্তি ও কিছু আয়রন; পারিবারিক খাবারে ঢোকার সহজ ধাপ।',en:'Energy and some iron; an easy step into family food.'},
      storage:{bn:'কাপড়ে মুড়ে ১ দিন।',en:'1 day wrapped in a cloth.'},
      freezer:{bn:'কাগজ দিয়ে আলাদা করে ১ মাস।',en:'1 month with paper between each.'},
      reheat:{bn:'ভেজা কাপড়ে মুড়ে ভাপে গরম করুন যাতে নরম থাকে।',en:'Steam wrapped in a damp cloth so it stays soft.'},
      allergens:{bn:'গম (গ্লুটেন)',en:'Wheat (gluten)'},
      choking:{bn:'শক্ত/শুকনো রুটি দেবেন না — মুখে আঠালো দলা তৈরি করতে পারে।',en:'Never serve stiff or dry ruti — it can form a sticky wad in the mouth.'} },

    { id:'r-fruitsalad', icon:'🍓', age:9, cats:['fruit','snack','quick'], time:5,
      name:{bn:'নরম ফলের সালাদ', en:'Soft Fruit Plate'},
      ing:[{bn:'পাকা আম, পেঁপে ও কলা',en:'Ripe mango, papaya and banana'},{bn:'১ টেবিল চামচ টক দই (ঐচ্ছিক)',en:'1 tbsp plain yogurt (optional)'}],
      steps:[{bn:'সব ফল আঙুলের সমান লম্বা টুকরা করুন — গোল চাকতি নয়।',en:'Cut all fruit into finger-length spears, never round coins.'},
             {bn:'পিচ্ছিল ফল সুজিতে গড়িয়ে দিলে ধরতে সুবিধা হয়।',en:'Roll slippery pieces in suji so they are easier to grip.'},
             {bn:'দই আলাদা বাটিতে ডিপ হিসেবে দিন।',en:'Serve the yogurt alongside as a dip.'}],
      texture:{bn:'নরম, রসালো',en:'Soft and juicy'},
      portion:{bn:'৪-৫ টুকরা',en:'4-5 pieces'},
      nutrition:{bn:'ভিটামিন এ ও সি; ভিটামিন সি একই বেলার উদ্ভিজ্জ আয়রনের শোষণ বাড়ায়।',en:'Vitamin A and C; the vitamin C boosts iron absorption from the same meal.'},
      storage:{bn:'সংরক্ষণ নয়, তাজা কাটুন।',en:'Do not store — cut fresh.'},
      freezer:{bn:'প্রযোজ্য নয়।',en:'Not applicable.'},
      reheat:{bn:'প্রযোজ্য নয়।',en:'Not applicable.'},
      allergens:{bn:'দই দিলে দুগ্ধজাত',en:'Dairy if yogurt is served'},
      choking:{bn:'শক্ত ফল (কাঁচা আপেল, শক্ত পেয়ারা) কাঁচা দেবেন না; আঙুর/লিচু লম্বালম্বি চার ভাগ করুন।',en:'Never serve hard raw fruit such as raw apple; quarter grapes and lychee lengthwise.'} },

    /* ---------------- 12+ MONTHS ---------------- */
    { id:'r-beefkeema', icon:'🥩', age:12, cats:['beef','iron','rice'], time:35,
      name:{bn:'নরম গরুর কিমা', en:'Soft Beef Keema'},
      ing:[{bn:'১/২ কাপ মিহি কিমা',en:'1/2 cup fine mince'},{bn:'১টি ছোট পেঁয়াজ, রসুন সামান্য',en:'1 small onion, a little garlic'},{bn:'হলুদ, ১ চা চামচ তেল',en:'Turmeric, 1 tsp oil'},{bn:'১/৪ কাপ মটরশুঁটি বা গাজর',en:'1/4 cup peas or carrot'}],
      steps:[{bn:'পেঁয়াজ-রসুন নরম করে ভেজে কিমা দিয়ে রং বদলানো পর্যন্ত ভাজুন।',en:'Soften the onion and garlic, add the mince and cook until it changes colour.'},
             {bn:'পানি দিয়ে ঢেকে প্রেসার কুকারে ৩-৪ সিটি বা কড়াইয়ে ২৫ মিনিট রান্না করুন যতক্ষণ না একেবারে নরম হয়।',en:'Add water and pressure-cook for 3-4 whistles, or simmer 25 minutes, until completely tender.'},
             {bn:'সবজি দিয়ে আরও ৫ মিনিট রান্না করুন। ঝাল ও লবণ পরিবারের অংশে পরে দিন।',en:'Add the vegetables and cook 5 more minutes. Add chilli and salt to the family portion only, afterwards.'}],
      texture:{bn:'নরম, আঁশমুক্ত কিমা',en:'Soft mince with no stringy fibres'},
      portion:{bn:'৩-৪ টেবিল চামচ',en:'3-4 tablespoons'},
      nutrition:{bn:'আয়রন, জিংক ও বি১২ — রক্তস্বল্পতা প্রতিরোধে গুরুত্বপূর্ণ।',en:'Iron, zinc and B12 — important for preventing anaemia.'},
      storage:{bn:'ফ্রিজে ২ দিন।',en:'2 days refrigerated.'},
      freezer:{bn:'১ মাস।',en:'1 month.'},
      reheat:{bn:'সামান্য পানি দিয়ে ফুটন্ত গরম করুন।',en:'Reheat with a little water until steaming.'},
      allergens:{bn:'নেই',en:'None'},
      choking:{bn:'বড় বা আঁশযুক্ত টুকরা বাদ দিন; গোটা মটরশুঁটি চটকে দিন।',en:'Remove large or stringy pieces; crush whole peas.'} },

    { id:'r-familyplate', icon:'🍽', age:12, cats:['rice','quick','veg'], time:5,
      name:{bn:'পরিবারের প্লেট (মানিয়ে নেওয়া)', en:'Adapted Family Plate'},
      ing:[{bn:'পরিবারের ভাত, ডাল, সবজি, মাছ/মাংস',en:"The family's rice, dal, vegetables, fish or meat"}],
      steps:[{bn:'রান্না শেষে লবণ ও মরিচ দেওয়ার আগে বাচ্চার অংশ তুলে রাখুন — এটিই মূল কৌশল।',en:"Set aside baby's portion before salt and chilli go in — this is the whole technique."},
             {bn:'বড় টুকরা কাঁটাচামচে ভেঙে বা ছোট করে কেটে দিন।',en:'Fork-crush or chop any large pieces.'},
             {bn:'সবাই একসাথে বসে খান — বাচ্চা দেখে দেখেই সবচেয়ে বেশি শেখে।',en:'Eat together — babies learn to eat mostly by watching.'}],
      texture:{bn:'কাটা পারিবারিক খাবার',en:'Chopped family food'},
      portion:{bn:'৩/৪ কাপ',en:'About three-quarters of a cup'},
      nutrition:{bn:'বৈচিত্র্যময় পুষ্টি ও সামাজিক শিক্ষা একসাথে।',en:'Varied nutrition plus social learning at the same time.'},
      storage:{bn:'বাকি অংশ ২৪ ঘণ্টা ফ্রিজে।',en:'Leftovers 24 hours in the fridge.'},
      freezer:{bn:'রান্নার ধরন অনুযায়ী ১ মাস পর্যন্ত।',en:'Up to 1 month depending on the dish.'},
      reheat:{bn:'একবার ফুটন্ত গরম করে ঠান্ডা করে দিন।',en:'Reheat once until steaming, then cool.'},
      allergens:{bn:'রান্নার উপকরণ অনুযায়ী',en:'Depends on the dish'},
      choking:{bn:'গোটা বাদাম, শক্ত সবজি, আঙুর ও পপকর্ন বাদ দিন।',en:'Exclude whole nuts, hard raw vegetables, whole grapes and popcorn.'} },

    { id:'r-pitha', icon:'🍘', age:12, cats:['snack','finger'], time:25,
      name:{bn:'বাচ্চার উপযোগী ভাপা পিঠা', en:'Baby-friendly Steamed Pitha'},
      ing:[{bn:'১/২ কাপ চালের গুঁড়া',en:'1/2 cup rice flour'},{bn:'২ টেবিল চামচ কোরানো নারকেল',en:'2 tbsp grated coconut'},{bn:'১ টেবিল চামচ খেজুর পেস্ট (গুড়ের বদলে)',en:'1 tbsp date paste instead of molasses'},{bn:'সামান্য গরম পানি',en:'A little hot water'}],
      steps:[{bn:'চালের গুঁড়ায় সামান্য গরম পানি ছিটিয়ে ঝরঝরে মাখুন।',en:'Sprinkle hot water into the rice flour and rub to a crumbly mix.'},
             {bn:'ছোট বাটিতে অর্ধেক গুঁড়া, মাঝে নারকেল-খেজুর পুর, উপরে বাকি গুঁড়া দিন।',en:'Half-fill a small bowl with the flour, add the coconut-date filling, top with more flour.'},
             {bn:'ভাপে ১০-১২ মিনিট সেদ্ধ করুন। গুড় বা চিনি ব্যবহার করবেন না।',en:'Steam 10-12 minutes. Use no molasses or sugar.'}],
      texture:{bn:'নরম, ভেজা — শুকনো নয়',en:'Soft and moist, never dry'},
      portion:{bn:'১টি ছোট পিঠা',en:'1 small pitha'},
      nutrition:{bn:'উৎসবের খাবারে বাচ্চাকে অন্তর্ভুক্ত করার স্বাস্থ্যকর উপায়।',en:'A healthier way to include baby in festival food.'},
      storage:{bn:'একই দিনে খেয়ে ফেলুন।',en:'Eat the same day.'},
      freezer:{bn:'সুপারিশ নয়।',en:'Not recommended.'},
      reheat:{bn:'ভাপে ৩ মিনিট।',en:'Steam 3 minutes.'},
      allergens:{bn:'নারকেল',en:'Coconut'},
      choking:{bn:'কোরানো নারকেল মিহি হতে হবে; শুকনো নারকেলের বড় টুকরা নয়।',en:'The coconut must be finely grated — no large dry shards.'} },

    { id:'r-milkshake', icon:'🥤', age:12, cats:['snack','fruit','quick'], time:5,
      name:{bn:'ফল-দুধের স্মুদি (কাপে)', en:'Fruit and Milk Smoothie (in a cup)'},
      ing:[{bn:'১/২ কাপ পূর্ণ ননিযুক্ত দুধ বা দই',en:'1/2 cup whole milk or yogurt'},{bn:'১/২টি কলা ও ২ টেবিল চামচ আম',en:'Half a banana and 2 tbsp mango'},{bn:'১ চা চামচ ভেজানো চিয়া বা মিহি ওটস (ঐচ্ছিক)',en:'1 tsp soaked chia or fine oats (optional)'}],
      steps:[{bn:'সব উপকরণ ব্লেন্ড করে খোলা কাপ বা স্ট্র কাপে দিন।',en:'Blend everything and serve in an open cup or straw cup.'},
             {bn:'দিনে ১ বারের বেশি নয় — বেশি তরল ক্যালরি খাবারে অরুচি তৈরি করে।',en:'No more than once a day — too many liquid calories suppress appetite for food.'}],
      texture:{bn:'ঘন তরল',en:'Thick liquid'},
      portion:{bn:'৮০-১২০ মি.লি.',en:'80-120 ml'},
      nutrition:{bn:'ক্যালসিয়াম, প্রোটিন ও ফলের ভিটামিন।',en:'Calcium, protein and fruit vitamins.'},
      storage:{bn:'তাজা পরিবেশন করুন।',en:'Serve fresh.'},
      freezer:{bn:'প্রযোজ্য নয়।',en:'Not applicable.'},
      reheat:{bn:'প্রযোজ্য নয়।',en:'Not applicable.'},
      allergens:{bn:'দুগ্ধজাত',en:'Dairy'},
      choking:{bn:'বোতলে নয়, কাপে দিন — বোতলে দীর্ঘসময় চুষলে দাঁতের ক্ষয় হয়।',en:'Serve in a cup, not a bottle — prolonged bottle sipping causes tooth decay.'} },
  ];

  let filt = { age:0, cat:'all' };

  function buildFilters(){
    const ageBox = document.getElementById('rc-age-filters');
    const catBox = document.getElementById('rc-cat-filters');
    if(!ageBox) return;

    const ages = [
      {v:0,  l:{bn:'সব বয়স', en:'All ages'}},
      {v:6,  l:{bn:'৬+ মাস', en:'6+ mo'}},
      {v:8,  l:{bn:'৮+ মাস', en:'8+ mo'}},
      {v:9,  l:{bn:'৯+ মাস', en:'9+ mo'}},
      {v:12, l:{bn:'১২+ মাস', en:'12+ mo'}},
    ];
    ageBox.innerHTML = '';
    ages.forEach(a => {
      const b = document.createElement('button');
      b.className = filt.age === a.v ? 'active' : '';
      b.textContent = Util.t(a.l);
      b.onclick = () => { filt.age = a.v; buildFilters(); render(); };
      ageBox.appendChild(b);
    });

    catBox.innerHTML = '';
    CATS.forEach(c => {
      const b = document.createElement('button');
      b.className = filt.cat === c.id ? 'active' : '';
      b.textContent = c.icon + ' ' + Util.t(c.label);
      b.onclick = () => { filt.cat = c.id; buildFilters(); render(); };
      catBox.appendChild(b);
    });
  }

  /* Age filter is a "suitable from" filter: picking 9+ shows everything
     safe at 9 months and below, not only recipes that start at exactly 9. */
  function matches(r){
    if(filt.age && r.age > filt.age) return false;
    if(filt.cat !== 'all' && r.cats.indexOf(filt.cat) < 0) return false;
    return true;
  }

  function render(){
    const grid = document.getElementById('recipe-grid');
    const emptyEl = document.getElementById('recipe-empty');
    if(!grid) return;
    const list = R.filter(matches);
    grid.innerHTML = '';
    if(!list.length){
      emptyEl.innerHTML = Util.empty('🍲',
        Util.tt('এই ফিল্টারে কোনো রেসিপি নেই','No recipes match these filters'),
        Util.tt('বয়স বা ক্যাটাগরি বদলে আবার দেখুন — নতুন রেসিপি নিয়মিত যোগ করা হচ্ছে।','Try a different age or category — more recipes are added regularly.'));
      return;
    }
    emptyEl.innerHTML = '';
    list.forEach(r => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.tabIndex = 0;
      card.setAttribute('role','button');
      card.onclick = () => open(r.id);
      card.onkeypress = e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(r.id); } };
      card.innerHTML = `
        <div class="icon">${r.icon}</div>
        <h3>${Util.t(r.name)}</h3>
        <div class="rc-sub">${r.cats.slice(0,2).map(c=>{
          const cc = CATS.find(x=>x.id===c); return cc ? Util.t(cc.label) : c;
        }).join(' · ')}</div>
        <div class="chip-row">
          <span class="chip leaf">${Util.num(r.age)}+ ${Util.tt('মাস','mo')}</span>
          <span class="chip mustard">⏱ ${Util.num(r.time)} ${Util.tt('মিনিট','min')}</span>
          ${Util.t(r.allergens) !== Util.tt('নেই','None') ? `<span class="chip alert">${Util.tt('অ্যালার্জেন','Allergen')}</span>` : ''}
        </div>`;
      grid.appendChild(card);
    });
  }

  /* Recipe detail reuses the existing modal shell so the look is identical
     to the food-database modal the app already ships with. */
  function open(id){
    const r = R.find(x => x.id === id);
    if(!r) return;
    const m = document.getElementById('modal');
    m.classList.add('lg');
    m.innerHTML = `
      <button class="close" onclick="closeModal()" aria-label="${Util.tt('বন্ধ','Close')}">&times;</button>
      <div class="icon-lg">${r.icon}</div>
      <h3>${Util.t(r.name)}</h3>
      <div class="en-name">${Util.num(r.age)}+ ${Util.tt('মাস','months')} · ⏱ ${Util.num(r.time)} ${Util.tt('মিনিট','min')}</div>
      <div class="row">
        <div class="k">${Util.tt('উপকরণ','Ingredients')}</div>
        ${Util.list(r.ing)}
      </div>
      <div class="row">
        <div class="k">${Util.tt('প্রস্তুত প্রণালী','Preparation steps')}</div>
        <ol class="steps">${r.steps.map(s=>`<li>${Util.t(s)}</li>`).join('')}</ol>
      </div>
      <div class="row">
        <div class="k">${Util.tt('টেক্সচার','Texture')}</div><p>${Util.t(r.texture)}</p>
      </div>
      <div class="row">
        <div class="k">${Util.tt('পরিবেশন পরিমাণ','Serving size')}</div><p>${Util.t(r.portion)}</p>
      </div>
      <div class="row">
        <div class="k">${Util.tt('পুষ্টিগুণ','Nutritional highlights')}</div><p>${Util.t(r.nutrition)}</p>
      </div>
      <div class="row">
        <div class="k">${Util.tt('সংরক্ষণ','Storage')}</div><p>${Util.t(r.storage)}</p>
      </div>
      <div class="row">
        <div class="k">${Util.tt('ফ্রিজারে রাখা','Freezing')}</div><p>${Util.t(r.freezer)}</p>
      </div>
      <div class="row">
        <div class="k">${Util.tt('গরম করার নিয়ম','Reheating')}</div><p>${Util.t(r.reheat)}</p>
      </div>
      <div class="row warn">
        <div class="k">${Util.tt('অ্যালার্জেন','Allergens')}</div><p>${Util.t(r.allergens)}</p>
      </div>
      <div class="row warn">
        <div class="k">${Util.tt('⚠ গলায় আটকানো রোধে','⚠ Choking precautions')}</div><p>${Util.t(r.choking)}</p>
      </div>
      <p class="v-small" style="margin-top:16px;">${Util.tt('সবসময় সোজা হয়ে বসিয়ে, সার্বক্ষণিক তদারকিতে খাওয়ান। খাবার পরিবেশনের আগে নিজে তাপমাত্রা পরীক্ষা করুন।','Always feed sitting upright with constant supervision, and test the temperature yourself before serving.')}</p>
    `;
    document.getElementById('overlay').classList.add('open');
  }

  function init(){ buildFilters(); render(); }
  LANG_HOOKS.push(function(){ buildFilters(); render(); });

  return { init, open, R, CATS };
})();
