
/* =====================================================================
   MODULES 3, 4, 9, 11, 12 — AGE & STAGE GUIDES
   Grouped into one tab with a sub-navigation so the main tab bar stays
   usable on a phone. Each sub-panel renders itself lazily on first view
   and re-renders on language change.
   ===================================================================== */
const Guides = (function(){

  /* ------------------------------------------------------------------
     3. PORTION SIZE GUIDE
     bowl = approximate fraction of a 150 ml katori/bowl, used to size the
     little bowl illustration so the difference between ages is visible.
     ------------------------------------------------------------------ */
  const PORTIONS = [
    { age:6,  meals:{bn:'১-২ বেলা',en:'1-2 meals'}, snacks:{bn:'০',en:'0'},
      bowl:0.15, spoons:2,
      serve:{bn:'২-৩ টেবিল চামচ প্রতি বেলা (শুরুতে ১ চামচও যথেষ্ট)',en:'2-3 tablespoons per meal — even 1 spoon is fine at the very start'},
      milk:{bn:'দিনে ৬-৮ বার বুকের দুধ / ~৭৫০-৯০০ মি.লি. ফর্মুলা',en:'6-8 breastfeeds a day, or about 750-900 ml formula'},
      water:{bn:'খাবারের সাথে খোলা কাপে ২-৩ চুমুক',en:'2-3 sips from an open cup with meals'},
      note:{bn:'এই বয়সে লক্ষ্য পুষ্টি নয়, বরং স্বাদ ও টেক্সচারের সাথে পরিচয়। বেশিরভাগ পুষ্টি দুধ থেকেই আসবে।',en:'At this age the goal is exposure to taste and texture, not calories. Almost all nutrition still comes from milk.'} },
    { age:7,  meals:{bn:'২ বেলা',en:'2 meals'}, snacks:{bn:'০-১',en:'0-1'},
      bowl:0.22, spoons:3,
      serve:{bn:'৩-৪ টেবিল চামচ প্রতি বেলা',en:'3-4 tablespoons per meal'},
      milk:{bn:'দিনে ৬-৭ বার বুকের দুধ / ~৭০০-৯০০ মি.লি. ফর্মুলা',en:'6-7 breastfeeds a day, or about 700-900 ml formula'},
      water:{bn:'প্রতি বেলায় খোলা কাপে কয়েক চুমুক',en:'A few sips from an open cup at each meal'},
      note:{bn:'এখন দ্বিতীয় বেলা যোগ করার ভালো সময়। আয়রন-সমৃদ্ধ খাবার দিনে অন্তত একবার দিন।',en:'A good time to add the second meal. Include an iron-rich food at least once a day.'} },
    { age:8,  meals:{bn:'২-৩ বেলা',en:'2-3 meals'}, snacks:{bn:'১',en:'1'},
      bowl:0.3, spoons:4,
      serve:{bn:'৪-৬ টেবিল চামচ (~১/৩ কাপ) প্রতি বেলা',en:'4-6 tablespoons (about 1/3 cup) per meal'},
      milk:{bn:'দিনে ৫-৬ বার বুকের দুধ / ~৭০০-৮০০ মি.লি. ফর্মুলা',en:'5-6 breastfeeds a day, or about 700-800 ml formula'},
      water:{bn:'দিনে ~৬০-১২০ মি.লি. পর্যন্ত',en:'Up to about 60-120 ml a day'},
      note:{bn:'দলাযুক্ত টেক্সচারে যাওয়ার সবচেয়ে গুরুত্বপূর্ণ সময় — ৯-১০ মাসের পর নতুন টেক্সচার গ্রহণ করা কঠিন হয়ে যায়।',en:'The key window for moving to lumpy textures — after 9-10 months babies accept new textures much less readily.'} },
    { age:9,  meals:{bn:'৩ বেলা',en:'3 meals'}, snacks:{bn:'১',en:'1'},
      bowl:0.38, spoons:5,
      serve:{bn:'১/২ কাপ প্রতি বেলা',en:'About 1/2 cup per meal'},
      milk:{bn:'দিনে ৪-৫ বার বুকের দুধ / ~৬০০-৮০০ মি.লি. ফর্মুলা',en:'4-5 breastfeeds a day, or about 600-800 ml formula'},
      water:{bn:'দিনে ~১২০ মি.লি. পর্যন্ত',en:'Up to about 120 ml a day'},
      note:{bn:'পিন্সার গ্রিপ (বুড়ো আঙুল ও তর্জনী) তৈরি হচ্ছে — ছোট নরম টুকরা দিয়ে অনুশীলন করান।',en:'The pincer grasp is developing — offer small soft pieces to practise with.'} },
    { age:10, meals:{bn:'৩ বেলা',en:'3 meals'}, snacks:{bn:'১-২',en:'1-2'},
      bowl:0.45, spoons:6,
      serve:{bn:'১/২ কাপ প্রতি বেলা + ১টি হালকা খাবার',en:'About 1/2 cup per meal plus a snack'},
      milk:{bn:'দিনে ৪-৫ বার বুকের দুধ / ~৬০০-৭০০ মি.লি. ফর্মুলা',en:'4-5 breastfeeds a day, or about 600-700 ml formula'},
      water:{bn:'দিনে ~১২০-১৮০ মি.লি.',en:'About 120-180 ml a day'},
      note:{bn:'বাচ্চা নিজে চামচ ধরতে চাইতে পারে — দুটি চামচ ব্যবহার করুন, একটি তার হাতে।',en:'Baby may want to hold a spoon — use two spoons, one for them.'} },
    { age:12, meals:{bn:'৩ বেলা',en:'3 meals'}, snacks:{bn:'২',en:'2'},
      bowl:0.6, spoons:8,
      serve:{bn:'১/২ থেকে ৩/৪ কাপ প্রতি বেলা',en:'1/2 to 3/4 cup per meal'},
      milk:{bn:'দিনে ৩-৪ বার বুকের দুধ / ~৩৫০-৫০০ মি.লি. পূর্ণ ননিযুক্ত দুধ',en:'3-4 breastfeeds a day, or about 350-500 ml whole milk'},
      water:{bn:'দিনে ~৪-৬ কাপ (১০০০ মি.লি. পর্যন্ত)',en:'About 4-6 cups a day (up to 1000 ml)'},
      note:{bn:'এখন খাবারই প্রধান পুষ্টির উৎস, দুধ পরিপূরক। বোতল ছেড়ে কাপে যাওয়ার উপযুক্ত সময়।',en:'Food is now the main source of nutrition and milk supports it. A good time to move from bottle to cup.'} },
    { age:18, meals:{bn:'৩ বেলা',en:'3 meals'}, snacks:{bn:'২',en:'2'},
      bowl:0.72, spoons:10,
      serve:{bn:'৩/৪ কাপ প্রতি বেলা',en:'About 3/4 cup per meal'},
      milk:{bn:'দিনে ২-৩ বার বুকের দুধ / ~৩৫০-৫০০ মি.লি. দুধ',en:'2-3 breastfeeds a day, or about 350-500 ml milk'},
      water:{bn:'দিনে ~৫-৬ কাপ',en:'About 5-6 cups a day'},
      note:{bn:'খাওয়ার পরিমাণ দিনে দিনে ওঠানামা করা সম্পূর্ণ স্বাভাবিক — সপ্তাহের গড় দেখুন, একদিনের পরিমাণ নয়।',en:"Appetite swinging day to day is completely normal — judge intake across a week, not a single day."} },
    { age:24, meals:{bn:'৩ বেলা',en:'3 meals'}, snacks:{bn:'২',en:'2'},
      bowl:0.85, spoons:12,
      serve:{bn:'৩/৪ থেকে ১ কাপ প্রতি বেলা (বড়দের এক-তৃতীয়াংশ)',en:'3/4 to 1 cup per meal, roughly a third of an adult portion'},
      milk:{bn:'দিনে ২ বার বুকের দুধ / ~৩৫০-৫০০ মি.লি. দুধ',en:'2 breastfeeds a day, or about 350-500 ml milk'},
      water:{bn:'দিনে ~৫-৭ কাপ',en:'About 5-7 cups a day'},
      note:{bn:'বাচ্চা নিজেই খাবার নির্বাচন করতে চাইবে — কী দেওয়া হবে তা আপনি ঠিক করুন, কতটুকু খাবে তা সে ঠিক করুক।',en:'Toddlers want to choose — you decide what is offered, they decide how much of it to eat.'} },
  ];

  function renderPortions(){
    const el = document.getElementById('sub-portions');
    if(!el) return;
    let html = `<p class="v-muted" style="max-width:70ch; margin-bottom:20px;">${Util.tt(
      'নিচের বাটির ছবিগুলো আনুমানিক — একটি সাধারণ ১৫০ মি.লি. বাটির কতটুকু ভরবে তা বোঝানো হয়েছে। প্রতিটি বাচ্চা আলাদা; ক্ষুধা ও তৃপ্তির সংকেতই সবচেয়ে নির্ভরযোগ্য মাপকাঠি।',
      'The bowls below are approximate — they show roughly how full a standard 150 ml katori would be. Every baby differs; their hunger and fullness cues remain the most reliable guide.')}</p>`;

    html += '<div class="v-grid wide">';
    PORTIONS.forEach(p => {
      const bowlW = 46 + p.bowl * 34;                 /* wider bowl for older ages */
      const bowlH = 26 + p.bowl * 22;
      const fillH = Math.round(bowlH * (0.35 + p.bowl * 0.55));
      html += `<div class="portion-card">
        <div class="age-badge">${Util.num(p.age)} ${Util.tt('মাস','months')}</div>
        <div class="bowl-viz">
          <div class="bowl" style="width:${bowlW}px;height:${bowlH}px;">
            <div class="fill" style="height:${fillH}px;"></div>
          </div>
          <span class="bowl-label">${Util.t(p.serve)}</span>
        </div>
        <div class="spoon-row" aria-hidden="true">${'🥄'.repeat(Math.min(p.spoons, 12))}</div>
        <div class="portion-meta">
          <div class="pm-line"><span>${Util.tt('প্রধান বেলা','Meals per day')}</span><span>${Util.t(p.meals)}</span></div>
          <div class="pm-line"><span>${Util.tt('হালকা খাবার','Snacks per day')}</span><span>${Util.t(p.snacks)}</span></div>
          <div class="pm-line"><span>${Util.tt('দুধ','Breastmilk / formula')}</span><span>${Util.t(p.milk)}</span></div>
          <div class="pm-line"><span>${Util.tt('পানি','Water')}</span><span>${Util.t(p.water)}</span></div>
        </div>
        <p class="v-small" style="margin-top:12px;">💡 ${Util.t(p.note)}</p>
      </div>`;
    });
    html += '</div>';

    html += `<div class="med-note calm">${Util.tt(
      '📌 <b>প্রধান নিয়ম:</b> আপনি ঠিক করবেন কী খাবার, কখন ও কোথায় দেওয়া হবে — বাচ্চা ঠিক করবে কতটুকু খাবে বা আদৌ খাবে কিনা। জোর করে খাওয়ানো দীর্ঘমেয়াদে খাবারের প্রতি অনীহা বাড়ায়।',
      '📌 <b>The division of responsibility:</b> you decide what is offered, and when and where — baby decides how much, or whether, to eat. Forced feeding increases food refusal in the long run.')}</div>`;

    html += `<p class="med-note">${Util.tt(
      '⚠ পরিমাণ নিয়ে উদ্বিগ্ন হলে বা বাচ্চার ওজন বৃদ্ধি থমকে গেলে ওজন-বৃদ্ধির চার্ট দেখে শিশু বিশেষজ্ঞের পরামর্শ নিন। এই তালিকা সাধারণ নির্দেশনা মাত্র।',
      '⚠ If you are worried about intake or weight gain has stalled, have your baby weighed and consult a pediatrician. These figures are general guidance only.')}</p>`;
    el.innerHTML = html;
  }

  /* ------------------------------------------------------------------
     4. TEXTURE PROGRESSION TIMELINE
     ------------------------------------------------------------------ */
  const TEXTURES = [
    { id:'t1', age:{bn:'৬ মাস',en:'6 months'}, icon:'🥣',
      title:{bn:'মসৃণ পিউরি ও মাখা',en:'Smooth purée and mash'},
      what:{bn:'একেবারে মসৃণ, দলামুক্ত। চামচ কাত করলে ধীরে পড়বে — পানির মতো পাতলা নয়, আবার আঠালো ঘনও নয়।',en:'Completely smooth and lump-free. It should drop slowly off a tilted spoon — not watery, not stiff.'},
      examples:{bn:'চালের জাউ · কুমড়ার পিউরি · মসৃণ ডাল · চটকানো কলা · সেদ্ধ আলুর মাখা',en:'Rice porridge · pumpkin purée · smooth dal · mashed banana · potato mash'},
      mistakes:[{bn:'পানি বেশি দিয়ে এত পাতলা করা যে ক্যালরি প্রায় থাকে না',en:'Thinning it down so much with water that it carries almost no calories'},
                {bn:'এই ধাপে কয়েক মাস আটকে থাকা — ৮-৯ মাসেও শুধু পিউরি দিলে পরে দলাযুক্ত খাবারে অনীহা তৈরি হয়',en:'Staying here for months — babies still on purées at 8-9 months often reject lumps later'},
                {bn:'বোতলে করে পিউরি খাওয়ানো',en:'Feeding purée through a bottle'}],
      ready:{bn:'বাচ্চা সাহায্য ছাড়া বসতে পারে, মাথা স্থির রাখতে পারে, খাবারের দিকে হাত বাড়ায় এবং জিভ দিয়ে খাবার ঠেলে বের করার প্রতিবর্তী ক্রিয়া (tongue-thrust) কমে গেছে।',en:'Baby sits with little support, holds their head steady, reaches for food, and the tongue-thrust reflex has faded.'} },
    { id:'t2', age:{bn:'৬-৮ মাস',en:'6-8 months'}, icon:'🥕',
      title:{bn:'নরম ফিঙ্গার ফুড',en:'Soft finger foods'},
      what:{bn:'বড়দের তর্জনীর সমান লম্বা নরম স্টিক, যা দুই আঙুলের চাপে সহজে ভেঙে যায়। মুঠোয় ধরলে খানিকটা বেরিয়ে থাকবে (palmar grasp)।',en:'Soft sticks the length of an adult index finger that squash easily between two fingers. Enough sticks out of the fist for baby to gnaw (palmar grasp).'},
      examples:{bn:'ভাপানো মিষ্টি আলুর স্টিক · নরম গাজর · পাকা আম/পেঁপের টুকরা · অমলেট স্ট্রিপ · নরম রুটি রোল',en:'Steamed sweet-potato sticks · soft carrot · ripe mango or papaya spears · omelette strips · soft ruti rolls'},
      mistakes:[{bn:'গোল চাকতি করে কাটা (গাজর, কলা, শসা) — এটি শ্বাসনালীর আকৃতির সাথে মিলে যায়',en:'Cutting round coins of carrot, banana or cucumber — that shape matches the airway'},
                {bn:'শক্ত/আধা-সেদ্ধ সবজি দেওয়া',en:'Serving firm or half-cooked vegetables'},
                {bn:'কাশি বা ওয়াক (gagging) দেখে ভয় পেয়ে ফিঙ্গার ফুড বন্ধ করে দেওয়া',en:'Stopping finger foods out of fear the first time baby gags'}],
      ready:{bn:'বাচ্চা হাত দিয়ে জিনিস মুঠোয় ধরে মুখে নিতে পারে এবং হাইচেয়ারে সোজা হয়ে বসতে পারে।',en:'Baby can grasp objects in the fist and bring them to their mouth, and sits upright in a highchair.'} },
    { id:'t3', age:{bn:'৮-৯ মাস',en:'8-9 months'}, icon:'🍲',
      title:{bn:'দলাযুক্ত টেক্সচার',en:'Lumpy textures'},
      what:{bn:'কাঁটাচামচে ভাঙা, নরম দলাযুক্ত খাবার — সম্পূর্ণ মসৃণ নয়। এটিই টেক্সচার শেখার সবচেয়ে গুরুত্বপূর্ণ জানালা।',en:'Fork-crushed food with soft lumps rather than a smooth blend. This is the critical window for learning to manage texture.'},
      examples:{bn:'কাঁটাচামচে ভাঙা খিচুড়ি · দলাযুক্ত সবজি মাখা · মিহি কিমা · ছানার ছোট টুকরা · নরম ভাত',en:'Fork-crushed khichuri · lumpy vegetable mash · fine mince · small chana pieces · soft rice'},
      mistakes:[{bn:'ওয়াক তোলার ভয়ে আবার মসৃণ পিউরিতে ফিরে যাওয়া',en:'Retreating to smooth purée because of gagging'},
                {bn:'একসাথে অনেক নতুন টেক্সচার দেওয়া',en:'Introducing several new textures at once'},
                {bn:'দাঁত ওঠেনি বলে দলাযুক্ত খাবার না দেওয়া — মাড়ি দিয়েই বাচ্চা নরম খাবার ভাঙতে পারে',en:'Waiting for teeth — babies mash soft food perfectly well with their gums'}],
      ready:{bn:'জিভ দিয়ে খাবার এক পাশ থেকে অন্য পাশে নিতে পারে, চিবানোর মতো উপর-নিচ চোয়ালের নড়াচড়া শুরু হয়েছে।',en:'Baby moves food side to side with the tongue and has begun an up-and-down chewing motion.'} },
    { id:'t4', age:{bn:'১০-১২ মাস',en:'10-12 months'}, icon:'🔪',
      title:{bn:'কুচানো/কাটা খাবার',en:'Chopped foods'},
      what:{bn:'ছোট ছোট কিউব (~১ সে.মি.), যা বাচ্চা বুড়ো আঙুল ও তর্জনী দিয়ে তুলতে পারে (pincer grasp)।',en:'Small cubes of about 1 cm that baby picks up between thumb and forefinger (pincer grasp).'},
      examples:{bn:'কুচানো নরম সবজি · ছোট পাস্তা · মুরগির মিহি টুকরা · ছানার কিউব · নরম ফলের টুকরা',en:'Chopped soft vegetables · small pasta · small chicken pieces · chana cubes · soft fruit cubes'},
      mistakes:[{bn:'গোটা আঙুর, লিচু, চেরি টমেটো দেওয়া — অবশ্যই লম্বালম্বি চার ভাগ করুন',en:'Serving whole grapes, lychee or cherry tomatoes — always quarter them lengthwise'},
                {bn:'গোটা বাদাম, পপকর্ন, শক্ত ক্যান্ডি দেওয়া (৪ বছর পর্যন্ত নয়)',en:'Whole nuts, popcorn or hard sweets — avoid these until about age 4'},
                {bn:'বাচ্চা নিজে খেতে চাইলে সব নিয়ন্ত্রণ নিজের হাতে রাখা',en:'Taking over when baby wants to feed themselves'}],
      ready:{bn:'পিন্সার গ্রিপ তৈরি হয়েছে, ছোট জিনিস তুলতে পারে, চামচ ধরার আগ্রহ দেখায়।',en:'The pincer grasp has developed, baby picks up small objects and shows interest in holding a spoon.'} },
    { id:'t5', age:{bn:'১২+ মাস',en:'12+ months'}, icon:'🍽',
      title:{bn:'পরিবারের খাবার',en:'Family meals'},
      what:{bn:'পরিবারের একই রান্না, শুধু লবণ-ঝাল যোগ করার আগে আলাদা করে নেওয়া এবং প্রয়োজনে ছোট করে কাটা।',en:'The same food the family eats, portioned out before salt and chilli and cut down where needed.'},
      examples:{bn:'ভাত-ডাল-মাছ · কিমা তরকারি · রুটি-সবজি · খিচুড়ি · নরম পিঠা',en:'Rice, dal and fish · keema curry · ruti with vegetables · khichuri · soft pitha'},
      mistakes:[{bn:'বাচ্চার জন্য সবসময় আলাদা "বেবি ফুড" রান্না করা — এতে খাবারের বৈচিত্র্য কমে',en:'Cooking separate "baby food" indefinitely, which narrows the range of flavours baby accepts'},
                {bn:'পরিবারের সাথে না বসিয়ে আলাদা সময়ে খাওয়ানো',en:'Feeding baby separately instead of at the family table'},
                {bn:'বাড়তি লবণ ও চিনিযুক্ত প্যাকেটজাত খাবারে অভ্যস্ত করা',en:'Building a habit of packaged foods high in salt and sugar'}],
      ready:{bn:'বাচ্চা বেশিরভাগ টেক্সচার সামলাতে পারে, চামচ ব্যবহারের চেষ্টা করে এবং পরিবারের খাবারে আগ্রহ দেখায়।',en:'Baby manages most textures, attempts to use a spoon and shows interest in what everyone else is eating.'} },
  ];

  function renderTexture(){
    const el = document.getElementById('sub-texture');
    if(!el) return;
    let html = `<p class="v-muted" style="max-width:70ch; margin-bottom:20px;">${Util.tt(
      'প্রতিটি ধাপে ট্যাপ করে বিস্তারিত দেখুন। বয়স নির্দেশক মাত্র — কিছু বাচ্চা আগে, কিছু পরে প্রস্তুত হয়। তবে ৯-১০ মাসের মধ্যে দলাযুক্ত টেক্সচার শুরু করা গুরুত্বপূর্ণ।',
      'Tap any stage for the detail. Ages are indicative — some babies move faster, some slower. What matters is starting lumpy textures by around 9-10 months.')}</p><div class="timeline">`;

    TEXTURES.forEach((s,i) => {
      html += `<div class="tl-item${i===0?' open':''}" id="tx-${s.id}">
        <button class="tl-head" onclick="Guides.toggleTL('tx-${s.id}')" aria-expanded="${i===0}">
          <span class="tl-t">${s.icon} ${Util.t(s.title)}</span>
          <span class="tl-age">${Util.t(s.age)}</span>
        </button>
        <div class="tl-body">
          <div class="v-row"><div class="v-k">${Util.tt('কেমন টেক্সচার','What the texture should be')}</div><p>${Util.t(s.what)}</p></div>
          <div class="v-row"><div class="v-k">${Util.tt('উদাহরণ','Examples')}</div><p>${Util.t(s.examples)}</p></div>
          <div class="v-row"><div class="v-k warn">${Util.tt('সাধারণ ভুল','Common mistakes')}</div>${Util.list(s.mistakes)}</div>
          <div class="v-row"><div class="v-k">${Util.tt('পরের ধাপে যাওয়ার লক্ষণ','Signs baby is ready to progress')}</div><p>${Util.t(s.ready)}</p></div>
        </div>
      </div>`;
    });
    html += '</div>';

    html += `<div class="med-note calm">${Util.tt(
      '🤢 <b>ওয়াক তোলা (gagging) স্বাভাবিক ও নিরাপদ।</b> এটি শরীরের সুরক্ষা ব্যবস্থা যা খাবারকে সামনে ঠেলে দেয়। বাচ্চার মুখ লাল হবে, শব্দ হবে, চোখে পানি আসতে পারে — কিন্তু সে শ্বাস নিতে পারবে। এই সময় মুখে আঙুল দেবেন না, শান্ত থাকুন। ফার্স্ট এইড ট্যাবে পার্থক্য বিস্তারিত দেওয়া আছে।',
      '🤢 <b>Gagging is normal and protective.</b> It pushes food forward and away from the airway. Baby will go red, make noise and may water at the eyes — but they are breathing. Do not put your fingers in their mouth; stay calm. The First Aid tab explains the difference in detail.')}</div>`;
    el.innerHTML = html;
  }

  function toggleTL(id){
    const item = document.getElementById(id);
    if(!item) return;
    const open = item.classList.toggle('open');
    const btn = item.querySelector('.tl-head');
    if(btn) btn.setAttribute('aria-expanded', open);
  }

  /* ------------------------------------------------------------------
     12. BREASTMILK / FORMULA DEPENDENCY TIMELINE
     milkPct = approximate share of daily energy still coming from milk.
     ------------------------------------------------------------------ */
  const MILK = [
    { age:6,  milkPct:90, bf:{bn:'দিনে ৬-৮ বার, চাহিদা অনুযায়ী',en:'6-8 times a day, on demand'}, fm:{bn:'~৭৫০-৯০০ মি.লি. (৫-৬ ফিড)',en:'About 750-900 ml over 5-6 feeds'},
      meals:{bn:'১-২',en:'1-2'}, snacks:{bn:'০',en:'0'},
      ex:{bn:'সকালে দুধ → ১ ঘণ্টা পর ২ চামচ জাউ → দিনভর দুধ। খাবার এখন "অনুশীলন", পুষ্টির উৎস নয়।',en:'Milk in the morning → 2 spoons of porridge an hour later → milk through the day. Food is practice at this stage, not a nutrition source.'} },
    { age:7,  milkPct:85, bf:{bn:'দিনে ৬-৭ বার',en:'6-7 times a day'}, fm:{bn:'~৭৫০-৯০০ মি.লি.',en:'About 750-900 ml'},
      meals:{bn:'২',en:'2'}, snacks:{bn:'০-১',en:'0-1'},
      ex:{bn:'সকাল ও দুপুরে দুটি ছোট বেলা যোগ হলো; দুধের সংখ্যা এখনো একই।',en:'Two small meals now sit alongside an unchanged number of milk feeds.'} },
    { age:8,  milkPct:75, bf:{bn:'দিনে ৫-৬ বার',en:'5-6 times a day'}, fm:{bn:'~৭০০-৮০০ মি.লি.',en:'About 700-800 ml'},
      meals:{bn:'২-৩',en:'2-3'}, snacks:{bn:'১',en:'1'},
      ex:{bn:'খাবারের পরিমাণ বাড়ছে; দুধ খাবারের ৩০-৪৫ মিনিট পরে দিলে বাচ্চা খাবারে বেশি আগ্রহী থাকে।',en:'Portions are growing; offering milk 30-45 minutes after food keeps baby more interested in the meal.'} },
    { age:9,  milkPct:65, bf:{bn:'দিনে ৪-৫ বার',en:'4-5 times a day'}, fm:{bn:'~৬০০-৮০০ মি.লি.',en:'About 600-800 ml'},
      meals:{bn:'৩',en:'3'}, snacks:{bn:'১',en:'1'},
      ex:{bn:'তিন বেলা খাবার এখন নিয়মিত রুটিন; দুধ ঘুমের আগে ও পরে কেন্দ্রীভূত হতে শুরু করে।',en:'Three meals become the routine; milk starts to cluster around waking and sleep.'} },
    { age:10, milkPct:58, bf:{bn:'দিনে ৪-৫ বার',en:'4-5 times a day'}, fm:{bn:'~৬০০-৭০০ মি.লি.',en:'About 600-700 ml'},
      meals:{bn:'৩',en:'3'}, snacks:{bn:'১-২',en:'1-2'},
      ex:{bn:'খোলা কাপে পানি ও দুধ শেখানোর ভালো সময়।',en:'A good time to practise water and milk from an open cup.'} },
    { age:11, milkPct:52, bf:{bn:'দিনে ৪ বার',en:'4 times a day'}, fm:{bn:'~৫৫০-৬৫০ মি.লি.',en:'About 550-650 ml'},
      meals:{bn:'৩',en:'3'}, snacks:{bn:'১-২',en:'1-2'},
      ex:{bn:'দুধ ও খাবার প্রায় সমান ভূমিকায় আসছে।',en:'Milk and food are moving towards an even share.'} },
    { age:12, milkPct:40, bf:{bn:'দিনে ৩-৪ বার',en:'3-4 times a day'}, fm:{bn:'~৩৫০-৫০০ মি.লি. পূর্ণ ননিযুক্ত গরুর দুধ',en:'About 350-500 ml whole cow milk'},
      meals:{bn:'৩',en:'3'}, snacks:{bn:'২',en:'2'},
      ex:{bn:'এখন খাবারই প্রধান পুষ্টির উৎস। গরুর দুধ প্রধান পানীয় হিসেবে শুরু করা যায়; ফর্মুলা আর আবশ্যক নয়।',en:'Food is now the main source of nutrition. Cow milk can become the main drink; formula is no longer necessary.'} },
    { age:18, milkPct:28, bf:{bn:'দিনে ২-৩ বার',en:'2-3 times a day'}, fm:{bn:'~৩৫০-৫০০ মি.লি.',en:'About 350-500 ml'},
      meals:{bn:'৩',en:'3'}, snacks:{bn:'২',en:'2'},
      ex:{bn:'দিনে ৫০০ মি.লি.-এর বেশি দুধ খেলে আয়রন শোষণ কমে ও খাবারে অরুচি হয় — পরিমাণ নিয়ন্ত্রণে রাখুন।',en:'More than 500 ml of milk a day reduces iron absorption and blunts appetite — keep it capped.'} },
    { age:24, milkPct:22, bf:{bn:'দিনে ১-২ বার (চালিয়ে গেলে)',en:'1-2 times a day if still breastfeeding'}, fm:{bn:'~৩৫০-৫০০ মি.লি.',en:'About 350-500 ml'},
      meals:{bn:'৩',en:'3'}, snacks:{bn:'২',en:'2'},
      ex:{bn:'WHO ২ বছর বা তার বেশি সময় পর্যন্ত বুকের দুধ চালিয়ে যাওয়ার পরামর্শ দেয়, পাশাপাশি পূর্ণ পারিবারিক খাবার।',en:'WHO recommends continuing breastfeeding to 2 years or beyond alongside full family meals.'} },
  ];

  function renderMilk(){
    const el = document.getElementById('sub-milk');
    if(!el) return;
    let html = `<div class="v-card tint" style="margin-bottom:22px;">
      <h3>🍼 ${Util.tt('মূল কথা','The headline')}</h3>
      <p class="v-muted" style="margin:0;">${Util.tt(
        'প্রায় ১২ মাস বয়স পর্যন্ত বুকের দুধ বা ফর্মুলাই বাচ্চার প্রধান পুষ্টির উৎস — সলিড খাবার তার পরিপূরক, বিকল্প নয়। ৬ থেকে ১২ মাসে ধীরে ধীরে ভারসাম্য বদলায়, হঠাৎ নয়। ১২ মাসের পর খাবার প্রধান হয়ে ওঠে এবং দুধ সহায়ক ভূমিকায় নামে।',
        'Until around 12 months, breastmilk or formula remains the primary source of nutrition — solids complement it rather than replace it. The balance shifts gradually between 6 and 12 months, never abruptly. After 12 months food takes the lead and milk moves into a supporting role.')}</p>
    </div>`;

    html += `<div class="split-legend" style="margin-bottom:12px;">
      <span><i style="background:var(--leaf);"></i>${Util.tt('দুধ থেকে ক্যালরি','Calories from milk')}</span>
      <span><i style="background:var(--mustard);"></i>${Util.tt('খাবার থেকে ক্যালরি','Calories from solids')}</span>
    </div><div class="timeline">`;

    MILK.forEach((m,i) => {
      html += `<div class="tl-item${i===0?' open':''}" id="mk-${m.age}">
        <button class="tl-head" onclick="Guides.toggleTL('mk-${m.age}')" aria-expanded="${i===0}">
          <span class="tl-t">${Util.num(m.age)} ${Util.tt('মাস','months')}</span>
          <span class="tl-age">${Util.tt('দুধ','Milk')} ~${Util.num(m.milkPct)}%</span>
        </button>
        <div class="tl-body">
          <div class="split-bar">
            <div class="sb milk" style="width:${m.milkPct}%;">${m.milkPct >= 18 ? Util.num(m.milkPct)+'%' : ''}</div>
            <div class="sb solid" style="width:${100-m.milkPct}%;">${(100-m.milkPct) >= 18 ? Util.num(100-m.milkPct)+'%' : ''}</div>
          </div>
          <p class="v-small" style="margin:0 0 10px;">${Util.tt('আনুমানিক দৈনিক ক্যালরির ভাগ','Approximate share of daily calories')}</p>
          <div class="portion-meta">
            <div class="pm-line"><span>${Util.tt('বুকের দুধ','Breastfeeding')}</span><span>${Util.t(m.bf)}</span></div>
            <div class="pm-line"><span>${Util.tt('ফর্মুলা/দুধ','Formula / milk')}</span><span>${Util.t(m.fm)}</span></div>
            <div class="pm-line"><span>${Util.tt('প্রধান বেলা','Meals per day')}</span><span>${Util.t(m.meals)}</span></div>
            <div class="pm-line"><span>${Util.tt('হালকা খাবার','Snacks per day')}</span><span>${Util.t(m.snacks)}</span></div>
          </div>
          <div class="v-row"><div class="v-k">${Util.tt('বাস্তব উদাহরণ','In practice')}</div><p>${Util.t(m.ex)}</p></div>
        </div>
      </div>`;
    });
    html += '</div>';

    html += Util.accordion(
      '❓ ' + Util.tt('সাধারণ প্রশ্ন','Common questions'),
      Util.accordion(Util.tt('খাবারের আগে না পরে দুধ দেব?','Milk before or after food?'),
        `<p>${Util.tt('৯ মাসের নিচে সাধারণত দুধ আগে দিয়ে ৩০-৪৫ মিনিট পর খাবার দিলে বাচ্চা ক্লান্ত বা অতিরিক্ত ক্ষুধার্ত থাকে না। ৯ মাসের পর ধীরে ধীরে খাবার আগে ও দুধ পরে সরিয়ে আনুন, যাতে খাবারে আগ্রহ বাড়ে।','Under 9 months, milk first with food 30-45 minutes later usually works best so baby is neither exhausted nor frantic. After 9 months, gradually shift to food first and milk afterwards so appetite goes into the meal.')}</p>`) +
      Util.accordion(Util.tt('বাচ্চা খাবার খেলে দুধ কমে যাবে?','Will solids reduce my milk supply?'),
        `<p>${Util.tt('ধীরে ধীরে চাহিদা কমার সাথে সাথে দুধ উৎপাদনও স্বাভাবিকভাবে সমন্বয় হয়। হঠাৎ করে অনেক ফিড বাদ দিলে স্তনে ব্যথা বা দুধ জমে যেতে পারে, তাই ধাপে ধাপে কমান।','Supply adjusts naturally as demand tapers. Dropping several feeds at once can cause engorgement or blocked ducts, so reduce gradually.')}</p>`) +
      Util.accordion(Util.tt('১ বছরের আগে গরুর দুধ দেওয়া যাবে?','Can I give cow milk before 12 months?'),
        `<p>${Util.tt('রান্নার উপকরণ হিসেবে (যেমন খিচুড়ি বা সুজিতে) অল্প পরিমাণে ৬ মাসের পর ব্যবহার করা যায়। তবে ১২ মাসের আগে এটিকে প্রধান পানীয় বানানো উচিত নয় — এতে আয়রন কম থাকে এবং অন্ত্রে সূক্ষ্ম রক্তক্ষরণ হতে পারে।','Small amounts within cooked food such as khichuri or suji are fine from 6 months. It should not become the main drink before 12 months — it is low in iron and can cause microscopic intestinal blood loss.')}</p>`),
      false);

    html += `<p class="med-note">${Util.tt(
      '⚠ এই শতাংশগুলো আনুমানিক গড় — প্রতিটি বাচ্চার প্রয়োজন আলাদা। ফর্মুলার পরিমাণ, দুধ ছাড়ানোর পরিকল্পনা বা বাচ্চার ওজন নিয়ে উদ্বেগ থাকলে শিশু বিশেষজ্ঞের পরামর্শ নিন।',
      '⚠ These percentages are approximate averages — every baby differs. Discuss formula volumes, weaning plans or any weight concern with your pediatrician.')}</p>`;
    el.innerHTML = html;
  }

  /* ------------------------------------------------------------------
     9. TEETHING FOOD GUIDE
     ------------------------------------------------------------------ */
  function renderTeething(){
    const el = document.getElementById('sub-teething');
    if(!el) return;

    const signs = [
      {bn:'মাড়ি ফোলা, লালচে ও শক্ত অনুভূত হওয়া',en:'Swollen, red or firm-feeling gums'},
      {bn:'স্বাভাবিকের চেয়ে বেশি লালা ঝরা',en:'More drooling than usual'},
      {bn:'সবকিছু মুখে দিয়ে কামড়ানোর প্রবণতা',en:'Chewing and biting on everything within reach'},
      {bn:'খিটখিটে ভাব, বিশেষ করে রাতে',en:'Irritability, often worse at night'},
      {bn:'খাওয়ায় সাময়িক অনীহা বা কম খাওয়া',en:'Temporarily eating less or refusing food'},
      {bn:'গাল বা কান ঘষা (একই স্নায়ু পথ)',en:'Rubbing the cheek or ear on the same side'},
      {bn:'ঘুমের ধরন কিছুদিনের জন্য এলোমেলো হওয়া',en:'Disrupted sleep for a few days'},
    ];
    const cold = [
      {bn:'ফ্রিজে ঠান্ডা করা শসার লম্বা স্টিক (খোসা ছাড়া)',en:'Chilled cucumber spears, peeled'},
      {bn:'ঠান্ডা টক দই বা ছানা',en:'Cold plain yogurt or chana'},
      {bn:'ঠান্ডা (জমাট নয়) পাকা আম বা পেঁপের টুকরা',en:'Chilled — not frozen solid — ripe mango or papaya spears'},
      {bn:'ফ্রুট ফিডারে ঠান্ডা ফলের টুকরা',en:'Chilled fruit inside a mesh fruit feeder'},
      {bn:'ঠান্ডা ডাবের পানি অল্প পরিমাণে (৬ মাস+)',en:'A little chilled tender coconut water from 6 months'},
    ];
    const soft = [
      {bn:'নরম খিচুড়ি ও ডাল-ভাত',en:'Soft khichuri and dal-bhat'},
      {bn:'চটকানো কলা, অ্যাভোকাডো বা সেদ্ধ আলু',en:'Mashed banana, avocado or potato'},
      {bn:'মসৃণ সুজি বা ওটসের পরিজ',en:'Smooth suji or oat porridge'},
      {bn:'ভাপানো নরম সবজি',en:'Soft steamed vegetables'},
      {bn:'ঘরে তৈরি ছানা',en:'Home-made chana'},
    ];
    const avoid = [
      {bn:'শক্ত বিস্কুট বা রাস্ক — ভেঙে ধারালো টুকরা হয়ে গলায় আটকাতে পারে',en:'Hard biscuits or rusks — they snap into sharp pieces that can choke'},
      {bn:'বরফের মতো সম্পূর্ণ জমাট খাবার — মাড়ির নরম টিস্যুর ক্ষতি করতে পারে',en:'Rock-solid frozen food — it can damage delicate gum tissue'},
      {bn:'টক/অ্যাসিডিক ফল বেশি পরিমাণে (লেবু, আনারস) — জ্বালা বাড়ায়',en:'Large amounts of acidic fruit such as lemon or pineapple, which sting sore gums'},
      {bn:'মিষ্টি খাবার ও জুস — দাঁত ওঠার সময়েই ক্ষয়ের ঝুঁকি শুরু হয়',en:'Sugary foods and juice — decay risk begins the moment teeth appear'},
      {bn:'অ্যাম্বার নেকলেস ও নাম্বিং জেল — নিরাপত্তা সংস্থাগুলো এগুলো নিরুৎসাহিত করে',en:'Amber necklaces and numbing gels — safety agencies advise against both'},
    ];
    const normal = [
      {bn:'কয়েকদিন কম খাওয়া ও বেশি দুধ চাওয়া',en:'Eating less and wanting more milk for a few days'},
      {bn:'সামান্য বেশি লালা ও নরম পায়খানা',en:'Extra drooling and slightly looser stools'},
      {bn:'সামান্য উষ্ণ শরীর (৩৮°C-এর নিচে)',en:'Feeling slightly warm, but under 38°C'},
      {bn:'মাড়িতে সাদা বিন্দু বা ছোট নীলচে ফোলা (eruption cyst) — সাধারণত নিজেই সেরে যায়',en:'A white spot or a small bluish eruption cyst on the gum, which usually resolves on its own'},
    ];
    const doctor = [
      {bn:'১০০.৪°F (৩৮°C) বা তার বেশি জ্বর — এটি দাঁত ওঠার কারণে হয় না, অন্য সংক্রমণ খুঁজতে হবে',en:'A fever of 38°C/100.4°F or higher — teething does not cause this, so look for another cause'},
      {bn:'ডায়রিয়া, বমি বা শরীরে র‍্যাশ',en:'Diarrhoea, vomiting or a body rash'},
      {bn:'২৪ ঘণ্টার বেশি সব ধরনের খাবার ও তরল প্রত্যাখ্যান',en:'Refusing all food and fluid for more than 24 hours'},
      {bn:'প্রস্রাব কমে যাওয়া বা পানিশূন্যতার লক্ষণ',en:'Reduced wet nappies or other signs of dehydration'},
      {bn:'১৮ মাস বয়সেও একটিও দাঁত না ওঠা',en:'No teeth at all by 18 months'},
    ];

    let html = `<div class="v-grid wide">
      <div class="v-card"><h3>🦷 ${Util.tt('দাঁত ওঠার লক্ষণ','Signs of teething')}</h3>${Util.list(signs)}</div>
      <div class="v-card"><h3>🧊 ${Util.tt('ঠান্ডা খাবার যা আরাম দেয়','Cold foods that soothe')}</h3>${Util.list(cold)}
        <p class="v-small" style="margin-top:10px;">${Util.tt('ঠান্ডা মানে ফ্রিজের ঠান্ডা — ডিপ ফ্রিজে জমাট নয়।','Chilled means fridge-cold, not frozen hard.')}</p></div>
      <div class="v-card"><h3>🥣 ${Util.tt('নরম খাবার','Soft foods that go down easily')}</h3>${Util.list(soft)}</div>
      <div class="v-card" style="border-color:#E8B9A8;background:#FDF4F0;"><h3 style="color:var(--alert);">🚫 ${Util.tt('যা এড়িয়ে চলবেন','Foods and items to avoid')}</h3>${Util.list(avoid)}</div>
      <div class="v-card"><h3>✅ ${Util.tt('যা স্বাভাবিক','What is normal')}</h3>${Util.list(normal)}</div>
      <div class="v-card" style="border-color:#E8B9A8;background:#FDF4F0;"><h3 style="color:var(--alert);">👨‍⚕️ ${Util.tt('কখন ডাক্তার দেখাবেন','When to see a doctor')}</h3>${Util.list(doctor)}</div>
    </div>`;

    html += `<h3 style="margin:26px 0 12px;">🍽 ${Util.tt('দাঁত ওঠার দিনের মেনু আইডিয়া','Meal ideas for a teething day')}</h3>
    <div class="v-grid">
      <div class="v-card"><h4>🌅 ${Util.tt('সকাল','Morning')}</h4><p class="v-muted">${Util.tt('ঠান্ডা টক দইয়ের সাথে চটকানো কলা, অথবা হালকা গরম মসৃণ সুজি।','Cold plain yogurt with mashed banana, or lukewarm smooth suji.')}</p></div>
      <div class="v-card"><h4>☀️ ${Util.tt('দুপুর','Midday')}</h4><p class="v-muted">${Util.tt('নরম খিচুড়ি — স্বাভাবিকের চেয়ে একটু বেশি পাতলা করে, হালকা গরম অবস্থায়।','Soft khichuri, thinned a little more than usual and served just warm.')}</p></div>
      <div class="v-card"><h4>🌤 ${Util.tt('বিকেল','Afternoon')}</h4><p class="v-muted">${Util.tt('ফ্রিজে ঠান্ডা করা শসার স্টিক বা ফ্রুট ফিডারে ঠান্ডা আম — সরাসরি তদারকিতে।','Chilled cucumber spears or cold mango in a fruit feeder, under direct supervision.')}</p></div>
      <div class="v-card"><h4>🌙 ${Util.tt('রাত','Evening')}</h4><p class="v-muted">${Util.tt('ডাল-ভাত মাখা; কম চিবাতে হয় এমন নরম খাবারই ভালো। খাওয়ার আগে পরিষ্কার আঙুলে মাড়ি হালকা ম্যাসাজ করলে আরাম হয়।','Dal-bhat mash — anything needing little chewing. A gentle gum massage with a clean finger before the meal often helps.')}</p></div>
    </div>`;

    html += `<div class="v-card tint" style="margin-top:22px;"><h3>💧 ${Util.tt('পানি ও হাইড্রেশন','Hydration tips')}</h3>
      <p class="v-muted">${Util.tt('অতিরিক্ত লালা ঝরায় শরীর থেকে বাড়তি তরল বেরিয়ে যায়। খোলা কাপে বারবার অল্প অল্প পানি দিন, এবং বুকের দুধ/ফর্মুলা চাহিদা অনুযায়ী চালিয়ে যান — দাঁত ওঠার সময় বাচ্চারা প্রায়ই খাবারের চেয়ে দুধ বেশি চায়, যা কয়েকদিনের জন্য সম্পূর্ণ স্বাভাবিক।','Extra drooling means extra fluid loss. Offer frequent small sips from an open cup and keep breastmilk or formula on demand — babies often want more milk and less food while teething, which is completely normal for a few days.')}</p></div>`;

    html += `<p class="med-note">${Util.tt(
      '⚠ দাঁত ওঠা একটি স্বাভাবিক প্রক্রিয়া, রোগ নয়। উচ্চ জ্বর, ডায়রিয়া বা বমিকে "দাঁত উঠছে" বলে ধরে নেবেন না — এগুলোর আলাদা কারণ থাকে এবং ডাক্তার দেখানো প্রয়োজন। কোনো ওষুধ বা জেল ব্যবহারের আগে চিকিৎসকের পরামর্শ নিন।',
      '⚠ Teething is a normal process, not an illness. Never attribute high fever, diarrhoea or vomiting to teething — those have separate causes and need medical review. Consult a doctor before using any medication or gel.')}</p>`;
    el.innerHTML = html;
  }

  /* ------------------------------------------------------------------
     11. SCREEN-FREE MEALTIMES
     ------------------------------------------------------------------ */
  function renderScreens(){
    const el = document.getElementById('sub-screens');
    if(!el) return;

    let html = `<div class="v-card tint" style="margin-bottom:22px;">
      <h3>📵 ${Util.tt('কেন খাওয়ার সময় স্ক্রিন এড়ানো উচিত','Why screens and meals do not mix')}</h3>
      <p class="v-muted" style="margin:0;">${Util.tt(
        'WHO ২ বছরের কম বয়সী শিশুদের জন্য কোনো ধরনের স্ক্রিন টাইম সুপারিশ করে না, এবং AAP-ও একই বয়সসীমা নির্দেশ করে (ভিডিও কল ব্যতিক্রম)। খাওয়ার সময় স্ক্রিন এই সাধারণ পরামর্শের সবচেয়ে গুরুত্বপূর্ণ ব্যতিক্রমগুলোর একটি, কারণ এটি শুধু সময় নষ্ট করে না — এটি বাচ্চার নিজের ক্ষুধা বোঝার ক্ষমতাকেই দুর্বল করে দেয়।',
        'WHO recommends no screen time at all for children under 2, and the AAP draws the same line apart from video calls. Screens at mealtimes matter most, because they do not simply pass time — they actively weaken a baby\'s ability to read their own hunger.')}</p>
    </div>`;

    const evidence = [
      { t:{bn:'🧠 মস্তিষ্কের বিকাশ',en:'🧠 Brain development'},
        p:{bn:'জীবনের প্রথম দুই বছরে মস্তিষ্ক মূলত ত্রিমাত্রিক জগতের সাথে সরাসরি মিথস্ক্রিয়ার মাধ্যমে শেখে — স্পর্শ, গন্ধ, ওজন, তাপমাত্রা। খাবার হাতে নিয়ে অনুভব করা নিজেই একটি শক্তিশালী শেখার অভিজ্ঞতা, যা স্ক্রিন প্রতিস্থাপন করতে পারে না।',en:'In the first two years the brain learns mainly through direct interaction with the three-dimensional world — touch, smell, weight, temperature. Handling food is itself a rich learning experience that a screen cannot substitute for.'} },
      { t:{bn:'🍽 রেসপন্সিভ ফিডিং',en:'🍽 Responsive feeding'},
        p:{bn:'স্ক্রিনের দিকে তাকিয়ে থাকা অবস্থায় বাচ্চা যান্ত্রিকভাবে মুখ খোলে ও গেলে, কিন্তু "পেট ভরে গেছে" সংকেতটি চিনতে পারে না। এতে অতিরিক্ত খাওয়ার অভ্যাস তৈরি হয় এবং পরবর্তী জীবনে ক্ষুধা নিয়ন্ত্রণে সমস্যা হতে পারে।',en:'While watching a screen, a baby opens and swallows mechanically but never registers the "I am full" signal. This trains overeating and can disrupt appetite regulation later in life.'} },
      { t:{bn:'👂 মনোযোগ',en:'👂 Attention'},
        p:{bn:'দ্রুত পরিবর্তনশীল দৃশ্য ও শব্দ শিশুর মনোযোগকে বাইরের উদ্দীপনার উপর নির্ভরশীল করে তোলে; ফলে ধীরগতির, শান্ত কাজে (যেমন নিজে খাওয়া) মনোযোগ ধরে রাখা কঠিন হয়।',en:'Rapidly changing images and sounds make attention dependent on external stimulation, so slower, quieter activities such as self-feeding become harder to sustain.'} },
      { t:{bn:'🗣 ভাষার বিকাশ',en:'🗣 Language'},
        p:{bn:'খাবারের টেবিল দিনের অন্যতম প্রধান কথা বলার সুযোগ। স্ক্রিন চললে বাবা-মা ও বাচ্চার মধ্যে শব্দ বিনিময় নাটকীয়ভাবে কমে যায় — আর শোনা শব্দের সংখ্যাই ভাষার বিকাশের সবচেয়ে শক্তিশালী পূর্বাভাস।',en:'The table is one of the day\'s biggest talking opportunities. With a screen running, the back-and-forth between parent and child drops sharply — and the number of words heard is the strongest predictor of language development.'} },
      { t:{bn:'👨‍👩‍👧 পারিবারিক মিথস্ক্রিয়া',en:'👨‍👩‍👧 Family interaction'},
        p:{bn:'বাচ্চারা মূলত অনুকরণ করে শেখে। পরিবারের সবাইকে একই খাবার খেতে দেখলে নতুন খাবার গ্রহণের সম্ভাবনা অনেক বেড়ে যায় — স্ক্রিন এই মডেলিং সম্পূর্ণ বন্ধ করে দেয়।',en:'Babies learn largely by imitation. Seeing the family eat the same food dramatically raises acceptance of it — a screen shuts that modelling down entirely.'} },
    ];
    html += '<div class="v-grid wide">' + evidence.map(e =>
      `<div class="v-card"><h4>${Util.t(e.t)}</h4><p class="v-muted" style="margin:0;">${Util.t(e.p)}</p></div>`).join('') + '</div>';

    html += `<h3 style="margin:26px 0 14px;">⚖️ ${Util.tt('করণীয় ও বর্জনীয়','Do and Don\'t')}</h3>
    <div class="dd-grid">
      <div class="dd-card do">
        <h3>✅ ${Util.tt('করণীয়','Do')}</h3>
        <ul>
          <li>${Util.tt('সবাই একসাথে বসে খান, বাচ্চাকেও টেবিলে রাখুন।','Sit and eat together with baby at the table.')}</li>
          <li>${Util.tt('খাবারের নাম, রং ও স্বাদ নিয়ে কথা বলুন — এটিই খাওয়ার সময়ের "বিনোদন"।','Talk about the food, its colours and flavours — that is the entertainment.')}</li>
          <li>${Util.tt('বাচ্চাকে হাত দিয়ে খাবার ছুঁতে, নাড়াচাড়া করতে দিন।','Let baby touch, squeeze and explore the food.')}</li>
          <li>${Util.tt('খাবারের সময় ২০-৩০ মিনিটে সীমাবদ্ধ রাখুন।','Keep meals to 20-30 minutes.')}</li>
          <li>${Util.tt('বাচ্চা না খেতে চাইলে শান্তভাবে খাবার সরিয়ে নিন — পরের বেলায় আবার দিন।','If baby is done, calmly remove the food and try again at the next meal.')}</li>
          <li>${Util.tt('টিভি বন্ধ রাখুন, ফোন টেবিলের বাইরে রাখুন — বড়দেরটাও।','Turn the TV off and keep phones off the table, adults included.')}</li>
        </ul>
      </div>
      <div class="dd-card dont">
        <h3>🚫 ${Util.tt('বর্জনীয়','Don\'t')}</h3>
        <ul>
          <li>${Util.tt('কার্টুন বা ইউটিউব চালিয়ে "মনোযোগ সরিয়ে" খাওয়ানো।','Using cartoons or YouTube to distract baby into eating.')}</li>
          <li>${Util.tt('ফোন হাতে ধরিয়ে দিয়ে দ্রুত চামচ ভরে দেওয়া।','Handing over a phone and spooning food in quickly.')}</li>
          <li>${Util.tt('পুরো বাটি শেষ করার জন্য চাপ দেওয়া বা জোর করা।','Pressuring or forcing baby to finish the bowl.')}</li>
          <li>${Util.tt('খাবারকে পুরস্কার বা শাস্তি হিসেবে ব্যবহার করা।','Using food as a reward or a punishment.')}</li>
          <li>${Util.tt('হাঁটতে হাঁটতে বা খেলনার পেছনে ছুটে খাওয়ানো।','Feeding while walking around or chasing baby with a spoon.')}</li>
          <li>${Util.tt('বাচ্চা এলোমেলো করছে বলে বারবার হাত মুছে দেওয়া — এতে অন্বেষণ থেমে যায়।','Constantly wiping baby\'s hands mid-meal, which interrupts exploration.')}</li>
        </ul>
      </div>
    </div>`;

    const alts = [
      {bn:'হাইচেয়ারের ট্রেতে দুই-তিনটি রঙিন খাবার একসাথে দিন — খাবার নিজেই সবচেয়ে বড় আকর্ষণ',en:'Put two or three colourful foods on the tray — the food itself is the best entertainment'},
      {bn:'বাচ্চাকে একটি নিজের চামচ ধরিয়ে দিন (আপনার হাতে আরেকটি)',en:'Give baby their own spoon while you hold a second one'},
      {bn:'খাবার নিয়ে ছড়া বা গান',en:'Sing a short food rhyme or song'},
      {bn:'আয়নার সামনে বসিয়ে খাওয়ানো — অনেক বাচ্চা নিজেকে দেখে মুগ্ধ হয়',en:'Sit facing a mirror — many babies are fascinated by watching themselves'},
      {bn:'বাচ্চার সামনে বসে নিজে একই খাবার খান ও শব্দ করে উপভোগ করুন',en:'Sit opposite baby and eat the same food yourself, audibly enjoying it'},
      {bn:'ভাই-বোন বা দাদা-দাদিকে টেবিলে যুক্ত করুন',en:'Bring siblings or grandparents to the table'},
    ];
    html += `<div class="v-card" style="margin-top:22px;"><h3>🎈 ${Util.tt('স্ক্রিনের বদলে যা করা যায়','Alternatives to screens')}</h3>${Util.list(alts)}</div>`;

    html += Util.accordion('🔄 ' + Util.tt('স্ক্রিন থেকে ধীরে ধীরে বের হয়ে আসার উপায়','How to transition away from screens'),
      `<ol class="steps">
        <li>${Util.tt('<b>একবারে সব বন্ধ নয়।</b> প্রথমে দিনের একটি বেলা বেছে নিন (সাধারণত সকালের নাশতা সবচেয়ে সহজ) এবং শুধু সেই বেলায় স্ক্রিন বন্ধ রাখুন।','<b>Do not stop everything at once.</b> Pick one meal — breakfast is usually easiest — and make only that one screen-free.')}</li>
        <li>${Util.tt('<b>আওয়াজ আগে, ছবি পরে।</b> কয়েকদিন ভিডিওর বদলে শুধু গান চালান, তারপর সেটিও কমিয়ে দিন।','<b>Sound before pictures.</b> Swap the video for music only for a few days, then reduce that too.')}</li>
        <li>${Util.tt('<b>প্রথম ২-৩ দিন কম খাওয়া স্বাভাবিক।</b> এটি পিছিয়ে যাওয়া নয় — বাচ্চা নতুন করে নিজের ক্ষুধা চিনতে শিখছে।','<b>Expect smaller intake for 2-3 days.</b> That is not a setback — baby is relearning their own hunger signals.')}</li>
        <li>${Util.tt('<b>পরিবেশ বদলান।</b> টিভি দেখা যায় না এমন জায়গায় হাইচেয়ার সরান।','<b>Change the setting.</b> Move the highchair to where the TV is not visible.')}</li>
        <li>${Util.tt('<b>পুরো পরিবার এক নিয়মে চলুন।</b> বড়রা ফোন ব্যবহার করলে বাচ্চার কাছে নিয়মটি অর্থহীন হয়ে যায়।','<b>Apply the rule to everyone.</b> The rule means nothing to a child if adults are on their phones.')}</li>
        <li>${Util.tt('<b>এক-দুই সপ্তাহ সময় দিন।</b> বেশিরভাগ পরিবারে ৭-১৪ দিনে নতুন অভ্যাস স্থিতিশীল হয়।','<b>Give it one to two weeks.</b> In most families the new habit settles within 7-14 days.')}</li>
      </ol>`, false);

    html += Util.accordion('😢 ' + Util.tt('স্ক্রিন ছাড়া কান্না সামলাবেন কীভাবে','Handling crying without a screen'),
      `<ul class="plain">
        <li>${Util.tt('প্রথমে কারণ খুঁজুন: ক্লান্তি, অতিরিক্ত ক্ষুধা, দাঁতের ব্যথা নাকি একঘেয়েমি?','First check the cause: tiredness, over-hunger, teething pain or boredom?')}</li>
        <li>${Util.tt('খাবারের সময় ঘুমের ঠিক আগে না রাখুন — ক্লান্ত বাচ্চা কখনোই ভালো খায় না।','Do not schedule meals right before a nap — an exhausted baby never eats well.')}</li>
        <li>${Util.tt('কাঁদলে খাবার জোর করে চালিয়ে যাবেন না; ৫ মিনিটের বিরতি নিয়ে কোলে নিয়ে শান্ত করুন, তারপর আবার বসান।','If baby cries, do not push on; take a five-minute break, settle them on your lap, then return to the table.')}</li>
        <li>${Util.tt('বাচ্চার আবেগকে ভাষা দিন: "তুমি রেগে গেছ, খাবারটা গরম লাগছে?" — এতে সে বুঝতে পারে তাকে বোঝা হচ্ছে।','Name the feeling: "You are frustrated — is it too hot?" It helps baby feel understood.')}</li>
        <li>${Util.tt('একটি বেলা খারাপ গেলে সেটি নিয়ে দুশ্চিন্তা করবেন না — সপ্তাহের গড়ই আসল।','One bad meal does not matter — judge across the week.')}</li>
      </ul>`, false);

    html += `<p class="med-note calm">${Util.tt(
      'ℹ️ বাস্তবতা: অসুস্থতা, ভ্রমণ বা কঠিন দিনে মাঝে মাঝে ব্যতিক্রম হতেই পারে। লক্ষ্য নিখুঁত হওয়া নয় — লক্ষ্য হলো স্ক্রিন যেন খাওয়ানোর নিয়মিত হাতিয়ার না হয়ে ওঠে।',
      'ℹ️ Realistically, illness, travel or a hard day will produce exceptions. The goal is not perfection — it is that the screen does not become a routine feeding tool.')}</p>`;
    el.innerHTML = html;
  }

  /* ---- Sub-tab switching ---- */
  const RENDERERS = { portions:renderPortions, texture:renderTexture, milk:renderMilk, teething:renderTeething, screens:renderScreens };
  let rendered = {};

  function show(id){
    document.querySelectorAll('#tab-guides .subpanel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('#guides-subnav button').forEach(b => b.classList.toggle('active', b.dataset.sub === id));
    const panel = document.getElementById('sub-'+id);
    if(panel) panel.classList.add('active');
    if(!rendered[id]){ RENDERERS[id](); rendered[id] = true; }
  }

  function init(){ rendered = {}; show('portions'); }

  /* On language change: drop the render cache, repaint the visible panel and
     clear the hidden ones so no stale-language markup is left in the DOM.
     Hidden panels repaint lazily the next time show() opens them. */
  LANG_HOOKS.push(function(){
    rendered = {};
    document.querySelectorAll('#tab-guides .subpanel').forEach(function(p){
      if(!p.classList.contains('active')) p.innerHTML = '';
    });
    const active = document.querySelector('#tab-guides .subpanel.active');
    if(active){
      const id = active.id.replace('sub-','');
      if(RENDERERS[id]){ RENDERERS[id](); rendered[id] = true; }
    }
  });

  return { init, show, toggleTL, PORTIONS, MILK, TEXTURES };
})();
