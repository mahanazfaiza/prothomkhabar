
/* =====================================================================
   MODULE 5 — CHOKING vs GAGGING / FIRST AID
   Educational reference only. Written to match the standard infant
   choking sequence taught by the Red Cross, NHS and AAP: 5 back blows,
   5 chest thrusts, repeat, while emergency help is on the way.
   No abdominal thrusts under 1 year.
   ===================================================================== */
const FirstAid = (function(){

  const GAG = {
    title:{bn:'স্বাভাবিক ওয়াক (Gagging)',en:'Normal gagging'},
    tagline:{bn:'শরীরের নিজস্ব সুরক্ষা ব্যবস্থা — এটি কাজ করছে, ব্যর্থ হচ্ছে না।',en:'The body\'s own safety reflex — it is working, not failing.'},
    signs:[{bn:'বাচ্চা জোরে কাশে বা ওয়াক তোলে',en:'Baby coughs forcefully or retches'},
           {bn:'জিভ সামনের দিকে ঠেলে খাবার বের করে আনে',en:'The tongue thrusts forward and pushes food out'},
           {bn:'মুখ লালচে হয়ে যায়',en:'The face goes red'},
           {bn:'চোখে পানি আসতে পারে',en:'Eyes may water'}],
    sounds:[{bn:'জোরে কাশির শব্দ',en:'Loud coughing'},
            {bn:'ওয়াক তোলার বা গলা পরিষ্কারের শব্দ',en:'Retching or throat-clearing noises'},
            {bn:'কান্না বা আওয়াজ করতে পারে — মানে বাতাস চলাচল করছে',en:'Able to cry or make sound, which means air is moving'}],
    look:[{bn:'মুখ লাল, কিন্তু ঠোঁট ও নখ গোলাপি থাকে',en:'Red face, but lips and nails stay pink'},
          {bn:'চোখ খোলা, সচেতন',en:'Eyes open and alert'}],
    behave:[{bn:'কিছুক্ষণ অস্বস্তি, তারপর নিজেই স্বাভাবিক হয়ে যায়',en:'Brief distress, then settles on their own'},
            {bn:'প্রায়ই আবার খেতে শুরু করে',en:'Often carries straight on eating'},
            {bn:'৫-১০ সেকেন্ডের মধ্যেই শেষ হয়',en:'Usually over within 5-10 seconds'}],
    action:[{bn:'শান্ত থাকুন এবং দেখুন — এটিই সবচেয়ে সহায়ক কাজ',en:'Stay calm and watch — this is the most helpful thing you can do'},
            {bn:'বাচ্চাকে সোজা হয়ে বসা অবস্থায় থাকতে দিন',en:'Let baby stay sitting upright'},
            {bn:'শান্ত মুখে তাকিয়ে থাকুন; আপনার আতঙ্ক বাচ্চাকেও আতঙ্কিত করে',en:'Keep your face calm — your panic becomes their panic'},
            {bn:'নিজে নিজে সামলাতে দিন — কাশিই সবচেয়ে কার্যকর উপায়',en:'Let them resolve it — coughing is the most effective tool there is'}],
  };

  const CHOKE = {
    title:{bn:'প্রকৃত দম আটকানো (Choking)',en:'True choking'},
    tagline:{bn:'শ্বাসনালী আটকে গেছে — সাথে সাথে ব্যবস্থা নিতে হবে।',en:'The airway is blocked — act immediately.'},
    signs:[{bn:'কোনো শব্দ নেই — কাশতে বা কাঁদতে পারছে না',en:'Silence — cannot cough, cry or speak'},
           {bn:'মুখ নীলচে বা ধূসর হয়ে আসছে (বিশেষত ঠোঁট ও নখ)',en:'Face turning blue or grey, especially lips and nails'},
           {bn:'আতঙ্কিত, বড় বড় চোখ',en:'Panicked, wide eyes'},
           {bn:'বুক ভেতরের দিকে দেবে যাচ্ছে কিন্তু বাতাস ঢুকছে না',en:'Chest pulling in with no air moving'},
           {bn:'গলায় হাত দেওয়া (বড় বাচ্চাদের ক্ষেত্রে)',en:'Clutching at the throat in older children'}],
    sounds:[{bn:'নীরবতা — সবচেয়ে বিপজ্জনক লক্ষণ',en:'Silence — the most dangerous sign of all'},
            {bn:'অথবা উঁচু, সরু হুইসেলের মতো শব্দ',en:'Or a high-pitched, whistling squeak'},
            {bn:'দুর্বল, অকার্যকর কাশি',en:'A weak, ineffective cough'}],
    look:[{bn:'ঠোঁট, মুখ ও নখ নীলচে হয়ে আসা',en:'Lips, face and nails turning blue'},
          {bn:'ঢলে পড়া বা অচেতন হয়ে যাওয়া',en:'Going limp or losing consciousness'}],
    behave:[{bn:'অসহায়ভাবে হাত-পা ছোঁড়া, তারপর নিস্তেজ হয়ে যাওয়া',en:'Frantic movement, then going still'},
            {bn:'নিজে থেকে অবস্থার উন্নতি হয় না',en:'Does not improve on its own'}],
    action:[{bn:'সাথে সাথে জরুরি সাহায্য ডাকুন / কাউকে ডাকতে বলুন',en:'Call for emergency help immediately, or shout for someone to call'},
            {bn:'৫টি পিঠে চাপড় (back blow) দিন',en:'Give 5 back blows'},
            {bn:'৫টি বুকে চাপ (chest thrust) দিন',en:'Give 5 chest thrusts'},
            {bn:'বস্তু বের না হওয়া বা সাহায্য না আসা পর্যন্ত পুনরাবৃত্তি করুন',en:'Repeat until the object clears or help arrives'}],
  };

  function col(d, kind){
    return `<div class="fa-card ${kind}">
      <h3>${kind==='safe'?'🤢':'🚨'} ${Util.t(d.title)}</h3>
      <p class="fa-tagline">${Util.t(d.tagline)}</p>
      <div class="v-row"><div class="v-k ${kind==='danger'?'warn':''}">${Util.tt('লক্ষণ','Signs')}</div>${Util.list(d.signs,'fa-list')}</div>
      <div class="v-row"><div class="v-k ${kind==='danger'?'warn':''}">${Util.tt('শব্দ','Sounds')}</div>${Util.list(d.sounds,'fa-list')}</div>
      <div class="v-row"><div class="v-k ${kind==='danger'?'warn':''}">${Util.tt('চেহারা','Appearance')}</div>${Util.list(d.look,'fa-list')}</div>
      <div class="v-row"><div class="v-k ${kind==='danger'?'warn':''}">${Util.tt('বাচ্চার আচরণ','Baby\'s behaviour')}</div>${Util.list(d.behave,'fa-list')}</div>
      <div class="v-row"><div class="v-k ${kind==='danger'?'warn':''}">${Util.tt('আপনার করণীয়','What you should do')}</div>${Util.list(d.action,'fa-list')}</div>
    </div>`;
  }

  const STEPS_UNDER1 = [
    {bn:'<b>জোরে সাহায্য ডাকুন।</b> কেউ থাকলে তাকে জরুরি সেবায় ফোন করতে বলুন। আপনি একা থাকলে প্রথমে ১ মিনিট প্রাথমিক চিকিৎসা দিন, তারপর ফোন করুন (স্পিকারে রেখে চালিয়ে যান)।',en:'<b>Shout for help.</b> If someone is with you, have them call emergency services. Alone, give one minute of first aid first, then call and continue on speakerphone.'},
    {bn:'<b>বাচ্চাকে উপুড় করে আপনার হাতের উপর রাখুন,</b> মাথা শরীরের চেয়ে নিচে ও চোয়াল আপনার হাতে ধরা। হাতটি আপনার উরুর উপর রাখুন।',en:'<b>Lay baby face down along your forearm,</b> head lower than the body, supporting the jaw in your hand, with your arm resting on your thigh.'},
    {bn:'<b>৫টি পিঠে চাপড় দিন</b> — দুই কাঁধের হাড়ের মাঝখানে, হাতের তালুর গোড়া দিয়ে, আলাদা আলাদা জোরালো চাপড়।',en:'<b>Give 5 back blows</b> between the shoulder blades with the heel of your hand — five separate, firm blows.'},
    {bn:'<b>বাচ্চাকে চিত করে ঘুরিয়ে নিন</b> (মাথা এখনো নিচের দিকে) এবং মুখে বস্তু দেখা যাচ্ছে কিনা দেখুন।',en:'<b>Turn baby face up</b> along your other forearm, head still lower than the body, and look for the object.'},
    {bn:'<b>৫টি বুকে চাপ দিন</b> — বুকের মাঝখানে, স্তনবৃন্তের রেখার ঠিক নিচে, দুই আঙুল দিয়ে বুকের গভীরতার এক-তৃতীয়াংশ পর্যন্ত ধীরে ও জোরে চাপুন।',en:'<b>Give 5 chest thrusts</b> — two fingers on the breastbone just below the nipple line, pressing about one third of the chest depth, slow and firm.'},
    {bn:'<b>মুখের ভেতর দেখুন।</b> বস্তু স্পষ্ট দেখা গেলে এবং সহজে ধরা গেলে শুধু তখনই বের করুন।',en:'<b>Look in the mouth.</b> Only remove the object if you can clearly see it and easily grasp it.'},
    {bn:'<b>বস্তু বের না হওয়া পর্যন্ত ৫ চাপড় + ৫ চাপ চক্র চালিয়ে যান।</b> বাচ্চা অচেতন হয়ে গেলে শিশুর CPR শুরু করুন এবং জরুরি সেবার নির্দেশনা অনুসরণ করুন।',en:'<b>Keep repeating 5 blows and 5 thrusts.</b> If baby becomes unresponsive, begin infant CPR and follow the emergency dispatcher\'s instructions.'},
  ];

  const NONO = [
    { t:{bn:'অন্ধভাবে মুখে আঙুল ঢোকাবেন না',en:'Never sweep a finger blindly into the mouth'},
      p:{bn:'বস্তু স্পষ্ট দেখতে না পেলে আঙুল দেবেন না — এতে খাবার আরও গভীরে ঢুকে শ্বাসনালী সম্পূর্ণ বন্ধ হয়ে যেতে পারে।',en:'If you cannot clearly see the object, keep your fingers out — a blind sweep can push it deeper and fully block the airway.'} },
    { t:{bn:'বাচ্চাকে উল্টো করে ঝুলিয়ে ঝাঁকাবেন না',en:'Do not hang baby upside down and shake'},
      p:{bn:'এটি অকার্যকর এবং ঘাড় ও মেরুদণ্ডে গুরুতর আঘাতের ঝুঁকি তৈরি করে।',en:'It does not work and risks serious neck and spine injury.'} },
    { t:{bn:'১ বছরের নিচে পেটে চাপ (Heimlich) দেবেন না',en:'No abdominal thrusts (Heimlich) under 1 year'},
      p:{bn:'শিশুদের যকৃত ও অন্যান্য অঙ্গ তুলনামূলকভাবে বড় ও অরক্ষিত — পেটে চাপ দিলে অভ্যন্তরীণ ক্ষতি হতে পারে। ১ বছরের নিচে পিঠে চাপড় ও বুকে চাপই সঠিক পদ্ধতি।',en:'An infant\'s liver and other organs are relatively large and unprotected, so abdominal thrusts can cause internal injury. Under 1 year, back blows and chest thrusts are the correct technique.'} },
    { t:{bn:'কাশতে থাকলে বাধা দেবেন না',en:'Do not interfere while baby is coughing effectively'},
      p:{bn:'জোরালো কাশি সবচেয়ে কার্যকর উপায়। বাচ্চা কাশছে বা কাঁদছে মানে বাতাস চলাচল করছে — তখন পিঠে চাপড় দিলে বরং ক্ষতি হতে পারে।',en:'A strong cough is the most effective mechanism there is. If baby is coughing or crying, air is moving — intervening then can make things worse.'} },
    { t:{bn:'পানি খাওয়াতে চেষ্টা করবেন না',en:'Do not try to give water'},
      p:{bn:'শ্বাসনালীতে বস্তু আটকে থাকলে পানি দেওয়া পরিস্থিতি আরও খারাপ করে এবং ফুসফুসে পানি চলে যেতে পারে।',en:'With an obstruction in place, water makes things worse and can enter the lungs.'} },
    { t:{bn:'বাচ্চাকে একা ফেলে সাহায্য খুঁজতে যাবেন না',en:'Never leave baby alone to go and find help'},
      p:{bn:'ফোন স্পিকারে দিয়ে বাচ্চার পাশে থেকেই সাহায্য নিন।',en:'Put the phone on speaker and stay with your baby the whole time.'} },
    { t:{bn:'খাওয়ার সময় বাচ্চাকে কখনো একা রাখবেন না',en:'Never leave a baby alone while eating'},
      p:{bn:'দম আটকানো প্রায় সবসময় নিঃশব্দে ঘটে — পাশের ঘর থেকে শোনা যায় না।',en:'Choking is almost always silent — you will not hear it from the next room.'} },
    { t:{bn:'শোয়া অবস্থায়, গাড়িতে বা হাঁটতে হাঁটতে খাওয়াবেন না',en:'Do not feed lying down, in a moving car or while walking'},
      p:{bn:'সবসময় সোজা হয়ে বসিয়ে, স্থির অবস্থায় খাওয়ান।',en:'Always feed sitting fully upright and stationary.'} },
  ];

  const PREVENT = [
    {bn:'সবসময় সোজা হয়ে বসিয়ে খাওয়ান, কখনো শোয়া বা হেলানো অবস্থায় নয়',en:'Always feed fully upright, never reclined'},
    {bn:'প্রতিটি খাবার পরিবেশনের আগে দুই আঙুলে চেপে নরমতা পরীক্ষা করুন',en:'Squash-test every food between two fingers before serving'},
    {bn:'গোল ও শক্ত খাবার (আঙুর, লিচু, চেরি টমেটো) লম্বালম্বি চার ভাগ করুন',en:'Quarter round firm foods such as grapes, lychee and cherry tomatoes lengthwise'},
    {bn:'গোটা বাদাম, পপকর্ন, শক্ত ক্যান্ডি ও কাঁচা শক্ত সবজি ৪ বছর পর্যন্ত নয়',en:'No whole nuts, popcorn, hard sweets or raw hard vegetables until about age 4'},
    {bn:'খাওয়ার সময় হাসানো, দৌড়ানো বা খেলা নয়',en:'No laughing games, running or play while food is in the mouth'},
    {bn:'বড় ভাই-বোনের খাবার বাচ্চার নাগালের বাইরে রাখুন',en:'Keep older siblings\' food out of baby\'s reach'},
    {bn:'সম্ভব হলে একটি শিশু-CPR ও চোকিং প্রশিক্ষণ কোর্স করে নিন — ভিডিও দেখার চেয়ে হাতে-কলমে শেখা অনেক কার্যকর',en:'If you can, take a hands-on infant CPR and choking course — far more effective than watching a video'},
  ];

  function render(){
    const el = document.getElementById('firstaid-body');
    if(!el) return;

    let html = `<div class="emergency-banner">
      <h3>🚨 ${Util.tt('জরুরি অবস্থায়','In an emergency')}</h3>
      <p>${Util.tt('বাচ্চা শব্দ করতে পারছে না, কাশতে পারছে না, বা মুখ নীলচে হয়ে যাচ্ছে — সাথে সাথে জরুরি সেবায় ফোন করুন এবং নিচের ধাপগুলো শুরু করুন।','If baby cannot make a sound, cannot cough, or is turning blue — call emergency services immediately and start the steps below.')}</p>
      <p style="margin-top:10px;"><b>${Util.tt('বাংলাদেশ জাতীয় জরুরি সেবা','Bangladesh national emergency service')}: 999</b> · ${Util.tt('স্বাস্থ্য বাতায়ন','Health hotline')}: 16263</p>
      <a class="hotline" href="tel:999">📞 ${Util.tt('৯৯৯-এ কল করুন','Call 999')}</a>
    </div>`;

    html += `<div class="mod-hero">
      <h2>${Util.tt('ওয়াক তোলা বনাম দম আটকানো','Gagging vs Choking')}</h2>
      <p>${Util.tt('এই দুটির পার্থক্য চেনা BLW বা যেকোনো পদ্ধতিতে সলিড শুরু করার আগে সবচেয়ে গুরুত্বপূর্ণ প্রস্তুতি। বেশিরভাগ বাবা-মা যেটিকে "দম আটকানো" ভেবে আতঙ্কিত হন, সেটি আসলে স্বাভাবিক ও নিরাপদ ওয়াক।','Telling these apart is the single most important preparation before starting solids, by any method. Most of what frightens parents as "choking" is in fact normal, protective gagging.')}</p>
    </div>`;

    html += `<div class="fa-compare">${col(GAG,'safe')}${col(CHOKE,'danger')}</div>`;

    html += `<h3 style="margin:30px 0 14px;">🆘 ${Util.tt('১ বছরের নিচে বাচ্চার দম আটকালে — ধাপে ধাপে','If a baby under 1 year is choking — step by step')}</h3>`;
    html += STEPS_UNDER1.map((s,i) =>
      `<div class="step-num"><div class="sn">${Util.num(i+1)}</div><p>${Util.t(s)}</p></div>`).join('');

    html += `<div class="med-note">${Util.tt(
      '⚠ <b>এই ধাপগুলো লিখিত পাঠ্য মাত্র — এগুলো প্রশিক্ষণের বিকল্প নয়।</b> প্রকৃত জরুরি অবস্থায় সঠিকভাবে কাজ করার জন্য একটি স্বীকৃত শিশু-CPR ও ফার্স্ট এইড কোর্স করা অত্যন্ত জরুরি। বস্তু বেরিয়ে গেলেও বাচ্চাকে অবশ্যই ডাক্তার দেখান — শ্বাসনালীতে অবশিষ্ট কণা বা আঘাত থাকতে পারে।',
      '⚠ <b>These written steps are not a substitute for training.</b> To act correctly in a real emergency, take an accredited infant CPR and first aid course. Even after the object clears, have baby examined by a doctor — fragments or airway injury may remain.')}</div>`;

    html += `<h3 style="margin:30px 0 14px;">🚫 ${Util.tt('যা কখনোই করবেন না','What NOT to do')}</h3>
      <div class="nono-grid">${NONO.map(n =>
        `<div class="nono"><div class="nn-t">🚫 ${Util.t(n.t)}</div><p>${Util.t(n.p)}</p></div>`).join('')}</div>`;

    html += `<h3 style="margin:30px 0 14px;">🛡 ${Util.tt('প্রতিরোধই সবচেয়ে ভালো উপায়','Prevention comes first')}</h3>
      <div class="v-card">${Util.list(PREVENT)}</div>`;

    html += Util.accordion('📞 ' + Util.tt('কখন জরুরি সেবায় কল করবেন','When to call emergency services'),
      `<ul class="plain">
        <li>${Util.tt('বাচ্চা কাশতে, কাঁদতে বা শব্দ করতে পারছে না','Baby cannot cough, cry or make any sound')}</li>
        <li>${Util.tt('ঠোঁট, মুখ বা নখ নীলচে/ধূসর হয়ে যাচ্ছে','Lips, face or nails are turning blue or grey')}</li>
        <li>${Util.tt('বাচ্চা ঢলে পড়ছে বা সাড়া দিচ্ছে না','Baby is going limp or is unresponsive')}</li>
        <li>${Util.tt('৫ চাপড় ও ৫ চাপের এক চক্রের পরও বস্তু বের হয়নি','The object has not cleared after one full cycle of 5 blows and 5 thrusts')}</li>
        <li>${Util.tt('শ্বাস নিতে কষ্ট হচ্ছে, ঠোঁট/জিভ ফুলে যাচ্ছে বা সারা শরীরে র‍্যাশ (অ্যানাফাইল্যাক্সিসের লক্ষণ)','Difficulty breathing, swelling of lips or tongue, or a widespread rash — possible anaphylaxis')}</li>
      </ul>`, false);

    html += Util.accordion('🤚 ' + Util.tt('কখন হস্তক্ষেপ করবেন না','When NOT to intervene'),
      `<ul class="plain">
        <li>${Util.tt('বাচ্চা জোরে কাশছে — কাশি নিজেই সবচেয়ে কার্যকর, বাধা দেবেন না','Baby is coughing forcefully — the cough is doing the job better than you can')}</li>
        <li>${Util.tt('বাচ্চা কাঁদছে বা শব্দ করছে — মানে শ্বাসনালী খোলা আছে','Baby is crying or making noise — the airway is open')}</li>
        <li>${Util.tt('ওয়াক তুলে নিজেই খাবার সামনে ঠেলে আনছে','Baby is gagging and pushing the food forward themselves')}</li>
        <li>${Util.tt('এসব ক্ষেত্রে পিঠে চাপড় দিলে খাবার আরও গভীরে চলে যেতে পারে — শুধু শান্তভাবে পাশে থাকুন।','In these situations a back blow can drive food deeper — simply stay calm and close by.')}</li>
      </ul>`, false);

    html += `<p class="med-note">${Util.tt(
      '⚠ <b>শিক্ষামূলক দাবিত্যাগ:</b> এই তথ্য সাধারণ শিক্ষামূলক উদ্দেশ্যে দেওয়া হয়েছে এবং এটি চিকিৎসা পরামর্শ, প্রশিক্ষণ বা জরুরি সেবার বিকল্প নয়। প্রকৃত জরুরি অবস্থায় সর্বদা ৯৯৯-এ কল করুন এবং জরুরি সেবার নির্দেশনা অনুসরণ করুন।',
      '⚠ <b>Educational disclaimer:</b> this information is general education only and does not replace medical advice, hands-on training or emergency services. In a real emergency always call 999 and follow the dispatcher\'s instructions.')}</p>`;

    el.innerHTML = html;
  }

  function init(){ render(); }
  LANG_HOOKS.push(render);
  return { init };
})();


/* =====================================================================
   MODULE 6 — GROWTH & FEEDING MILESTONE TRACKER
   Progress is stored in localStorage under pk2.milestones as a map of
   id -> ISO date achieved, so the date is available for future charting.
   ===================================================================== */
const Milestones = (function(){

  const GROUPS = [
    { id:'posture', title:{bn:'বসা ও ভঙ্গি',en:'Sitting and posture'}, icon:'🪑', items:[
      { id:'headcontrol', age:'4-6', t:{bn:'ভালো মাথা নিয়ন্ত্রণ',en:'Good head control'},
        d:{bn:'কোলে বা হাইচেয়ারে বসিয়ে রাখলে মাথা স্থির ও সোজা রাখতে পারে — সলিড শুরুর অপরিহার্য পূর্বশর্ত।',en:'Holds the head steady and upright when supported — an essential prerequisite before starting solids.'} },
      { id:'sits', age:'6', t:{bn:'সাহায্য ছাড়া বসতে পারে',en:'Sits independently'},
        d:{bn:'সামান্য বা কোনো সাহায্য ছাড়াই সোজা হয়ে বসতে পারে — গিলতে ও শ্বাস নিতে নিরাপদ ভঙ্গি।',en:'Sits upright with little or no support — the safe posture for swallowing and breathing.'} },
    ]},
    { id:'hands', title:{bn:'হাতের দক্ষতা',en:'Hand skills'}, icon:'✋', items:[
      { id:'tomouth', age:'6', t:{bn:'হাত দিয়ে খাবার মুখে নেয়',en:'Brings food to mouth'},
        d:{bn:'মুঠোয় খাবার ধরে নিজের মুখ পর্যন্ত নিতে পারে (palmar grasp)।',en:'Grasps food in the whole fist and gets it to the mouth (palmar grasp).'} },
      { id:'pincer', age:'9-10', t:{bn:'পিন্সার গ্রিপ',en:'Pincer grasp'},
        d:{bn:'বুড়ো আঙুল ও তর্জনী দিয়ে ছোট টুকরা তুলতে পারে — ছোট কিউব দেওয়া শুরু করার সংকেত।',en:'Picks up small pieces between thumb and forefinger — the cue to start offering small cubes.'} },
      { id:'fingerfeed', age:'8-10', t:{bn:'নিজে হাতে খায়',en:'Finger feeds'},
        d:{bn:'নিয়মিতভাবে নিজে হাতে তুলে খাবার খেতে পারে।',en:'Reliably picks up and eats finger foods without help.'} },
    ]},
    { id:'oral', title:{bn:'মুখ ও চিবানো',en:'Oral and chewing skills'}, icon:'👄', items:[
      { id:'chews', age:'8-10', t:{bn:'চিবাতে পারে',en:'Chews food'},
        d:{bn:'উপর-নিচ ও পাশে চোয়ালের নড়াচড়ায় নরম দলাযুক্ত খাবার ভাঙতে পারে — দাঁত না থাকলেও মাড়ি দিয়েই সম্ভব।',en:'Uses up-and-down and side-to-side jaw movement to break down soft lumps — possible with gums alone, no teeth needed.'} },
      { id:'lumpy', age:'9', t:{bn:'দলাযুক্ত খাবার সামলাতে পারে',en:'Handles lumpy textures'},
        d:{bn:'ঘন ঘন ওয়াক না তুলে কাঁটাচামচে ভাঙা খাবার খেতে পারে।',en:'Manages fork-crushed food without frequent gagging.'} },
    ]},
    { id:'tools', title:{bn:'চামচ ও কাপ',en:'Spoon and cup'}, icon:'🥄', items:[
      { id:'spoon', age:'12-15', t:{bn:'চামচ ব্যবহার করে',en:'Uses a spoon'},
        d:{bn:'চামচ ধরে (এলোমেলোভাবে হলেও) নিজে খাবার তুলে মুখে দিতে পারে।',en:'Holds a spoon and gets food to the mouth, however messily.'} },
      { id:'cup', age:'9-12', t:{bn:'খোলা কাপে পান করে',en:'Drinks from an open cup'},
        d:{bn:'সাহায্য নিয়ে খোলা কাপ থেকে পানি খেতে পারে — বোতলের চেয়ে দাঁত ও মুখের পেশির জন্য ভালো।',en:'Drinks from an open cup with help — better for teeth and oral muscles than a bottle.'} },
      { id:'straw', age:'12', t:{bn:'স্ট্র দিয়ে খায়',en:'Drinks from a straw'},
        d:{bn:'স্ট্র কাপ থেকে টেনে পানি খেতে পারে — ভ্রমণে বিশেষভাবে কাজে লাগে।',en:'Sucks from a straw cup — especially useful when travelling.'} },
    ]},
    { id:'independence', title:{bn:'স্বাধীনতা',en:'Independence'}, icon:'🌟', items:[
      { id:'selffeed', age:'12-18', t:{bn:'পুরোপুরি নিজে খায়',en:'Self-feeds a whole meal'},
        d:{bn:'সামান্য সাহায্যে একটি সম্পূর্ণ বেলা নিজেই খেয়ে ফেলতে পারে।',en:'Finishes a whole meal independently with minimal help.'} },
      { id:'familymeal', age:'12+', t:{bn:'পরিবারের সাথে একই খাবার খায়',en:'Eats family meals'},
        d:{bn:'পরিবারের একই রান্না (লবণ-ঝাল বাদে) টেবিলে সবার সাথে বসে খায়।',en:'Eats the same food as the family, minus salt and chilli, seated with everyone.'} },
    ]},
  ];

  const ALL = GROUPS.reduce((a,g) => a.concat(g.items), []);
  let done = Util.load('milestones', {});

  function toggle(id){
    if(done[id]) delete done[id];
    else done[id] = new Date().toISOString().slice(0,10);
    Util.save('milestones', done);
    render();
  }
  function reset(){
    if(!confirm(Util.tt('সব মাইলস্টোন মুছে ফেলবেন?','Clear all milestone progress?'))) return;
    done = {}; Util.save('milestones', done); render();
  }

  function render(){
    const el = document.getElementById('milestones-body');
    if(!el) return;
    const total = ALL.length;
    const hit = Object.keys(done).filter(k => ALL.some(m => m.id === k)).length;
    const pct = total ? Math.round(hit / total * 100) : 0;

    let html = `<div class="progress-wrap">
      <div class="progress-top">
        <div>
          <div class="v-k">${Util.tt('সামগ্রিক অগ্রগতি','Overall progress')}</div>
          <div style="font-size:0.9rem;color:var(--ink-soft);">${Util.num(hit)} / ${Util.num(total)} ${Util.tt('মাইলস্টোন সম্পন্ন','milestones reached')}</div>
        </div>
        <div class="progress-pct">${Util.num(pct)}%</div>
      </div>
      <div class="progress-bar"><span id="ms-bar"></span></div>
      ${hit ? `<button class="v-btn ghost" style="margin-top:14px;padding:8px 14px;font-size:0.82rem;" onclick="Milestones.reset()">${Util.tt('সব মুছে ফেলুন','Reset all')}</button>` : ''}
    </div>`;

    if(!hit){
      html += Util.empty('🎯',
        Util.tt('এখনো কিছু চিহ্নিত করা হয়নি','Nothing ticked yet'),
        Util.tt('নিচের তালিকা থেকে বাচ্চা যেসব দক্ষতা ইতিমধ্যে অর্জন করেছে সেগুলোতে ট্যাপ করুন। অগ্রগতি আপনার ডিভাইসেই সংরক্ষিত থাকবে।',
                'Tap the skills your baby has already reached. Progress stays saved on this device.'));
    }

    GROUPS.forEach(g => {
      const gDone = g.items.filter(i => done[i.id]).length;
      html += `<h3 style="margin:24px 0 12px;">${g.icon} ${Util.t(g.title)}
        <span class="mini-progress">(${Util.num(gDone)}/${Util.num(g.items.length)})</span></h3>
        <div class="v-grid wide">`;
      g.items.forEach(m => {
        const isDone = !!done[m.id];
        html += `<div class="ms-item${isDone?' done':''}" role="checkbox" tabindex="0" aria-checked="${isDone}"
             onclick="Milestones.toggle('${m.id}')"
             onkeypress="if(event.key==='Enter'||event.key===' '){event.preventDefault();Milestones.toggle('${m.id}');}">
          <div class="ms-box">${isDone ? '✓' : ''}</div>
          <div>
            <div class="ms-t">${Util.t(m.t)} <span class="chip leaf">${m.age} ${Util.tt('মাস','mo')}</span></div>
            <div class="ms-d">${Util.t(m.d)}</div>
            ${isDone ? `<div class="v-small" style="margin-top:5px;">✅ ${Util.tt('চিহ্নিত','Marked')}: ${done[m.id]}</div>` : ''}
          </div>
        </div>`;
      });
      html += '</div>';
    });

    html += `<p class="med-note">${Util.tt(
      '⚠ বয়সসীমা কেবল নির্দেশক — সুস্থ বাচ্চাদের মধ্যেও বিস্তর পার্থক্য থাকে এবং অকালে জন্ম নেওয়া শিশুদের ক্ষেত্রে সংশোধিত বয়স ব্যবহার করতে হয়। কোনো মাইলস্টোন নিয়ে উদ্বেগ থাকলে, বিশেষ করে বাচ্চা যদি অর্জিত দক্ষতা হারিয়ে ফেলে, দ্রুত শিশু বিশেষজ্ঞের পরামর্শ নিন।',
      '⚠ These age ranges are indicative only — healthy babies vary widely, and premature babies should be assessed on corrected age. Speak to a pediatrician about any milestone concern, and promptly if your baby loses a skill they had already gained.')}</p>`;

    el.innerHTML = html;
    /* Animate the bar after paint so the CSS transition actually runs.
       Falls back to setTimeout where requestAnimationFrame is unavailable. */
    const paint = (typeof requestAnimationFrame === 'function')
      ? requestAnimationFrame
      : function(fn){ return setTimeout(fn, 16); };
    paint(function(){
      const bar = document.getElementById('ms-bar');
      if(bar) bar.style.width = pct + '%';
    });
  }

  function init(){ render(); }
  LANG_HOOKS.push(render);
  return { init, toggle, reset };
})();
