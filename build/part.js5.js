
/* =====================================================================
   MODULES 7 & 8 — SHOPPING GUIDE + RETAILER DIRECTORY
   Prices are indicative Bangladeshi retail ranges and move with the
   market, so they are shown as ranges and clearly labelled approximate.
   Priority: 5 = essential, 1 = nice to have.
   ===================================================================== */
const Shopping = (function(){

  /* Formats a [min,max] taka range in the active language, so the digits
     switch between Bengali and Western numerals along with everything else.
     Prices are stored as plain numbers to make them easy to update. */
  function taka(range){
    const fmt = n => Util.num(n.toLocaleString('en-US'));
    return '৳' + fmt(range[0]) + ' – ৳' + fmt(range[1]);
  }

  /* Gear catalogue. `img` is an emoji standing in for a product photo;
     swap the .gear-img contents for <img src="..."> when you have assets.
     `price` is an approximate Bangladeshi retail range in taka. */
  const GEAR = [
    { id:'highchair', img:'🪑', pri:5, price:[2000,12000],
      name:{bn:'হাইচেয়ার',en:'High chair'},
      purpose:{bn:'খাওয়ার সময় বাচ্চাকে সোজা, স্থির ও নিরাপদভাবে বসানো।',en:'Seats baby upright, stable and secure during meals.'},
      why:{bn:'সোজা হয়ে বসা গলায় আটকানোর ঝুঁকি কমানোর সবচেয়ে গুরুত্বপূর্ণ একক উপায়। পা রাখার জায়গা (footrest) আছে এমন চেয়ার বেছে নিন — পা ঝুলে থাকলে বাচ্চার শরীরের ভারসাম্য নষ্ট হয় ও কম খায়।',en:'Sitting fully upright is the single biggest factor in reducing choking risk. Choose one with a footrest — dangling feet destabilise the core and reduce intake.'},
      when:{bn:'সলিড শুরুর দিন থেকেই, ~৬ মাস',en:'From day one of solids, around 6 months'},
      qty:{bn:'১টি',en:'1'},
      clean:{bn:'প্রতিদিন ট্রে খুলে গরম সাবান পানিতে ধুয়ে ফেলুন; সপ্তাহে একবার সিট কভার ও ফাঁকফোকর পরিষ্কার করুন (এখানেই খাবার জমে ছত্রাক হয়)।',en:'Detach and wash the tray in hot soapy water daily; once a week clean the seat cover and every crevice, where food collects and moulds.'},
      alt:{bn:'বাজেট বিকল্প: শক্ত কাঠের চেয়ারে বেঁধে বসানোর বুস্টার সিট, বা মেঝেতে বসার জন্য ছোট টেবিল-চেয়ার সেট।',en:'Budget alternative: a strap-on booster on a sturdy dining chair, or a small floor-level table and chair set.'} },

    { id:'booster', img:'💺', pri:4, price:[1200,4000],
      name:{bn:'পোর্টেবল বুস্টার সিট',en:'Portable booster seat'},
      purpose:{bn:'সাধারণ চেয়ারে বেঁধে বাচ্চাকে টেবিলের উচ্চতায় বসানো।',en:'Straps to a normal chair to bring baby up to table height.'},
      why:{bn:'ছোট বাসায় জায়গা বাঁচায়, আত্মীয়ের বাড়ি বা রেস্টুরেন্টে নিয়ে যাওয়া যায়। অনেক পরিবারের জন্য এটিই একমাত্র চেয়ার হিসেবে যথেষ্ট।',en:'Saves space in a small flat and travels to relatives\' homes or restaurants. For many families it is the only seat they need.'},
      when:{bn:'~৬ মাস থেকে (নিজে বসতে পারলে)',en:'From about 6 months, once baby sits unaided'},
      qty:{bn:'১টি',en:'1'},
      clean:{bn:'ভেজা কাপড়ে মুছে শুকিয়ে নিন; স্ট্র্যাপ খুলে আলাদা ধুয়ে ফেলুন।',en:'Wipe down and dry; detach and wash the straps separately.'},
      alt:{bn:'হাইচেয়ার থাকলে এটি ঐচ্ছিক — শুধু ভ্রমণের জন্য কিনুন।',en:'Optional if you already have a highchair — buy it only for travel.'} },

    { id:'siliconespoon', img:'🥄', pri:5, price:[150,600],
      name:{bn:'সিলিকন চামচ',en:'Silicone spoon'},
      purpose:{bn:'নরম মাথার চামচ যা মাড়ি ও নতুন দাঁতে আঘাত করে না।',en:'A soft-tipped spoon that will not bruise gums or new teeth.'},
      why:{bn:'সলিড শুরুর প্রথম চামচ হিসেবে সবচেয়ে নিরাপদ। মাঝারি গভীর ও সরু বাটির চামচ বেছে নিন — বেশি চওড়া চামচ ছোট মুখে ঢোকে না।',en:'The safest first spoon. Choose a shallow, narrow bowl — wide spoons simply do not fit a small mouth.'},
      when:{bn:'৬ মাস থেকে',en:'From 6 months'},
      qty:{bn:'৩-৪টি (একটি বাচ্চার হাতে, একটি আপনার হাতে)',en:'3-4 — one for baby to hold, one for you'},
      clean:{bn:'গরম সাবান পানিতে ধুয়ে ভালোভাবে শুকান; সপ্তাহে একবার ৫ মিনিট ফুটিয়ে নিন। রঙ বদলে গেলে বা কেটে গেলে বদলে ফেলুন।',en:'Wash in hot soapy water and dry fully; boil for 5 minutes weekly. Replace if it discolours or splits.'},
      alt:{bn:'সিলিকনের বদলে নরম প্রান্তের প্লাস্টিক চামচও চলে (BPA-মুক্ত হতে হবে)।',en:'A soft-edged BPA-free plastic spoon works too.'} },

    { id:'metalspoon', img:'🍴', pri:3, price:[100,400],
      name:{bn:'ছোট ধাতব চামচ',en:'Small metal spoon'},
      purpose:{bn:'বড় বাচ্চার জন্য টেকসই, তাপ-সহনশীল চামচ।',en:'A durable, heat-tolerant spoon for an older baby.'},
      why:{bn:'১২ মাসের পর বাচ্চা যখন নিজে খেতে শেখে, ধাতব চামচ পরিবারের চামচের মতোই অনুভূত হয় এবং সহজে বাঁকে না। দাঁত ওঠার পর ব্যবহার করুন।',en:'Once baby self-feeds after 12 months, a metal spoon feels like everyone else\'s and does not bend. Use after teeth appear.'},
      when:{bn:'১২ মাস থেকে',en:'From 12 months'},
      qty:{bn:'২টি',en:'2'},
      clean:{bn:'স্বাভাবিকভাবে ধুয়ে নিন; মরিচা পড়লে বাদ দিন।',en:'Wash normally; discard at any sign of rust.'},
      alt:{bn:'বাসার ছোট চা-চামচই যথেষ্ট।',en:'A small household teaspoon does the job.'} },

    { id:'woodspoon', img:'🥢', pri:2, price:[200,600],
      name:{bn:'কাঠের চামচ',en:'Wooden spoon'},
      purpose:{bn:'প্লাস্টিক-মুক্ত, প্রাকৃতিক বিকল্প।',en:'A plastic-free natural alternative.'},
      why:{bn:'তাপ ধরে রাখে না, দেখতে সুন্দর — তবে ফেটে গেলে ফাঁকে ব্যাকটেরিয়া জমতে পারে, তাই নিয়মিত পরীক্ষা করুন।',en:'Does not hold heat and looks lovely, but cracks harbour bacteria, so inspect it regularly.'},
      when:{bn:'৬ মাস থেকে',en:'From 6 months'},
      qty:{bn:'১-২টি',en:'1-2'},
      clean:{bn:'হাতে ধুয়ে সাথে সাথে শুকান; পানিতে ভিজিয়ে রাখবেন না, ডিশওয়াশারে দেবেন না। মাসে একবার খাদ্য-উপযোগী তেল মাখান।',en:'Hand wash and dry immediately; never soak or put in a dishwasher. Oil with food-safe oil monthly.'},
      alt:{bn:'সিলিকন চামচই বেশি ব্যবহারিক — এটি ঐচ্ছিক।',en:'Silicone is more practical; this is optional.'} },

    { id:'suctionbowl', img:'🥣', pri:5, price:[400,1500],
      name:{bn:'সাকশন বাটি',en:'Suction bowl'},
      purpose:{bn:'ট্রেতে আটকে থাকা বাটি যা বাচ্চা সহজে ছুঁড়ে ফেলতে পারে না।',en:'A bowl that grips the tray so baby cannot fling it.'},
      why:{bn:'৮-১২ মাসে বাটি ছুঁড়ে ফেলা একটি স্বাভাবিক ধাপ। সাকশন বাটি এই পর্যায়ে দিনে অন্তত একবার আপনার মেঝে বাঁচাবে। মসৃণ, সমতল পৃষ্ঠেই শুধু ভালোভাবে আটকায়।',en:'Throwing bowls is a normal 8-12 month phase. A suction bowl will save your floor at least once a day through it. It only grips well on a smooth flat surface.'},
      when:{bn:'~৮ মাস থেকে, যখন ছোঁড়াছুঁড়ি শুরু হয়',en:'From about 8 months, when throwing starts'},
      qty:{bn:'২টি',en:'2'},
      clean:{bn:'সাকশন রিংয়ের নিচে পানি জমে — প্রতিবার আলাদা করে খুলে ধুয়ে শুকিয়ে নিন, নয়তো ছত্রাক জন্মায়।',en:'Water collects under the suction ring — detach, wash and dry it every time or mould will grow.'},
      alt:{bn:'সাধারণ ভারী স্টিলের বাটি + ধৈর্য।',en:'A heavy steel bowl plus patience.'} },

    { id:'siliconebowl', img:'🍚', pri:3, price:[300,900],
      name:{bn:'সিলিকন বাটি',en:'Silicone bowl'},
      purpose:{bn:'হালকা, না-ভাঙা বাটি।',en:'Lightweight, unbreakable bowl.'},
      why:{bn:'পড়ে গেলে ভাঙে না, ফ্রিজ ও মাইক্রোওয়েভে ব্যবহারযোগ্য।',en:'Survives drops and works in fridge and microwave.'},
      when:{bn:'৬ মাস থেকে',en:'From 6 months'}, qty:{bn:'২টি',en:'2'},
      clean:{bn:'গরম পানিতে ধুয়ে শুকান; তেলচিটে ভাব থাকলে বেকিং সোডা দিয়ে ঘষুন।',en:'Wash in hot water; scrub with baking soda if it feels greasy.'},
      alt:{bn:'বাসার ছোট স্টিলের বাটি।',en:'A small household steel bowl.'} },

    { id:'siliconeplate', img:'🍽', pri:3, price:[500,1600],
      name:{bn:'সিলিকন প্লেট (ভাগ করা)',en:'Divided silicone plate'},
      purpose:{bn:'বিভিন্ন খাবার আলাদা খোপে পরিবেশন।',en:'Serves different foods in separate compartments.'},
      why:{bn:'খুঁতখুঁতে বাচ্চারা খাবার মিশে গেলে প্রায়ই প্রত্যাখ্যান করে — আলাদা খোপ গ্রহণযোগ্যতা বাড়ায়। BLW-তে একসাথে ২-৩টি খাবার দেওয়ার জন্য আদর্শ।',en:'Picky eaters often reject food that touches — separate wells raise acceptance. Ideal for offering 2-3 BLW foods at once.'},
      when:{bn:'~৯ মাস থেকে',en:'From about 9 months'}, qty:{bn:'১-২টি',en:'1-2'},
      clean:{bn:'খোপের কোণায় খাবার জমে — ব্রাশ দিয়ে পরিষ্কার করুন।',en:'Food packs into the corners — use a brush.'},
      alt:{bn:'হাইচেয়ারের ট্রেতে সরাসরি খাবার দেওয়াই BLW-তে সবচেয়ে সাধারণ ও সাশ্রয়ী।',en:'Serving straight onto the highchair tray is the commonest and cheapest BLW approach.'} },

    { id:'opencup', img:'🥛', pri:5, price:[150,600],
      name:{bn:'ছোট খোলা কাপ',en:'Small open cup'},
      purpose:{bn:'পানি খাওয়া শেখানোর প্রধান কাপ।',en:'The main cup for learning to drink water.'},
      why:{bn:'স্পিচ থেরাপিস্ট ও ডেন্টিস্টরা খোলা কাপকেই সবচেয়ে ভালো বলেন — এটি ঠোঁট ও জিভের সঠিক পেশি ব্যবহার শেখায় এবং দাঁতের গঠনে সহায়ক। ৬ মাস থেকেই শুরু করা যায়, ২-৩ চুমুক দিয়ে।',en:'Speech therapists and dentists rate the open cup highest — it teaches correct lip and tongue muscle patterns and supports dental development. Start at 6 months with 2-3 sips.'},
      when:{bn:'৬ মাস থেকে',en:'From 6 months'}, qty:{bn:'২টি',en:'2'},
      clean:{bn:'প্রতিদিন ধুয়ে শুকান।',en:'Wash and dry daily.'},
      alt:{bn:'ছোট শট গ্লাস বা বাসার ছোট কাপই চমৎকার কাজ করে — কিছুই কিনতে হবে না।',en:'A small shot glass or any small household cup works perfectly — you may not need to buy anything.'} },

    { id:'strawcup', img:'🧃', pri:4, price:[300,1200],
      name:{bn:'স্ট্র কাপ',en:'Straw cup'},
      purpose:{bn:'ঢাকনাযুক্ত কাপ, ভ্রমণ ও বাইরে ব্যবহারের জন্য।',en:'A lidded cup for travel and out-and-about use.'},
      why:{bn:'সিপি কাপের তুলনায় স্ট্র কাপ মুখের পেশির বিকাশে ভালো এবং দাঁতের জন্য কম ক্ষতিকর। বাসায় খোলা কাপ, বাইরে স্ট্র কাপ — এই সমন্বয়টি বেশিরভাগ পরিবারের জন্য আদর্শ।',en:'Better for oral-muscle development and kinder to teeth than a spouted sippy. Open cup at home, straw cup out — that combination suits most families.'},
      when:{bn:'~৯-১২ মাস থেকে',en:'From about 9-12 months'}, qty:{bn:'১-২টি',en:'1-2'},
      clean:{bn:'স্ট্র ও ভালভ আলাদা খুলে সরু ব্রাশ দিয়ে পরিষ্কার করুন — ভেতরে ছত্রাক জমা সবচেয়ে সাধারণ সমস্যা।',en:'Detach the straw and valve and clean with a narrow brush — hidden mould inside is the commonest problem.'},
      alt:{bn:'সাধারণ কাপ ও একটি পরিষ্কার স্ট্র।',en:'A normal cup and a clean straw.'} },

    { id:'sippy', img:'🍼', pri:2, price:[250,900],
      name:{bn:'সিপি কাপ (স্পাউট)',en:'Sippy cup (spout)'},
      purpose:{bn:'ঢাকনাযুক্ত, চুষে খাওয়ার কাপ।',en:'A lidded cup drunk by sucking on a spout.'},
      why:{bn:'ছিটকে পড়া কমায়, তবে ডেন্টিস্টরা দীর্ঘমেয়াদে এটি নিরুৎসাহিত করেন — চোষার ভঙ্গি বোতলের মতোই এবং দীর্ঘ ব্যবহার দাঁতের গঠন ও কথা বলার বিকাশে প্রভাব ফেলতে পারে। ব্যবহার করলে স্বল্পমেয়াদি সেতু হিসেবে ব্যবহার করুন।',en:'Reduces spills, but dentists discourage prolonged use — the sucking action mirrors a bottle and long-term use can affect dental and speech development. Treat it as a short-term bridge if you use it at all.'},
      when:{bn:'~৯ মাস (ঐচ্ছিক ধাপ)',en:'Around 9 months, an optional step'}, qty:{bn:'১টি',en:'1'},
      clean:{bn:'ভালভ খুলে প্রতিদিন ধুয়ে শুকান।',en:'Remove the valve and wash daily.'},
      alt:{bn:'সরাসরি স্ট্র কাপে যাওয়াই বেশি সুপারিশকৃত।',en:'Going straight to a straw cup is the more recommended route.'} },

    { id:'trainer360', img:'🥤', pri:2, price:[400,1400],
      name:{bn:'৩৬০° ট্রেনিং কাপ',en:'360 training cup'},
      purpose:{bn:'কিনারার যেকোনো দিক থেকে খোলা কাপের মতো পান করা যায়।',en:'Drunk from any point on the rim, like an open cup.'},
      why:{bn:'খোলা কাপের ভঙ্গি নকল করে কিন্তু কাত হলে পড়ে না। ভালো মধ্যবর্তী সমাধান, তবে বাচ্চার একটু বেশি চোষার শক্তি লাগে।',en:'Mimics open-cup mechanics without spilling when tipped. A good middle ground, though it needs a bit more suction from baby.'},
      when:{bn:'~১০-১২ মাস',en:'Around 10-12 months'}, qty:{bn:'১টি',en:'1'},
      clean:{bn:'সিলিকন ভালভ রিং খুলে প্রতিদিন ধুয়ে ফেলুন।',en:'Remove the silicone valve ring and wash it daily.'},
      alt:{bn:'ঐচ্ছিক — খোলা কাপ ও স্ট্র কাপ থাকলে প্রয়োজন নেই।',en:'Optional if you already have an open cup and a straw cup.'} },

    { id:'fork', img:'🍴', pri:3, price:[150,500],
      name:{bn:'বাচ্চাদের কাঁটাচামচ',en:'Toddler fork'},
      purpose:{bn:'ভোঁতা প্রান্তের ছোট কাঁটাচামচ।',en:'A small fork with blunt tines.'},
      why:{bn:'কাঁটাচামচ দিয়ে খাবার গেঁথে তোলা শেখা হাতের সূক্ষ্ম দক্ষতার একটি বড় ধাপ; নরম ফল ও সেদ্ধ সবজি দিয়ে শুরু করান।',en:'Learning to spear food is a real fine-motor milestone; start with soft fruit and boiled vegetables.'},
      when:{bn:'~১২ মাস থেকে',en:'From about 12 months'}, qty:{bn:'২টি',en:'2'},
      clean:{bn:'ফাঁকে খাবার জমে — ব্রাশ দিয়ে ধুয়ে নিন।',en:'Food lodges between the tines — brush them clean.'},
      alt:{bn:'ছোট চা-চামচ দিয়েই শুরু করা যায়।',en:'Start with a small teaspoon instead.'} },

    { id:'siliconebib', img:'🦺', pri:5, price:[200,800],
      name:{bn:'পকেটওয়ালা সিলিকন বিব',en:'Silicone bib with pocket'},
      purpose:{bn:'পড়ে যাওয়া খাবার ধরে রাখে ও জামা বাঁচায়।',en:'Catches dropped food and protects clothes.'},
      why:{bn:'BLW-এর সবচেয়ে কার্যকর একক জিনিস। সামনের পকেট প্রতিদিন প্রচুর খাবার ধরে রাখে এবং কল দিয়ে ধুলেই পরিষ্কার হয়ে যায় — কাপড়ের বিবের মতো ধুয়ে শুকাতে হয় না।',en:'The single most effective BLW purchase. The front pocket catches a remarkable amount and rinses clean under a tap — no washing and drying like cloth bibs.'},
      when:{bn:'সলিড শুরুর দিন থেকে',en:'From day one of solids'}, qty:{bn:'২-৩টি',en:'2-3'},
      clean:{bn:'প্রতিবার কল দিয়ে ধুয়ে ঝুলিয়ে শুকান; সপ্তাহে একবার গরম সাবান পানিতে ভিজিয়ে রাখুন।',en:'Rinse after every meal and hang to dry; soak in hot soapy water weekly.'},
      alt:{bn:'পুরনো জামা উল্টো করে পরানো, বা প্লাস্টিক কভারসহ কাপড়ের বিব।',en:'An old shirt worn backwards, or a cloth bib with a plastic backing.'} },

    { id:'waterproofbib', img:'👕', pri:3, price:[150,600],
      name:{bn:'ফুল-স্লিভ ওয়াটারপ্রুফ বিব',en:'Long-sleeved waterproof bib'},
      purpose:{bn:'হাতসহ পুরো শরীর ঢাকে।',en:'Covers arms and torso completely.'},
      why:{bn:'খিচুড়ি বা দইয়ের মতো তরল খাবারে হাতা পর্যন্ত মাখামাখি হয়। শীতকালে বা ভালো জামা পরা অবস্থায় বিশেষভাবে কাজে লাগে।',en:'Wet foods like khichuri or yogurt travel up the sleeves. Especially useful in winter or over good clothes.'},
      when:{bn:'~৭ মাস থেকে',en:'From about 7 months'}, qty:{bn:'২টি',en:'2'},
      clean:{bn:'ধুয়ে ঝুলিয়ে শুকান; ড্রায়ারে দেবেন না।',en:'Rinse and hang dry; keep it out of a tumble dryer.'},
      alt:{bn:'ঘরে গরম থাকলে শুধু ডায়াপার পরিয়ে খাওয়ানো — পরিষ্কার করা সবচেয়ে সহজ।',en:'If the room is warm, feed in just a nappy — by far the easiest cleanup.'} },

    { id:'foodscissors', img:'✂️', pri:4, price:[200,700],
      name:{bn:'খাবার কাটার কাঁচি',en:'Food scissors'},
      purpose:{bn:'প্লেটেই খাবার ছোট করে কাটা।',en:'Cuts food into safe pieces right on the plate.'},
      why:{bn:'বাইরে বা আত্মীয়ের বাড়িতে ছুরি-চপিং বোর্ড পাওয়া যায় না — কাঁচি ব্যাগে থাকলে যেকোনো পারিবারিক খাবার সাথে সাথে বাচ্চার উপযোগী করে নেওয়া যায়।',en:'Out of the house there is no knife or chopping board — scissors in the bag let you make any family dish baby-safe on the spot.'},
      when:{bn:'~৯ মাস থেকে',en:'From about 9 months'}, qty:{bn:'১টি',en:'1'},
      clean:{bn:'খুলে গরম সাবান পানিতে ধুয়ে সম্পূর্ণ শুকিয়ে নিন যাতে জোড়ায় মরিচা না পড়ে।',en:'Separate the blades, wash in hot soapy water and dry fully so the pivot does not rust.'},
      alt:{bn:'পরিষ্কার রান্নাঘরের কাঁচি একটি কেসে রেখে দিন।',en:'A clean pair of kitchen scissors kept in a case.'} },

    { id:'storage', img:'🫙', pri:5, price:[300,1200],
      name:{bn:'খাবার সংরক্ষণের কনটেইনার',en:'Baby food storage containers'},
      purpose:{bn:'রান্না করা খাবার ছোট ভাগে সংরক্ষণ।',en:'Stores cooked food in small portions.'},
      why:{bn:'ব্যাচ রান্না বাচ্চার খাবার সামলানোর মূল কৌশল — একবার রান্না করে ৪-৬ বেলার খাবার সংরক্ষণ করলে ব্যস্ত দিনেও ঘরে তৈরি খাবার দেওয়া সম্ভব হয়।',en:'Batch cooking is the core strategy — one cook-up stored as 4-6 meals means home food even on a chaotic day.'},
      when:{bn:'সলিড শুরুর দিন থেকে',en:'From day one of solids'}, qty:{bn:'৬-৮টি ছোট',en:'6-8 small containers'},
      clean:{bn:'গরম সাবান পানিতে ধুয়ে সম্পূর্ণ শুকিয়ে বন্ধ করুন; ঢাকনার সিল আলাদা খুলে ধুয়ে নিন।',en:'Wash hot and dry completely before closing; remove and wash the lid seal separately.'},
      alt:{bn:'ছোট কাচের বয়াম বা পরিষ্কার করা দইয়ের কাপ।',en:'Small glass jars or washed-out yogurt pots.'} },

    { id:'freezertray', img:'🧊', pri:4, price:[300,1000],
      name:{bn:'ঢাকনাযুক্ত ফ্রিজার ট্রে',en:'Lidded freezer tray'},
      purpose:{bn:'পিউরি ও খিচুড়ি এক-বেলার কিউব আকারে জমানো।',en:'Freezes purée and khichuri as single-meal cubes.'},
      why:{bn:'প্রতিটি কিউব ~৩০ মি.লি. — ঠিক এক বেলার পরিমাণ। ঢাকনা থাকলে ফ্রিজের গন্ধ খাবারে ঢোকে না।',en:'Each cube is about 30 ml — exactly one serving. A lid keeps freezer odours out of the food.'},
      when:{bn:'৬ মাস থেকে (বিশেষত পিউরি দিলে)',en:'From 6 months, especially if you purée'}, qty:{bn:'২টি',en:'2'},
      clean:{bn:'গরম পানিতে ধুয়ে শুকান; জমানো কিউব ২৪ ঘণ্টার মধ্যে ব্যাগে সরিয়ে তারিখ লিখে রাখুন।',en:'Wash in hot water and dry; transfer frozen cubes to a dated bag within 24 hours.'},
      alt:{bn:'সাধারণ আইস কিউব ট্রে + ক্লিং ফিল্ম।',en:'A normal ice-cube tray with cling film.'} },

    { id:'snackcup', img:'🥨', pri:3, price:[200,700],
      name:{bn:'স্ন্যাক কনটেইনার',en:'Snack container'},
      purpose:{bn:'ঢাকনার ফ্ল্যাপ দিয়ে বাচ্চা নিজে হাত ঢুকিয়ে নাশতা নিতে পারে, উল্টে গেলেও পড়ে না।',en:'Flexible lid flaps let baby reach in without the contents spilling if it tips.'},
      why:{bn:'বাইরে বেরোনোর সময় ও গাড়িতে কাজে লাগে; হাত ঢোকানোর অনুশীলনও হয়।',en:'Useful when out and in the car, and it gives good hand practice.'},
      when:{bn:'~১০ মাস থেকে',en:'From about 10 months'}, qty:{bn:'১-২টি',en:'1-2'},
      clean:{bn:'ফ্ল্যাপ খুলে ধুয়ে সম্পূর্ণ শুকান।',en:'Remove the flap insert, wash and dry fully.'},
      alt:{bn:'ছোট টিফিন বাক্স।',en:'A small tiffin box.'} },

    { id:'fruitfeeder', img:'🍓', pri:3, price:[150,500],
      name:{bn:'ফ্রুট ফিডার',en:'Fruit feeder / teething feeder'},
      purpose:{bn:'জালের থলিতে ফল রেখে নিরাপদে চোষা।',en:'Holds fruit in a mesh pouch for safe sucking.'},
      why:{bn:'দাঁত ওঠার সময় ঠান্ডা ফল দেওয়ার নিরাপদ উপায় এবং প্রথমবার নতুন ফল পরিচয় করানোর সময় বাবা-মায়ের দুশ্চিন্তা কমায়।',en:'A safe way to offer chilled fruit while teething, and it eases parental nerves when introducing a new fruit.'},
      when:{bn:'~৬-৭ মাস',en:'Around 6-7 months'}, qty:{bn:'১টি',en:'1'},
      clean:{bn:'জাল অংশ খুলে সাথে সাথে ধুয়ে ফেলুন — ফলের অবশিষ্ট জালে আটকে দ্রুত নষ্ট হয়। রঙ বদলালে জাল বদলে ফেলুন।',en:'Detach and wash the mesh immediately — fruit residue lodges and spoils fast. Replace the mesh when it discolours.'},
      alt:{bn:'সরাসরি বড় নরম টুকরা হাতে দেওয়া (তদারকিতে) — এটিই BLW-এর মূল পদ্ধতি।',en:'Simply handing over a large soft piece under supervision, which is the core BLW approach anyway.'} },

    { id:'crinkle', img:'🌊', pri:2, price:[100,400],
      name:{bn:'ক্রিঙ্কল কাটার',en:'Crinkle cutter'},
      purpose:{bn:'ঢেউ খেলানো প্রান্তে সবজি-ফল কাটা।',en:'Cuts vegetables and fruit with a wavy edge.'},
      why:{bn:'BLW-তে অপ্রত্যাশিতভাবে কার্যকর — ঢেউ খেলানো খাঁজ পিচ্ছিল খাবারে (অ্যাভোকাডো, আম, সেদ্ধ আলু) বাচ্চার আঙুলের গ্রিপ ধরার জায়গা তৈরি করে।',en:'Unexpectedly useful for BLW — the ridges give little fingers something to grip on slippery foods like avocado, mango and boiled potato.'},
      when:{bn:'~৬-৯ মাস',en:'Around 6-9 months'}, qty:{bn:'১টি',en:'1'},
      clean:{bn:'খাঁজে খাবার জমে — ব্রাশ দিয়ে ধুয়ে শুকিয়ে রাখুন।',en:'Food packs into the grooves — brush clean and dry.'},
      alt:{bn:'সাধারণ ছুরি দিয়ে কেটে সুজি বা গুঁড়া চিড়ায় গড়িয়ে নিলেও গ্রিপ ভালো হয়।',en:'A normal knife plus rolling the piece in suji or crushed chira gives similar grip.'} },

    { id:'cutters', img:'⭐', pri:1, price:[100,400],
      name:{bn:'খাবার কাটার ছাঁচ (কুকি কাটার)',en:'Food cutters / shape cutters'},
      purpose:{bn:'রুটি, ফল বা প্যানকেক মজার আকৃতিতে কাটা।',en:'Cuts ruti, fruit or pancakes into fun shapes.'},
      why:{bn:'খাবার প্রত্যাখ্যানের পর্যায়ে নতুনত্ব গ্রহণযোগ্যতা বাড়াতে পারে; তবে এটি সম্পূর্ণ ঐচ্ছিক।',en:'Novelty can lift acceptance during a refusal phase, but it is entirely optional.'},
      when:{bn:'~১২ মাস+',en:'From about 12 months'}, qty:{bn:'১ সেট',en:'1 set'},
      clean:{bn:'সাথে সাথে ধুয়ে শুকিয়ে রাখুন যাতে মরিচা না পড়ে।',en:'Wash and dry immediately to prevent rust.'},
      alt:{bn:'ছুরি দিয়ে ত্রিভুজ বা লম্বা স্টিক করে কাটাই যথেষ্ট।',en:'Triangles or sticks cut with a knife work just as well.'} },

    { id:'moulds', img:'🧁', pri:1, price:[150,500],
      name:{bn:'খাবারের শেপিং ছাঁচ',en:'Food shaping moulds'},
      purpose:{bn:'ভাত বা মাখা খাবার আকৃতিতে গড়া।',en:'Presses rice or mash into shapes.'},
      why:{bn:'দৃষ্টিনন্দন পরিবেশনা কিছু বাচ্চার আগ্রহ বাড়ায়। প্রয়োজনীয় নয়।',en:'Attractive presentation raises interest for some children. Not a necessity.'},
      when:{bn:'~১২ মাস+',en:'From about 12 months'}, qty:{bn:'১ সেট',en:'1 set'},
      clean:{bn:'গরম পানিতে ধুয়ে শুকান।',en:'Wash in hot water and dry.'},
      alt:{bn:'হাত ভিজিয়ে ভাতের ছোট বল গড়ে নিন — বাচ্চারা সমান পছন্দ করে।',en:'Wet your hands and roll rice balls — babies like them just as much.'} },

    { id:'scraper', img:'🥄', pri:2, price:[200,600],
      name:{bn:'দুই-মাথা স্ক্র্যাপার চামচ',en:'Two-head scraper spoon'},
      purpose:{bn:'এক মাথায় খাওয়ানো, অন্য মাথায় বাটির গা থেকে খাবার চেঁছে নেওয়া।',en:'One end feeds, the other scrapes the bowl clean.'},
      why:{bn:'ঘন পিউরি বা দই বাটির গায়ে লেগে থাকে — স্ক্র্যাপার প্রান্ত অপচয় কমায়। বিশেষায়িত জিনিস, অপরিহার্য নয়।',en:'Thick purée and yogurt cling to the bowl and the scraper end reduces waste. A niche item rather than an essential.'},
      when:{bn:'৬-১২ মাস',en:'6-12 months'}, qty:{bn:'১টি',en:'1'},
      clean:{bn:'স্বাভাবিকভাবে ধুয়ে নিন।',en:'Wash normally.'},
      alt:{bn:'সাধারণ সিলিকন স্প্যাচুলা।',en:'A standard small silicone spatula.'} },

    { id:'spoonfeeder', img:'🍶', pri:2, price:[300,900],
      name:{bn:'স্কুইজ স্পুন ফিডার',en:'Squeeze spoon feeder'},
      purpose:{bn:'চাপ দিলে চামচে পিউরি বেরিয়ে আসে এমন বোতল।',en:'A squeezable bottle that pushes purée into an attached spoon.'},
      why:{bn:'ভ্রমণ ও বাইরে খাওয়ানোর জন্য সুবিধাজনক। তবে চাপ দিয়ে খাওয়ানোয় বাচ্চার নিজের গতি নিয়ন্ত্রণ কমে যায়, তাই নিয়মিত ব্যবহার না করাই ভালো।',en:'Convenient for travel, but squeezing food in reduces baby\'s control over pace, so it is better kept for occasional use.'},
      when:{bn:'৬-১০ মাস',en:'6-10 months'}, qty:{bn:'১টি',en:'1'},
      clean:{bn:'ভালভ ও চামচ খুলে ভালোভাবে ধুয়ে শুকান — ভেতরে খাবার জমে থাকা ঝুঁকিপূর্ণ।',en:'Disassemble valve and spoon and dry fully — trapped food inside is a real risk.'},
      alt:{bn:'ছোট কনটেইনার + সাধারণ চামচ।',en:'A small container plus an ordinary spoon.'} },

    { id:'placemat', img:'🟩', pri:3, price:[300,1000],
      name:{bn:'সিলিকন প্লেসম্যাট',en:'Silicone placemat'},
      purpose:{bn:'টেবিলে আটকে থাকা ম্যাট, যার উপর সরাসরি খাবার দেওয়া যায়।',en:'A mat that suctions to the table and doubles as the plate.'},
      why:{bn:'BLW-তে সরাসরি ম্যাটের উপর খাবার দেওয়া যায় — বাটি ছোঁড়ার সমস্যা এড়ানো যায় এবং টেবিল পরিষ্কার রাখা সহজ হয়। রেস্টুরেন্টেও বিশেষভাবে কাজে লাগে।',en:'For BLW you can serve straight onto the mat, sidestepping thrown bowls and keeping the table clean. Particularly handy in restaurants.'},
      when:{bn:'~৮ মাস থেকে',en:'From about 8 months'}, qty:{bn:'১-২টি',en:'1-2'},
      clean:{bn:'কল দিয়ে ধুয়ে ঝুলিয়ে শুকান।',en:'Rinse under a tap and hang to dry.'},
      alt:{bn:'হাইচেয়ারের ট্রে ভালোভাবে মুছে সরাসরি খাবার দেওয়া।',en:'Wipe the highchair tray well and serve directly onto it.'} },

    { id:'thermos', img:'🍲', pri:3, price:[800,3000],
      name:{bn:'থার্মোস ফুড কনটেইনার',en:'Thermos food container'},
      purpose:{bn:'রান্না করা খাবার ৪-৬ ঘণ্টা গরম রাখে।',en:'Keeps cooked food warm for 4-6 hours.'},
      why:{bn:'বাইরে বা ভ্রমণে ঘরে তৈরি খিচুড়ি গরম রাখতে পারলে বাইরের খাবারের উপর নির্ভরতা কমে। ডে-কেয়ারে পাঠানোর জন্যও কার্যকর।',en:'Being able to keep home-made khichuri warm on the go removes reliance on outside food, and works well for daycare.'},
      when:{bn:'~৮ মাস থেকে, বা ভ্রমণের সময়',en:'From about 8 months, or whenever you travel'}, qty:{bn:'১টি',en:'1'},
      clean:{bn:'ব্যবহারের সাথে সাথে ধুয়ে ঢাকনা খোলা রেখে শুকান; ঢাকনার রাবার সিল আলাদা খুলে পরিষ্কার করুন। খাবার ২ ঘণ্টার বেশি হালকা গরম অবস্থায় রাখবেন না।',en:'Wash right after use and dry with the lid off; remove and clean the rubber seal. Do not keep food merely lukewarm for more than 2 hours.'},
      alt:{bn:'ইনসুলেটেড ব্যাগে সাধারণ টিফিন বাক্স।',en:'A normal tiffin box inside an insulated bag.'} },

    { id:'travelkit', img:'🎒', pri:4, price:[800,2500],
      name:{bn:'ট্রাভেল ফিডিং কিট',en:'Travel feeding kit'},
      purpose:{bn:'চামচ, বিব, ম্যাট, কাঁচি ও কাপ একসাথে ব্যাগে রাখার সেট।',en:'Spoon, bib, mat, scissors and cup packed together in one bag.'},
      why:{bn:'বাইরে যাওয়ার সময় আলাদা করে গুছানোর ঝামেলা এড়ায় — একটি ব্যাগ সবসময় প্রস্তুত থাকলে ঘরের বাইরে খাওয়ানো অনেক সহজ হয়ে যায়।',en:'Removes the packing decision every time you leave the house — one always-ready bag makes eating out dramatically easier.'},
      when:{bn:'~৭ মাস থেকে',en:'From about 7 months'}, qty:{bn:'১ সেট',en:'1 set'},
      clean:{bn:'ফিরে এসে সবকিছু খালি করে ধুয়ে আবার গুছিয়ে রাখুন।',en:'Empty, wash and repack everything as soon as you get home.'},
      alt:{bn:'একটি ছোট পাউচে নিজের পছন্দমতো জিনিস গুছিয়ে নিন — কেনা কিটের চেয়ে সস্তা ও ভালো।',en:'Assemble your own in a small pouch — cheaper and usually better than a bought kit.'} },
  ];

  /* ---- Retailer directory (module 8) ---------------------------------
     Links are kept in this single array so they are trivial to update:
     edit the `url` field and nothing else changes. --------------------- */
  const SITES = [
    { id:'monowa', short:'MM', url:'https://monowamart.com',
      name:{bn:'Monowa Mart',en:'Monowa Mart'},
      types:{bn:'বেবি ফিডিং গিয়ার, সিলিকন বিব ও বাটি, হাইচেয়ার',en:'Baby feeding gear, silicone bibs and bowls, high chairs'},
      price:{bn:'৳৳ মাঝারি',en:'৳৳ Mid-range'},
      strength:{bn:'ফিডিং পণ্যে ভালো বাছাই, বাংলায় সহায়তা, ঢাকায় দ্রুত ডেলিভারি',en:'Good curation of feeding products, Bangla support, fast Dhaka delivery'},
      weakness:{bn:'ঢাকার বাইরে ডেলিভারি ধীর, স্টক সীমিত হতে পারে',en:'Slower delivery outside Dhaka, stock can be limited'},
      best:{bn:'প্রথমবার BLW-এর মূল জিনিসপত্র একসাথে কেনার জন্য',en:'Buying a first set of core BLW essentials in one order'} },
    { id:'lokkhishona', short:'LS', url:'https://lokkhishona.com',
      name:{bn:'Lokkhishona',en:'Lokkhishona'},
      types:{bn:'বেবি কেয়ার, ফিডিং আইটেম, খেলনা, মা ও শিশুর পণ্য',en:'Baby care, feeding items, toys, mother and baby products'},
      price:{bn:'৳৳ মাঝারি',en:'৳৳ Mid-range'},
      strength:{bn:'দেশি ব্র্যান্ড, ফেসবুকে সক্রিয় সাপোর্ট, নিয়মিত অফার',en:'Local brand, responsive Facebook support, regular offers'},
      weakness:{bn:'সব পণ্যের বিস্তারিত স্পেসিফিকেশন থাকে না',en:'Product specifications are not always complete'},
      best:{bn:'দৈনন্দিন বেবি কেয়ার ও ফিডিং পণ্য',en:'Everyday baby care and feeding products'} },
    { id:'motherland', short:'ML', url:'https://motherlandbd.com',
      name:{bn:'Motherland BD',en:'Motherland BD'},
      types:{bn:'মা ও শিশুর সব ধরনের পণ্য, ফিডিং, স্বাস্থ্য',en:'Full mother and baby range, feeding, health'},
      price:{bn:'৳৳ - ৳৳৳ মাঝারি থেকে প্রিমিয়াম',en:'৳৳ to ৳৳৳ mid to premium'},
      strength:{bn:'বিস্তৃত পণ্যের তালিকা, আন্তর্জাতিক ব্র্যান্ড পাওয়া যায়',en:'Broad catalogue including international brands'},
      weakness:{bn:'দাম তুলনামূলক বেশি হতে পারে',en:'Prices can run higher than local sellers'},
      best:{bn:'নির্দিষ্ট আন্তর্জাতিক ব্র্যান্ড খুঁজলে',en:'Hunting for a specific international brand'} },
    { id:'babyshopbd', short:'BS', url:'https://babyshopbd.com',
      name:{bn:'Baby Shop BD',en:'Baby Shop BD'},
      types:{bn:'ফিডিং, ডায়াপার, পোশাক, খেলনা',en:'Feeding, nappies, clothing, toys'},
      price:{bn:'৳ - ৳৳ সাশ্রয়ী থেকে মাঝারি',en:'৳ to ৳৳ budget to mid'},
      strength:{bn:'সাশ্রয়ী দাম, নিয়মিত ডিসকাউন্ট',en:'Affordable pricing with frequent discounts'},
      weakness:{bn:'মানের তারতম্য থাকতে পারে — রিভিউ দেখে কিনুন',en:'Quality varies — read reviews before buying'},
      best:{bn:'কম বাজেটে বেসিক জিনিসপত্র',en:'Basics on a tight budget'} },
    { id:'priyoshop', short:'PS', url:'https://www.priyoshop.com',
      name:{bn:'PriyoShop',en:'PriyoShop'},
      types:{bn:'সাধারণ ই-কমার্স, বেবি ও মা-শিশু বিভাগ',en:'General e-commerce with a baby and mother section'},
      price:{bn:'৳ - ৳৳ সাশ্রয়ী থেকে মাঝারি',en:'৳ to ৳৳ budget to mid'},
      strength:{bn:'দেশজুড়ে ডেলিভারি, ক্যাশ অন ডেলিভারি',en:'Nationwide delivery with cash on delivery'},
      weakness:{bn:'বেবি বিভাগ বিশেষায়িত নয়, বাছাই সীমিত',en:'Baby section is not specialised and the range is limited'},
      best:{bn:'ঢাকার বাইরে থেকে অর্ডার করলে',en:'Ordering from outside Dhaka'} },
    { id:'daraz', short:'DZ', url:'https://www.daraz.com.bd',
      name:{bn:'Daraz Bangladesh',en:'Daraz Bangladesh'},
      types:{bn:'সবকিছু — হাইচেয়ার, সিলিকন সেট, স্টোরেজ, কাপ',en:'Everything — high chairs, silicone sets, storage, cups'},
      price:{bn:'৳ - ৳৳৳ সব রেঞ্জ',en:'৳ to ৳৳৳ every range'},
      strength:{bn:'সবচেয়ে বড় বাছাই ও সবচেয়ে প্রতিযোগিতামূলক দাম; দেশজুড়ে ডেলিভারি ও রিটার্ন সুবিধা',en:'The widest selection and most competitive prices, nationwide delivery and a returns process'},
      weakness:{bn:'বিক্রেতাভেদে মান খুব আলাদা — শুধু "Mall" বা উচ্চ রেটিংয়ের বিক্রেতা থেকে কিনুন এবং সিলিকন পণ্যে ফুড-গ্রেড সার্টিফিকেশন যাচাই করুন',en:'Quality varies hugely by seller — buy only from Mall or highly-rated sellers and verify food-grade certification on silicone'},
      best:{bn:'দাম তুলনা করে হাইচেয়ার ও বড় জিনিস কেনা',en:'Comparing prices on high chairs and larger items'} },
    { id:'pickaboo', short:'PB', url:'https://www.pickaboo.com',
      name:{bn:'Pickaboo',en:'Pickaboo'},
      types:{bn:'ইলেকট্রনিক্স ও লাইফস্টাইল, সীমিত বেবি পণ্য',en:'Electronics and lifestyle with a limited baby range'},
      price:{bn:'৳৳ - ৳৳৳ মাঝারি থেকে প্রিমিয়াম',en:'৳৳ to ৳৳৳ mid to premium'},
      strength:{bn:'আসল পণ্যের নিশ্চয়তা ও ওয়ারেন্টি সাপোর্ট ভালো',en:'Strong authenticity guarantee and warranty support'},
      weakness:{bn:'ফিডিং পণ্যের বাছাই কম',en:'Small selection of feeding products'},
      best:{bn:'স্টেরিলাইজার বা ব্লেন্ডারের মতো ইলেকট্রিক পণ্য',en:'Electrical items such as sterilisers or blenders'} },
    { id:'shajgoj', short:'SG', url:'https://shop.shajgoj.com',
      name:{bn:'Shajgoj',en:'Shajgoj'},
      types:{bn:'মূলত বিউটি ও পার্সোনাল কেয়ার; শিশুর ত্বকের যত্নের পণ্য',en:'Mainly beauty and personal care, plus baby skincare'},
      price:{bn:'৳৳ মাঝারি',en:'৳৳ Mid-range'},
      strength:{bn:'আসল পণ্যের নিশ্চয়তা, ভালো প্যাকেজিং',en:'Authenticity assurance and good packaging'},
      weakness:{bn:'ফিডিং গিয়ার সাধারণত পাওয়া যায় না',en:'Feeding gear is generally not stocked'},
      best:{bn:'বাচ্চার ত্বকের যত্নের পণ্য (ফিডিং নয়)',en:'Baby skincare rather than feeding items'} },
  ];

  function renderGear(){
    const el = document.getElementById('sub-gear');
    if(!el) return;

    let html = `<div class="v-card tint" style="margin-bottom:20px;">
      <h3>⭐ ${Util.tt('অগ্রাধিকার রেটিং কীভাবে পড়বেন','How to read the priority rating')}</h3>
      <div class="portion-meta" style="margin-top:8px;">
        <div class="pm-line"><span>★★★★★</span><span>${Util.tt('অপরিহার্য — প্রথম দিন থেকেই লাগবে','Essential — needed from day one')}</span></div>
        <div class="pm-line"><span>★★★★</span><span>${Util.tt('খুবই কাজের — জীবন অনেক সহজ করে','Very useful — makes life much easier')}</span></div>
        <div class="pm-line"><span>★★★</span><span>${Util.tt('সহায়ক — থাকলে ভালো','Helpful — good to have')}</span></div>
        <div class="pm-line"><span>★★</span><span>${Util.tt('ঐচ্ছিক','Optional')}</span></div>
        <div class="pm-line"><span>★</span><span>${Util.tt('থাকলে মজা, না থাকলেও চলে','Nice to have, easily skipped')}</span></div>
      </div>
      <p class="v-small" style="margin-top:12px;">💡 ${Util.tt('সব মিলিয়ে সত্যিকারের প্রয়োজন মাত্র ৫টি: বসার নিরাপদ ব্যবস্থা, একটি নরম চামচ, একটি বাটি, একটি খোলা কাপ ও একটি বিব। বাকি সব সুবিধা মাত্র।','Only five things are genuinely required: somewhere safe to sit, a soft spoon, a bowl, an open cup and a bib. Everything else is convenience.')}</p>
    </div>`;

    const sorted = GEAR.slice().sort((a,b) => b.pri - a.pri);
    html += '<div class="v-grid wide">';
    sorted.forEach(g => {
      html += `<div class="gear-card">
        <div class="gear-img" data-ph="${Util.tt('ছবি','image')}">${g.img}</div>
        <div class="gear-body">
          <h3>${Util.t(g.name)}</h3>
          ${Util.stars(g.pri)}
          <div class="gear-price">💰 ${taka(g.price)} <span class="v-small">(${Util.tt('আনুমানিক','approx')})</span></div>
          <div class="gear-line"><b>${Util.tt('কাজ','Purpose')}:</b> ${Util.t(g.purpose)}</div>
          <div class="gear-line"><b>${Util.tt('কেন দরকার','Why it helps')}:</b> ${Util.t(g.why)}</div>
          <div class="gear-line"><b>${Util.tt('কখন লাগবে','When it becomes useful')}:</b> ${Util.t(g.when)}</div>
          <div class="gear-line"><b>${Util.tt('পরিমাণ','Recommended quantity')}:</b> ${Util.t(g.qty)}</div>
          <div class="gear-line"><b>🧽 ${Util.tt('পরিষ্কার','Cleaning')}:</b> ${Util.t(g.clean)}</div>
          <div class="gear-line"><b>♻️ ${Util.tt('বিকল্প','Substitute')}:</b> ${Util.t(g.alt)}</div>
        </div>
      </div>`;
    });
    html += '</div>';

    html += `<p class="med-note calm">${Util.tt(
      '💰 দামগুলো আনুমানিক খুচরা রেঞ্জ এবং বাজার অনুযায়ী পরিবর্তিত হয় — কেনার আগে অন্তত দুটি দোকানে দাম যাচাই করুন। সিলিকন পণ্য কেনার সময় "food grade" বা "BPA free" লেখা আছে কিনা দেখে নিন।',
      '💰 Prices are approximate retail ranges and move with the market — compare at least two sellers before buying. When buying silicone, check that it is labelled food grade or BPA free.')}</p>`;
    el.innerHTML = html;
  }

  function renderSites(){
    const el = document.getElementById('sub-sites');
    if(!el) return;
    let html = `<p class="v-muted" style="max-width:70ch;margin-bottom:20px;">${Util.tt(
      'নিচের তালিকাটি সুবিধার জন্য দেওয়া — কোনো দোকানের সাথে এই অ্যাপের কোনো বাণিজ্যিক সম্পর্ক নেই। অনলাইনে কেনার আগে বিক্রেতার রেটিং, রিটার্ন নীতি ও পণ্যের ফুড-গ্রেড সার্টিফিকেশন যাচাই করে নিন।',
      'This list is provided for convenience — this app has no commercial relationship with any retailer. Before buying online, check the seller rating, the returns policy and food-grade certification.')}</p>`;

    html += '<div class="v-grid wide">';
    SITES.forEach(s => {
      html += `<div class="shop-card">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="shop-logo" aria-hidden="true">${s.short}</div>
          <div><h3 style="font-size:1.05rem;">${Util.t(s.name)}</h3>
            <span class="chip mustard">${Util.t(s.price)}</span></div>
        </div>
        <div class="gear-line"><b>${Util.tt('পণ্যের ধরন','Product types')}:</b> ${Util.t(s.types)}</div>
        <div class="gear-line"><b style="color:var(--leaf);">✅ ${Util.tt('সুবিধা','Strengths')}:</b> ${Util.t(s.strength)}</div>
        <div class="gear-line"><b style="color:var(--alert);">⚠ ${Util.tt('সীমাবদ্ধতা','Weaknesses')}:</b> ${Util.t(s.weakness)}</div>
        <div class="gear-line"><b>🎯 ${Util.tt('যাদের জন্য সবচেয়ে ভালো','Best for')}:</b> ${Util.t(s.best)}</div>
        <a class="open-site" href="${s.url}" target="_blank" rel="noopener noreferrer">
          ${Util.tt('ওয়েবসাইটে যান','Open website')} ↗</a>
      </div>`;
    });
    html += '</div>';

    html += Util.accordion('🛍 ' + Util.tt('অনলাইনে বেবি ফিডিং পণ্য কেনার টিপস','Tips for buying feeding gear online'),
      `<ul class="plain">
        <li>${Util.tt('সিলিকন পণ্যে "food grade silicone" বা "BPA free" লেখা আছে কিনা দেখুন। সন্দেহ হলে সিলিকন মুচড়ে দেখুন — সাদা দাগ পড়লে তাতে ফিলার মেশানো আছে।','Check for "food grade silicone" or "BPA free". If in doubt, twist the silicone — a white streak means it contains fillers.')}</li>
        <li>${Util.tt('হাইচেয়ার কেনার আগে দেখুন: পাঁচ-পয়েন্ট হারনেস আছে কিনা, পা রাখার জায়গা আছে কিনা, এবং ট্রে খুলে ধোয়া যায় কিনা।','Before buying a high chair check for a five-point harness, a footrest and a removable washable tray.')}</li>
        <li>${Util.tt('ছবির চেয়ে পরিমাপ (dimensions) দেখুন — অনেক বাটি ও চামচ ছবিতে যা মনে হয় তার চেয়ে অনেক বড়।','Read the dimensions rather than trusting photos — many bowls and spoons are far larger than they look.')}</li>
        <li>${Util.tt('ক্যাশ অন ডেলিভারি নিলে ডেলিভারি ম্যানের সামনেই খুলে দেখে নিন।','If paying cash on delivery, open and inspect the item in front of the courier.')}</li>
        <li>${Util.tt('প্রথমেই সব কিনে ফেলবেন না — এক মাস চালিয়ে দেখুন কী সত্যিই লাগছে, তারপর কিনুন। অধিকাংশ পরিবারের কেনা জিনিসের এক-তৃতীয়াংশ অব্যবহৃত থেকে যায়।','Do not buy everything up front — run a month and see what you actually reach for. Most families leave a third of what they bought unused.')}</li>
      </ul>`, false);
    el.innerHTML = html;
  }

  const RENDERERS = { gear:renderGear, sites:renderSites };
  let rendered = {};

  function show(id){
    document.querySelectorAll('#tab-shopping .subpanel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('#shop-subnav button').forEach(b => b.classList.toggle('active', b.dataset.sub === id));
    const p = document.getElementById('sub-'+id);
    if(p) p.classList.add('active');
    if(!rendered[id]){ RENDERERS[id](); rendered[id] = true; }
  }
  function init(){ rendered = {}; show('gear'); }

  /* Same pattern as Guides: repaint the visible sub-panel, blank the hidden
     ones so no stale-language markup survives the toggle. */
  LANG_HOOKS.push(function(){
    rendered = {};
    document.querySelectorAll('#tab-shopping .subpanel').forEach(function(p){
      if(!p.classList.contains('active')) p.innerHTML = '';
    });
    const active = document.querySelector('#tab-shopping .subpanel.active');
    if(active){
      const id = active.id.replace('sub-','');
      if(RENDERERS[id]){ RENDERERS[id](); rendered[id] = true; }
    }
  });

  return { init, show, GEAR, SITES };
})();


/* =====================================================================
   MODULE 10 — HOW TO EXCEL AT BLW
   21 topics as collapsible sections, several with interactive
   checklists persisted to localStorage under pk2.blwChecks.
   ===================================================================== */
const BLWPro = (function(){

  let checks = Util.load('blwChecks', {});

  /* Toggling updates only the clicked row and its little counter. A full
     re-render would collapse every open <details>, which is exactly what
     the caregiver does not want mid-checklist. */
  function toggle(id){
    if(checks[id]) delete checks[id]; else checks[id] = 1;
    Util.save('blwChecks', checks);

    const row = document.querySelector('[data-check="'+id+'"]');
    if(row){
      const on = !!checks[id];
      row.classList.toggle('done', on);
      row.setAttribute('aria-checked', on);
      row.querySelector('.cb').textContent = on ? '✓' : '';
      /* Refresh the "n/total done" counter for this checklist only. */
      const wrap = row.parentElement;
      const counter = wrap.querySelector('.mini-progress');
      if(counter){
        const rows = wrap.querySelectorAll('[data-check]');
        const doneN = wrap.querySelectorAll('[data-check].done').length;
        counter.textContent = Util.num(doneN) + '/' + Util.num(rows.length) + ' ' + Util.tt('সম্পন্ন','done');
      }
      updateTotal();
    } else {
      render();
    }
  }

  function updateTotal(){
    const el = document.getElementById('blw-total');
    if(el) el.textContent = Util.num(Object.keys(checks).length);
  }

  /* Renders a persisted checklist from an array of bilingual pairs. */
  function checklist(prefix, items){
    const doneN = items.filter((_,i) => checks[prefix+i]).length;
    return `<div class="mini-progress" style="margin-bottom:8px;">${Util.num(doneN)}/${Util.num(items.length)} ${Util.tt('সম্পন্ন','done')}</div>` +
      items.map((it,i) => {
        const id = prefix+i, on = !!checks[id];
        return `<div class="check-item${on?' done':''}" data-check="${id}" role="checkbox" aria-checked="${on}" tabindex="0"
            onclick="BLWPro.toggle('${id}')"
            onkeypress="if(event.key==='Enter'||event.key===' '){event.preventDefault();BLWPro.toggle('${id}');}">
          <div class="cb">${on?'✓':''}</div><span>${Util.t(it)}</span></div>`;
      }).join('');
  }

  /* Topic list. `check` renders as an interactive checklist, `body` as prose. */
  function TOPICS(){ return [
    { id:'mental', icon:'🧘', t:{bn:'মানসিক প্রস্তুতি',en:'Preparing yourself mentally'},
      body:`<p>${Util.tt('BLW-এর সবচেয়ে কঠিন অংশ বাচ্চার নয়, বাবা-মায়ের। শুরু করার আগে কয়েকটি বাস্তবতা মেনে নিলে পুরো যাত্রাটা অনেক সহজ হয়।','The hardest part of BLW is not the baby — it is the parent. Accepting a few realities up front makes the whole journey easier.')}</p>`,
      check:[{bn:'প্রথম কয়েক সপ্তাহে বাচ্চা প্রায় কিছুই "খাবে" না — এটি ব্যর্থতা নয়, এটিই স্বাভাবিক প্রক্রিয়া',en:'Accept that baby will swallow almost nothing for the first few weeks — that is the normal process, not failure'},
             {bn:'প্রতিদিন এলোমেলো হবে, এবং সেটা ঠিক আছে',en:'Accept daily mess as part of the deal'},
             {bn:'ওয়াক তোলা দেখতে ভয়ংকর, কিন্তু নিরাপদ — এই পার্থক্যটি আগে থেকে জেনে রাখুন',en:'Learn the gag-versus-choke difference in advance, so the first gag does not derail you'},
             {bn:'১২ মাস পর্যন্ত পুষ্টির দায়িত্ব দুধেরই — খাবার এখন শেখার বিষয়',en:'Remember milk carries the nutrition until 12 months; food is a learning activity'},
             {bn:'অন্যের বাচ্চার সাথে তুলনা করবেন না',en:'Stop comparing with other babies'}] },

    { id:'fear', icon:'😰', t:{bn:'ভয় কাটানো',en:'Reducing your own fear'},
      body:`<p>${Util.tt('ভয় থাকা স্বাভাবিক — এটি দায়িত্ববোধের লক্ষণ। কিন্তু ভয়ে চালিত সিদ্ধান্ত (যেমন সব খাবার অতিরিক্ত ছোট করে কাটা, যা আসলে ঝুঁকি বাড়ায়) সাহায্য করে না। ভয় কমানোর সবচেয়ে কার্যকর উপায় প্রস্তুতি।','Fear is normal and shows you are taking it seriously. But fear-driven decisions — such as cutting everything tiny, which actually raises risk — do not help. Preparation is what reduces fear.')}</p>`,
      check:[{bn:'একটি শিশু-CPR ও চোকিং ফার্স্ট এইড কোর্স করুন (সবচেয়ে বড় পার্থক্য এখানেই)',en:'Take an infant CPR and choking first-aid course — this makes the biggest difference of all'},
             {bn:'ফার্স্ট এইড ট্যাবের তুলনা টেবিলটি একবার পুরো পড়ুন',en:'Read the full comparison in the First Aid tab once, carefully'},
             {bn:'প্রথম কয়েকবার এমন কারো সাথে খাওয়ান যিনি শান্ত থাকতে পারেন',en:'Do the first few meals alongside someone who stays calm'},
             {bn:'প্রথম সপ্তাহে সবচেয়ে নিরাপদ খাবার দিয়ে শুরু করুন — অতিরিক্ত পাকা কলা, ভাপানো মিষ্টি আলু',en:'Start with the safest possible foods: very ripe banana, steamed sweet potato'},
             {bn:'প্রতিবার খাওয়ানোর আগে "চাপ পরীক্ষা" করুন — দুই আঙুলে সহজে ভাঙে কিনা',en:'Do the two-finger squash test before every single serving'}] },

    { id:'positive', icon:'😊', t:{bn:'ইতিবাচক খাওয়ার অভিজ্ঞতা তৈরি',en:'Creating positive eating experiences'},
      body:`<ul class="plain">
        <li>${Util.tt('বাচ্চা খেলে অতিরিক্ত উচ্ছ্বাস দেখাবেন না, না খেলে হতাশাও নয় — নিরপেক্ষ থাকুন। প্রশংসা বা হতাশা দুটোই খাবারকে "পারফরম্যান্স" বানিয়ে ফেলে।','Do not cheer when baby eats or deflate when they do not — stay neutral. Both praise and disappointment turn eating into a performance.')}</li>
        <li>${Util.tt('খাবার নিয়ে কথা বলুন, খাওয়া নিয়ে নয়: "এই আমটা কত নরম!" — "আরেকটু খাও" নয়।','Talk about the food, not the eating: "This mango is so soft!" rather than "Have one more bite."')}</li>
        <li>${Util.tt('বাচ্চা "শেষ" ইঙ্গিত দিলে (মুখ ঘুরিয়ে নেওয়া, খাবার ছুঁড়ে ফেলা, পিঠ বাঁকানো) সাথে সাথে শেষ করুন।','End the meal the moment baby signals they are done — turning away, throwing, arching the back.')}</li>
        <li>${Util.tt('খাবারের সময় ২০-৩০ মিনিটে সীমাবদ্ধ রাখুন; দীর্ঘ খাবার সবার জন্যই বিরক্তিকর হয়ে ওঠে।','Cap meals at 20-30 minutes; long meals become miserable for everyone.')}</li>
        <li>${Util.tt('কখনো জোর করে মুখে ঢোকাবেন না, বিমান-চামচ খেলবেন না, বা "আর এক চামচ" দর কষাকষি করবেন না।','Never force-feed, play aeroplane spoon, or bargain for one more bite.')}</li>
      </ul>` },

    { id:'mess', icon:'🧹', t:{bn:'এলোমেলো কমানো',en:'Reducing the mess'},
      body:`<p>${Util.tt('এলোমেলো পুরোপুরি ঠেকানো যায় না — এটি শেখার প্রক্রিয়ারই অংশ। কিন্তু পরিষ্কারের কাজটি অনেক কমানো যায়।','You cannot prevent mess — it is part of learning. But you can drastically reduce the cleanup.')}</p>`,
      check:[{bn:'হাইচেয়ারের নিচে পুরনো চাদর, শাওয়ার কার্টেন বা খবরের কাগজ বিছিয়ে দিন — খাওয়া শেষে তুলে ঝেড়ে ফেলুন',en:'Put an old sheet, shower curtain or newspaper under the chair — lift, shake out, done'},
             {bn:'পকেটওয়ালা সিলিকন বিব ব্যবহার করুন',en:'Use a silicone bib with a catching pocket'},
             {bn:'গরমের দিনে শুধু ডায়াপার পরিয়ে খাওয়ান',en:'On warm days, feed in just a nappy'},
             {bn:'খাবারের পরিমাণ কম করে দিন, শেষ হলে আরও দিন — এক বাটি ভরে দিলে পুরোটাই মেঝেতে যায়',en:'Offer small amounts and top up — a full bowl usually ends up on the floor in one sweep'},
             {bn:'সাকশন বাটি বা সরাসরি ট্রেতে খাবার দিন',en:'Use a suction bowl, or serve straight onto the tray'},
             {bn:'খাবার শেষে সাথে সাথে ভেজা কাপড়ে মুছে ফেলুন — শুকিয়ে গেলে খিচুড়ি সিমেন্টের মতো শক্ত হয়',en:'Wipe immediately — dried khichuri sets like cement'},
             {bn:'খাওয়ার শেষে বাচ্চাকে সরাসরি গোসলে নিয়ে যাওয়ার রুটিন করুন',en:'Build a routine of going straight from meal to bath'}] },

    { id:'timing', icon:'⏰', t:{bn:'খাবারের সময় নির্বাচন',en:'Getting meal timing right'},
      body:`<ul class="plain">
        <li>${Util.tt('বাচ্চা যখন সবচেয়ে সজাগ ও খুশি — সাধারণত সকালের মাঝামাঝি — সেই সময় নতুন খাবার দিন।','Offer new foods when baby is most alert and cheerful, usually mid-morning.')}</li>
        <li>${Util.tt('ঘুমের ঠিক আগে কখনো নতুন খাবার নয়। ক্লান্ত বাচ্চা কিছুই গ্রহণ করে না।','Never introduce anything new right before a nap. A tired baby accepts nothing.')}</li>
        <li>${Util.tt('অতিরিক্ত ক্ষুধার্ত অবস্থায় বসাবেন না — দুধের ৩০-৪৫ মিনিট পরে খাবার দেওয়াই সবচেয়ে ভালো সমঝোতা।','Do not seat a frantically hungry baby — 30-45 minutes after a milk feed is the sweet spot.')}</li>
        <li>${Util.tt('নতুন অ্যালার্জেন সবসময় দিনের প্রথম ভাগে দিন, যাতে প্রতিক্রিয়া দেখা দিলে সারাদিন লক্ষ্য রাখা যায় এবং প্রয়োজনে ডাক্তারের কাছে যাওয়া যায়।','Always introduce new allergens early in the day so you can watch for a reaction and reach a doctor if needed.')}</li>
        <li>${Util.tt('একটি অনুমানযোগ্য রুটিন তৈরি করুন — বাচ্চারা পূর্বানুমান করতে পারলে অনেক ভালো খায়।','Build a predictable routine — babies eat better when they can anticipate what is coming.')}</li>
      </ul>` },

    { id:'family', icon:'👨‍👩‍👧', t:{bn:'পারিবারিক খাবার',en:'Family meals'},
      body:`<p>${Util.tt('BLW-এর মূল শক্তি এখানেই: বাচ্চা পরিবারের সাথে একই টেবিলে, একই খাবার খায়। মূল কৌশল একটাই — লবণ ও ঝাল দেওয়ার আগে বাচ্চার অংশ তুলে রাখা।','This is where BLW is strongest: baby eats the same food at the same table. The whole technique is one habit — take out baby\'s share before the salt and chilli go in.')}</p>
      <ul class="plain">
        <li>${Util.tt('খিচুড়ি, ডাল, সেদ্ধ সবজি, মাছের ঝোল — বেশিরভাগ বাঙালি রান্না সামান্য পরিবর্তনেই বাচ্চার উপযোগী।','Khichuri, dal, boiled vegetables, fish curry — most Bengali cooking needs only a small adjustment.')}</li>
        <li>${Util.tt('বাচ্চার অংশ তুলে নেওয়ার পর পরিবারের অংশে স্বাদমতো লবণ-মরিচ দিন।','Season the family portion to taste after baby\'s share is out.')}</li>
        <li>${Util.tt('হলুদ, জিরা, ধনে, সামান্য রসুন-আদা — এসব মশলা ৬ মাস থেকেই দেওয়া যায় এবং স্বাদের বৈচিত্র্য শেখায়। শুধু ঝাল ও লবণ বাদ।','Turmeric, cumin, coriander, a little garlic and ginger are all fine from 6 months and build flavour acceptance. Only chilli and salt are off limits.')}</li>
        <li>${Util.tt('বাচ্চাকে টেবিলে বসান এমনকি সে না খেলেও — দেখাটাই শেখার প্রধান উপায়।','Seat baby at the table even when they are not eating — watching is the main way they learn.')}</li>
      </ul>` },

    { id:'independence', icon:'🌟', t:{bn:'স্বাধীনতা উৎসাহিত করা',en:'Encouraging independence'},
      body:`<ul class="plain">
        <li>${Util.tt('দুটি চামচ ব্যবহার করুন: একটি বাচ্চার হাতে, একটি আপনার হাতে ভরে দেওয়ার জন্য।','Use two spoons — one in baby\'s hand, one you load and hand over.')}</li>
        <li>${Util.tt('আগে থেকে ভরা চামচ বাচ্চার হাতে দিন, নিজে মুখে ঢোকাবেন না।','Pass a pre-loaded spoon rather than putting it in their mouth yourself.')}</li>
        <li>${Util.tt('বাচ্চা হাত দিয়ে খাবার ছানাছানি করলে থামাবেন না — স্পর্শ করে টেক্সচার চেনাটাই খাবার গ্রহণের প্রথম ধাপ।','Let baby squish and smear — exploring texture by hand is the first step to accepting a food.')}</li>
        <li>${Util.tt('৬ মাস থেকেই খোলা কাপ ধরিয়ে দিন, প্রথমে আপনার হাতে সাহায্য করে।','Offer an open cup from 6 months, steadying it with your hand at first.')}</li>
        <li>${Util.tt('সময় দিন — বাচ্চাদের একটি টুকরা তুলে মুখে নিতে বড়দের চেয়ে অনেক বেশি সময় লাগে। তাড়াহুড়া করে হাতে তুলে দিলে শেখাটাই বন্ধ হয়ে যায়।','Give them time — picking up one piece takes far longer than you expect. Rushing in to help is what stops the learning.')}</li>
      </ul>` },

    { id:'throwing', icon:'🎯', t:{bn:'খাবার ছুঁড়ে ফেলা সামলানো',en:'Managing food throwing'},
      body:`<p>${Util.tt('৮-১২ মাসে খাবার ছুঁড়ে ফেলা প্রায় সব বাচ্চাই করে। এটি দুষ্টুমি নয় — এটি "ছেড়ে দেওয়া" (voluntary release) নামের একটি নতুন দক্ষতার অনুশীলন এবং মাধ্যাকর্ষণ নিয়ে পরীক্ষা।','Nearly every baby throws food between 8 and 12 months. It is not naughtiness — it is practice of a brand new skill called voluntary release, plus an experiment with gravity.')}</p>`,
      check:[{bn:'অতিরিক্ত প্রতিক্রিয়া দেখাবেন না — হাসি বা রাগ দুটোই খেলাটিকে আরও মজার করে তোলে',en:'Do not react strongly — laughing or scolding both make the game more rewarding'},
             {bn:'শান্তভাবে একবার বলুন: "খাবার প্লেটে থাকে" — তারপর চুপচাপ তুলে ফেলুন',en:'Say once, calmly: "Food stays on the plate" — then quietly pick it up'},
             {bn:'একবারে ২-৩ টুকরার বেশি দেবেন না',en:'Put out only 2-3 pieces at a time'},
             {bn:'বারবার ছুঁড়তে থাকলে ধরে নিন খাওয়া শেষ, খাবার সরিয়ে ফেলুন',en:'If throwing continues, treat it as the end of the meal and remove the food'},
             {bn:'সাকশন বাটি ব্যবহার করুন যাতে অন্তত বাটিটা না যায়',en:'Use a suction bowl so at least the bowl stays'},
             {bn:'খাবারের বাইরে "ছুঁড়ে ফেলার" খেলা দিন (বল, নরম খেলনা) — একই দক্ষতা, সঠিক জায়গায়',en:'Offer throwing games outside mealtimes with balls or soft toys — same skill, right context'}] },

    { id:'refusal', icon:'🙅', t:{bn:'খাবার প্রত্যাখ্যান সামলানো',en:'Handling food refusal'},
      body:`<ul class="plain">
        <li>${Util.tt('একদিন প্রায় কিছুই না খাওয়া সম্পূর্ণ স্বাভাবিক। সপ্তাহের গড় দেখুন, একদিনের হিসাব নয়।','Eating almost nothing for a day is completely normal. Judge across a week, never a single day.')}</li>
        <li>${Util.tt('প্রত্যাখ্যাত খাবার তালিকা থেকে বাদ দেবেন না — কয়েকদিন পর আবার দিন, ভিন্নভাবে রান্না করে।','Do not strike a rejected food off the list — offer it again in a few days, cooked differently.')}</li>
        <li>${Util.tt('বিকল্প খাবার বানিয়ে দেবেন না। "এটা না খেলে অন্য কিছু পাব" শিখে গেলে বৈচিত্র্য কমতে থাকে।','Do not cook a replacement meal. Once baby learns refusing produces an alternative, variety shrinks.')}</li>
        <li>${Util.tt('পাশে পরিচিত পছন্দের একটি খাবার রাখুন — অন্তত কিছু খাওয়া হবে এবং নতুন খাবারটি কম ভীতিকর মনে হবে।','Put one familiar favourite alongside — something gets eaten and the new food feels less threatening.')}</li>
        <li>${Util.tt('অসুস্থতা, দাঁত ওঠা বা নতুন দক্ষতা শেখার সময় (হামাগুড়ি, দাঁড়ানো) সাময়িকভাবে খাওয়া কমে — এটি স্বাভাবিক।','Intake dips during illness, teething and big motor leaps such as crawling or standing — all normal.')}</li>
        <li>${Util.tt('দীর্ঘদিন ওজন না বাড়লে, খুব সীমিত কয়েকটি খাবারেই আটকে থাকলে বা গিলতে সমস্যা হলে ডাক্তার দেখান।','See a doctor if weight gain stalls, the accepted list narrows to a very few foods, or swallowing seems difficult.')}</li>
      </ul>` },

    { id:'exposure', icon:'🔁', t:{bn:'বারবার পরিচয় করানো',en:'Repeated exposure'},
      body:`<p>${Util.tt('গবেষণায় দেখা যায় একটি নতুন খাবার গ্রহণ করতে অনেক শিশুর ৮-১৫ বার বা তারও বেশি পরিচয়ের প্রয়োজন হয়। বেশিরভাগ বাবা-মা ৩-৫ বারেই হাল ছেড়ে দেন — এটাই সবচেয়ে বড় ভুল।','Research suggests many children need 8-15 or more exposures before accepting a new food. Most parents give up after 3-5 — that is the single biggest mistake.')}</p>
      <ul class="plain">
        <li>${Util.tt('"পরিচয়" মানে শুধু খাওয়া নয় — দেখা, ছোঁয়া, শোঁকা, প্লেটে থাকা, এমনকি ছুঁড়ে ফেলাও পরিচয়ের অংশ।','An exposure is not only eating — seeing, touching, smelling, having it on the plate, even throwing it all count.')}</li>
        <li>${Util.tt('চাপ দেবেন না। চাপ দিলে গ্রহণযোগ্যতা প্রমাণিতভাবে কমে যায়।','Do not pressure. Pressure demonstrably reduces acceptance.')}</li>
        <li>${Util.tt('একই খাবার ভিন্ন রূপে দিন: গাজর সেদ্ধ, গ্রেট করা, খিচুড়িতে মিশিয়ে, টিক্কিতে।','Offer the same food in different forms: carrot boiled, grated, mixed into khichuri, in a tikki.')}</li>
        <li>${Util.tt('আপনি নিজে খাবারটি খেয়ে দেখান — মডেলিং সবচেয়ে শক্তিশালী প্রভাবক।','Eat it yourself in front of them — modelling is the strongest influence there is.')}</li>
      </ul>` },

    { id:'fun', icon:'🎉', t:{bn:'খাবারকে আনন্দময় করা',en:'Making meals fun'},
      body:`<ul class="plain">
        <li>${Util.tt('রঙিন প্লেট সাজান — প্রতি বেলায় অন্তত ৩টি ভিন্ন রঙ রাখার চেষ্টা করুন।','Build a colourful plate — aim for at least three colours per meal.')}</li>
        <li>${Util.tt('খাবার নিয়ে ছোট গল্প বা ছড়া বলুন।','Tell a small story or rhyme about the food.')}</li>
        <li>${Util.tt('মাঝে মাঝে মেঝেতে চাদর বিছিয়ে "পিকনিক" করুন।','Occasionally spread a sheet on the floor and have a picnic.')}</li>
        <li>${Util.tt('বাচ্চাকে রান্নাঘরে যুক্ত করুন — সবজি ধোয়া, বাটি ধরা। যে খাবার তৈরিতে সে অংশ নিয়েছে, সেটি খাওয়ার সম্ভাবনা অনেক বেশি।','Involve baby in the kitchen — washing vegetables, holding a bowl. Children eat far more of what they helped make.')}</li>
        <li>${Util.tt('ডিপ দিন — দই, মসৃণ ডাল বা হুমাস। ডুবিয়ে খাওয়া নিজেই একটি আকর্ষণীয় খেলা।','Offer a dip — yogurt, smooth dal or hummus. Dipping is a game in itself.')}</li>
      </ul>` },

    { id:'presentation', icon:'🎨', t:{bn:'সৃজনশীল খাবার পরিবেশনা',en:'Creative food presentation'},
      body:`<ul class="plain">
        <li>${Util.tt('খাবার একে অপরের গায়ে না লাগিয়ে আলাদা করে সাজান — অনেক বাচ্চা মিশে যাওয়া খাবার প্রত্যাখ্যান করে।','Keep foods separate rather than touching — many children reject food that has mixed.')}</li>
        <li>${Util.tt('একবারে ২-৩টি আইটেম, প্রতিটির অল্প পরিমাণে। ভরা প্লেট ছোট বাচ্চাকে অভিভূত করে ফেলে।','Two or three items at a time, small amounts of each. A full plate overwhelms a small child.')}</li>
        <li>${Util.tt('ভাত দিয়ে ছোট বল, সবজি দিয়ে ফুল, রুটি দিয়ে ত্রিভুজ — সহজ আকৃতিই যথেষ্ট।','Rice balls, vegetable flowers, ruti triangles — simple shapes are plenty.')}</li>
        <li>${Util.tt('পিচ্ছিল খাবার (আম, অ্যাভোকাডো) সুজি বা গুঁড়া চিড়ায় গড়িয়ে দিন — ধরতে সুবিধা হয় এবং হতাশা কমে।','Roll slippery foods such as mango or avocado in suji or crushed chira — easier to hold, less frustration.')}</li>
        <li>${Util.tt('তবে মনে রাখবেন: রোজ সুন্দর প্লেট সাজানোর চাপ নেবেন না। সাধারণ খিচুড়িও সমান ভালো।','But do not take on the pressure of a beautiful plate every day — plain khichuri is just as good.')}</li>
      </ul>` },

    { id:'safefoods', icon:'✋', t:{bn:'নিরাপদ ফিঙ্গার ফুডের তালিকা',en:'Safe finger food ideas'},
      body:`<p>${Util.tt('নিরাপদ ফিঙ্গার ফুডের তিনটি শর্ত: (১) দুই আঙুলের চাপে ভেঙে যায়, (২) আঙুলের সমান লম্বা বা বাচ্চার মুঠোর চেয়ে বড়, (৩) গোল বা শক্ত নয়।','Three tests for a safe finger food: it squashes between two fingers, it is finger-length or bigger than baby\'s fist, and it is neither round nor firm.')}</p>
      <ul class="plain">
        <li><b>${Util.tt('৬ মাস','6 months')}:</b> ${Util.tt('ভাপানো মিষ্টি আলু ও গাজরের স্টিক · অতিরিক্ত পাকা কলা (খোসার অর্ধেক রেখে) · পাকা আম ও পেঁপের টুকরা · অ্যাভোকাডো স্পিয়ার · অমলেট স্ট্রিপ · নরম লাউ','Steamed sweet potato and carrot sticks · very ripe banana with half the peel left on · ripe mango and papaya spears · avocado spears · omelette strips · soft bottle gourd')}</li>
        <li><b>${Util.tt('৯ মাস','9 months')}:</b> ${Util.tt('ছোট নরম কিউব সবজি · ছানার টুকরা · নরম রুটি রোল · সবজি টিক্কি · মুরগির নরম স্ট্রিপ · সেদ্ধ পাস্তা','Small soft vegetable cubes · chana pieces · soft ruti rolls · vegetable tikki · soft chicken strips · cooked pasta')}</li>
        <li><b>${Util.tt('১২ মাস','12 months')}:</b> ${Util.tt('পরিবারের খাবার কেটে · নরম পিঠা · কিমা · চার ভাগ করা আঙুর ও লিচু','Chopped family food · soft pitha · keema · quartered grapes and lychee')}</li>
      </ul>
      <p class="v-small">${Util.tt('❌ কখনো নয়: গোটা বাদাম, পপকর্ন, শক্ত ক্যান্ডি, কাঁচা গাজর/আপেল, গোটা আঙুর ও লিচু, শক্ত বিস্কুট, মধু (১ বছরের নিচে), আস্ত সসেজের চাকতি।','❌ Never: whole nuts, popcorn, hard sweets, raw carrot or apple, whole grapes and lychee, hard biscuits, honey under 12 months, sausage coins.')}</p>` },

    { id:'photos', icon:'📸', t:{bn:'ছবি তোলার আইডিয়া',en:'Photography ideas'},
      body:`<ul class="plain">
        <li>${Util.tt('প্রথম খাবারের দিনের একটি ছবি একই জায়গায় প্রতি মাসে তুলুন — এক বছরে চমৎকার একটি সিরিজ হবে।','Photograph the first-foods day and repeat in the same spot monthly — a lovely series builds over a year.')}</li>
        <li>${Util.tt('মুখ নয়, হাত ও খাবারের ক্লোজ-আপ নিন — এই ছবিগুলোই পরে সবচেয়ে প্রিয় হয়ে ওঠে।','Shoot close-ups of hands and food rather than only faces — these age the best.')}</li>
        <li>${Util.tt('জানালার পাশে প্রাকৃতিক আলোতে বসান; ফ্ল্যাশ ব্যবহার করবেন না।','Sit near a window and use natural light; skip the flash.')}</li>
        <li>${Util.tt('বাচ্চার চোখের সমান উচ্চতায় নেমে ছবি তুলুন।','Get down to baby\'s eye level.')}</li>
        <li>${Util.tt('এলোমেলো অবস্থাটাই তুলে রাখুন — পরিষ্কার মুখের ছবির চেয়ে সেগুলোই বেশি স্মরণীয়।','Photograph the mess — those beat the tidy-faced shots every time.')}</li>
        <li>${Util.tt('তবে ফোনটা রেখে দিন বেশিরভাগ সময় — খাওয়ার সময় বাচ্চার আপনার চোখ দরকার, ক্যামেরার লেন্স নয়।','But mostly put the phone down — at mealtimes baby needs your eyes, not a lens.')}</li>
      </ul>` },

    { id:'outdoor', icon:'🌳', t:{bn:'বাইরে খাওয়ানো',en:'Outdoor eating'},
      body:`<ul class="plain">
        <li>${Util.tt('বারান্দা বা উঠানে খাওয়ালে পরিষ্কার করা অনেক সহজ — ঝাড়ু দিলেই শেষ।','Feeding on a balcony or in a yard makes cleanup a sweep rather than a scrub.')}</li>
        <li>${Util.tt('ছায়ায় বসান, খাবার ঢেকে রাখুন এবং মাছি থেকে সাবধান থাকুন।','Sit in shade, keep food covered and watch for flies.')}</li>
        <li>${Util.tt('বাইরে বাচ্চারা প্রায়ই বেশি খায় — নতুন পরিবেশ মনোযোগ বাড়ায়। খাবার প্রত্যাখ্যানের পর্যায়ে এটি কাজে লাগান।','Children often eat more outdoors — the new setting holds attention. Use this during a refusal phase.')}</li>
        <li>${Util.tt('হাত ধোয়ার পানি ও ভেজা কাপড় সাথে রাখুন।','Carry water for handwashing and a damp cloth.')}</li>
      </ul>` },

    { id:'travel', icon:'✈️', t:{bn:'ভ্রমণে খাওয়ানো',en:'Travel feeding'},
      check:[{bn:'থার্মোসে ঘরে তৈরি খিচুড়ি নিন (৪-৬ ঘণ্টা গরম থাকে)',en:'Carry home-made khichuri in a thermos, warm for 4-6 hours'},
             {bn:'শুকনো নিরাপদ স্ন্যাকস রাখুন: ভেজানোর মতো চিড়া, নরম ফল, ঘরে বানানো টিক্কি',en:'Pack safe dry snacks: chira to soak, soft fruit, home-made tikki'},
             {bn:'ভাঁজ করা সিলিকন বিব ও খাবার কাটার কাঁচি ব্যাগে রাখুন',en:'Keep a rollable silicone bib and food scissors in the bag'},
             {bn:'বোতল/স্ট্র কাপে বিশুদ্ধ পানি নিন',en:'Take safe drinking water in a bottle or straw cup'},
             {bn:'চলন্ত গাড়িতে কখনো খাওয়াবেন না — ঝাঁকুনিতে দম আটকানোর ঝুঁকি বেড়ে যায়',en:'Never feed in a moving vehicle — jolts sharply raise choking risk'},
             {bn:'হাত পরিষ্কারের জন্য পানি ও সাবান বা ওয়াইপস',en:'Carry water and soap or wipes for hands'},
             {bn:'নতুন অ্যালার্জেন ভ্রমণের সময় পরিচয় করাবেন না',en:'Do not introduce a new allergen while travelling'}] },

    { id:'restaurant', icon:'🍴', t:{bn:'রেস্টুরেন্টে খাওয়ানো',en:'Restaurant feeding'},
      body:`<ul class="plain">
        <li>${Util.tt('আগে থেকে ফোন করে হাইচেয়ার আছে কিনা জেনে নিন, নয়তো পোর্টেবল বুস্টার সাথে নিন।','Call ahead about a highchair, or bring a portable booster.')}</li>
        <li>${Util.tt('সিলিকন প্লেসম্যাট সাথে রাখুন — রেস্টুরেন্টের টেবিলে সরাসরি খাবার দেওয়ার নিরাপদ উপায়।','Bring a silicone placemat — the hygienic way to serve straight onto a restaurant table.')}</li>
        <li>${Util.tt('বাচ্চার জন্য নিরাপদ অপশন: সাদা ভাত, সেদ্ধ সবজি, দই, প্লেইন ডাল, নরম রুটি। "লবণ ও ঝাল ছাড়া" আলাদা করে বলে দিন।','Safe options: plain rice, boiled vegetables, yogurt, plain dal, soft ruti. Ask specifically for no salt and no chilli.')}</li>
        <li>${Util.tt('রেস্টুরেন্টের খাবারে সাধারণত অনেক বেশি লবণ থাকে — বাসা থেকে বাচ্চার মূল খাবার নিয়ে যাওয়াই নিরাপদ।','Restaurant food is usually very high in salt — bringing baby\'s main meal from home is the safer default.')}</li>
        <li>${Util.tt('অপেক্ষার সময়ের জন্য একটি নিরাপদ স্ন্যাক সাথে রাখুন।','Carry one safe snack for the waiting time.')}</li>
      </ul>` },

    { id:'cultural', icon:'🥘', t:{bn:'দেশি ও উৎসবের খাবার',en:'Cultural and festival foods'},
      body:`<ul class="plain">
        <li>${Util.tt('দেশি মশলা (হলুদ, জিরা, ধনে, দারুচিনি, এলাচ) ৬ মাস থেকেই দেওয়া যায় — শুধু ঝাল ও লবণ বাদ। এতেই বাচ্চা পারিবারিক স্বাদে অভ্যস্ত হয়।','Local spices such as turmeric, cumin, coriander, cinnamon and cardamom are fine from 6 months — only chilli and salt are excluded. This is how baby learns the family palate.')}</li>
        <li>${Util.tt('ঈদ বা পূজায় বাচ্চাকে বাদ দেবেন না — মাংসের ঝোল থেকে নরম কিমা, পোলাওয়ের ভাত ধুয়ে, পায়েস থেকে চিনি ছাড়া অংশ দেওয়া যায়।','Do not exclude baby at Eid or Puja — soft mince from the curry, rinsed polao rice, or a sugar-free portion of payesh all work.')}</li>
        <li>${Util.tt('উৎসবের খাবারে সাধারণত অনেক চিনি, ঘি ও লবণ থাকে — বাচ্চার জন্য রান্নার শুরুর দিকেই আলাদা অংশ তুলে রাখুন।','Festival food is heavy in sugar, ghee and salt — set aside baby\'s share early in the cooking.')}</li>
        <li>${Util.tt('মিষ্টি, গুড় ও মধু ১ বছরের নিচে নয় (মধু বোটুলিজমের কারণে সম্পূর্ণ নিষিদ্ধ)।','No sweets, molasses or honey under 12 months — honey is entirely off limits because of botulism risk.')}</li>
      </ul>` },

    { id:'grandparents', icon:'👵', t:{bn:'দাদা-দাদি ও পরিবারকে বোঝানো',en:'Bringing grandparents on board'},
      body:`<p>${Util.tt('বাংলাদেশে BLW-এর সবচেয়ে বড় বাধা প্রায়ই পরিবারের বড়দের উদ্বেগ। মনে রাখবেন উদ্বেগটি ভালোবাসা থেকেই আসে — তর্কের বদলে অন্তর্ভুক্তি বেশি কাজ করে।','In Bangladesh the biggest obstacle to BLW is often family elders\' anxiety. Remember it comes from love — including them works far better than arguing.')}</p>`,
      check:[{bn:'তর্ক না করে দেখান — তাদের সামনে একবার সফল খাবার হতে দিন',en:'Show rather than argue — let them watch one successful meal'},
             {bn:'ওয়াক ও দম আটকানোর পার্থক্যটি আগে থেকে শান্তভাবে বুঝিয়ে বলুন',en:'Explain the gag-versus-choke difference calmly, in advance'},
             {bn:'তাদের ভূমিকা দিন — খাবার প্রস্তুত করা, পাশে বসে গল্প করা',en:'Give them a role — preparing the food, sitting alongside and chatting'},
             {bn:'"ডাক্তার/WHO এই পরামর্শ দিয়েছে" — কর্তৃপক্ষের রেফারেন্স অনেক সময় সবচেয়ে কার্যকর',en:'Cite the authority — "the doctor" or "WHO recommends" is often the most persuasive line'},
             {bn:'অ-আলোচ্য নিয়মগুলো স্পষ্ট করে দিন: মধু নয়, লবণ নয়, খাওয়ানোর সময় জোর নয়, একা রেখে যাওয়া নয়',en:'Make the non-negotiables explicit: no honey, no salt, no forcing, never leaving baby alone while eating'},
             {bn:'ছোট ছোট আপস মেনে নিন — সব যুদ্ধ জেতার দরকার নেই',en:'Accept small compromises — you do not need to win every battle'}] },

    { id:'mistakes', icon:'⚠️', t:{bn:'সবচেয়ে সাধারণ ভুলগুলো',en:'The most common mistakes'},
      body:`<ul class="plain">
        <li>${Util.tt('<b>খাবার অতিরিক্ত ছোট করে কাটা।</b> এটি সবচেয়ে সাধারণ ও বিপরীতমুখী ভুল — ছোট গোল টুকরা বড় নরম স্টিকের চেয়ে বেশি ঝুঁকিপূর্ণ।','<b>Cutting food too small.</b> The commonest and most counter-intuitive error — small round pieces are riskier than large soft spears.')}</li>
        <li>${Util.tt('<b>প্রথম ওয়াক দেখে BLW বন্ধ করে দেওয়া।</b>','<b>Abandoning BLW after the first gag.</b>')}</li>
        <li>${Util.tt('<b>পিউরিতে অনেক মাস আটকে থাকা</b> — ৯-১০ মাসের মধ্যে টেক্সচার না বাড়ালে পরে অনীহা তৈরি হয়।','<b>Staying on purée too long</b> — not advancing texture by 9-10 months breeds later refusal.')}</li>
        <li>${Util.tt('<b>আয়রন-সমৃদ্ধ খাবার ভুলে যাওয়া।</b> ৬ মাসের পর বাচ্চার নিজস্ব আয়রন ভাণ্ডার ফুরিয়ে আসে — কলিজা, মাছ, ডিম, মাংস, ডাল ও শাক নিয়মিত দিতে হবে।','<b>Forgetting iron.</b> Baby\'s own iron stores run low after 6 months — liver, fish, egg, meat, dal and greens need to be regular.')}</li>
        <li>${Util.tt('<b>বাচ্চার খাবারে লবণ দেওয়া।</b> শিশুর কিডনি অতিরিক্ত লবণ সামলাতে পারে না।','<b>Adding salt.</b> An infant\'s kidneys cannot handle it.')}</li>
        <li>${Util.tt('<b>খাওয়ার সময় বাচ্চাকে একা রাখা</b> — এটি সবচেয়ে বিপজ্জনক ভুল।','<b>Leaving baby alone while eating</b> — the most dangerous mistake of all.')}</li>
        <li>${Util.tt('<b>হেলানো বা শোয়া অবস্থায় খাওয়ানো।</b>','<b>Feeding reclined or lying down.</b>')}</li>
        <li>${Util.tt('<b>প্রতিদিন ওজন মাপা ও পরিমাণ গোনা।</b> এতে উদ্বেগ বাড়ে ও খাওয়ার সময় চাপ তৈরি হয়।','<b>Weighing daily and counting spoons.</b> It raises anxiety and puts pressure into the meal.')}</li>
      </ul>` },

    { id:'evidence', icon:'📚', t:{bn:'BLW-এর পেছনের গবেষণা',en:'The evidence behind BLW'},
      body:`<ul class="plain">
        <li>${Util.tt('<b>গলায় আটকানোর ঝুঁকি:</b> নিউজিল্যান্ডের BLISS র‍্যান্ডমাইজড ট্রায়ালসহ একাধিক গবেষণায় দেখা গেছে, সঠিক নিরাপত্তা নির্দেশনা মেনে চললে BLW-তে দম আটকানোর ঘটনা প্রথাগত পদ্ধতির তুলনায় বেশি নয়। তবে ওয়াক তোলার ঘটনা বেশি ঘটে — যা ভিন্ন ও নিরাপদ বিষয়।','<b>Choking risk:</b> studies including the BLISS randomised trial in New Zealand found no higher rate of choking than traditional feeding when safety guidance is followed. Gagging is more frequent, which is a different and safe phenomenon.')}</li>
        <li>${Util.tt('<b>ওজন ও স্থূলতা:</b> কিছু পর্যবেক্ষণমূলক গবেষণায় BLW-তে অতিরিক্ত ওজনের হার কম পাওয়া গেছে, তবে র‍্যান্ডমাইজড ট্রায়ালে পার্থক্য নিশ্চিত হয়নি। এখানে প্রমাণ এখনো মিশ্র।','<b>Weight and obesity:</b> some observational studies report lower overweight rates with BLW, but randomised trials have not confirmed a difference. The evidence here remains mixed.')}</li>
        <li>${Util.tt('<b>আয়রন:</b> এটি BLW-এর প্রধান দুর্বলতা হিসেবে চিহ্নিত। BLISS ট্রায়াল দেখিয়েছে প্রতিটি বেলায় একটি আয়রন-সমৃদ্ধ খাবার নিশ্চিত করলে এই ঘাটতি দূর করা যায় — তাই এই অ্যাপের প্রতিটি পরিকল্পনায় আয়রনের উৎস রাখা হয়েছে।','<b>Iron:</b> identified as BLW\'s main weak point. BLISS showed that deliberately including an iron-rich food at each meal closes the gap — which is why every plan in this app includes an iron source.')}</li>
        <li>${Util.tt('<b>খাদ্য গ্রহণের ধরন:</b> BLW-তে বাচ্চারা সাধারণত নিজের ক্ষুধা-তৃপ্তির সংকেত ভালোভাবে অনুসরণ করে এবং পারিবারিক খাবারে দ্রুত অভ্যস্ত হয়।','<b>Eating behaviour:</b> BLW infants generally show better responsiveness to their own satiety cues and adapt to family foods faster.')}</li>
        <li>${Util.tt('<b>সারসংক্ষেপ:</b> WHO, NHS ও AAP কোনো একটি পদ্ধতিকে বাধ্যতামূলক করে না। মিশ্র পদ্ধতি সম্পূর্ণ বৈধ এবং বাস্তবে সবচেয়ে বেশি ব্যবহৃত।','<b>Bottom line:</b> WHO, NHS and AAP do not mandate any single method. A mixed approach is entirely valid and is what most families actually do.')}</li>
      </ul>` },
  ];}

  function render(){
    const el = document.getElementById('blwpro-body');
    if(!el) return;
    const topics = TOPICS();
    const totalChecks = Object.keys(checks).length;

    let html = `<div class="v-card tint" style="margin-bottom:20px;">
      <h3>📋 ${Util.tt('চেকলিস্টের অগ্রগতি','Checklist progress')}</h3>
      <p class="v-muted" style="margin:0;">${Util.tt('আপনি এ পর্যন্ত','You have ticked')} <b id="blw-total">${Util.num(totalChecks)}</b> ${Util.tt('টি আইটেম চিহ্নিত করেছেন। অগ্রগতি এই ডিভাইসেই সংরক্ষিত থাকবে।','items so far. Progress is saved on this device.')}</p>
    </div>`;

    topics.forEach(t => {
      let body = t.body || '';
      if(t.check) body += checklist(t.id+'-', t.check);
      html += Util.accordion(`${t.icon} ${Util.t(t.t)}`, body, false);
    });

    html += `<p class="med-note">${Util.tt(
      '⚠ এই গাইড সাধারণ শিক্ষামূলক তথ্য, চিকিৎসা পরামর্শ নয়। বাচ্চার অকাল জন্ম, স্নায়বিক বা গিলতে সংক্রান্ত সমস্যা, গুরুতর একজিমা বা পূর্বে খাবারে প্রতিক্রিয়ার ইতিহাস থাকলে BLW শুরুর আগে অবশ্যই শিশু বিশেষজ্ঞের সাথে আলোচনা করুন।',
      '⚠ This guide is general education, not medical advice. If your baby was premature, has any neurological or swallowing difficulty, significant eczema or a history of reacting to food, discuss BLW with a pediatrician before starting.')}</p>`;
    el.innerHTML = html;
  }

  function init(){ render(); }
  LANG_HOOKS.push(render);
  return { init, toggle };
})();
