
/* =====================================================================
   MODULE 13 — DATA SAFETY: BACKUP, RESTORE, STORAGE HEALTH
   The app has no server and no accounts, so everything a caregiver
   records lives in this browser's localStorage. That is durable enough
   for daily use but can be lost by clearing browsing data, switching
   phones, or (on iOS) by Safari evicting storage after a period of not
   opening the site. This module makes that situation visible and gives
   the caregiver a one-tap way to take a real backup file off the device.
   ===================================================================== */
const Backup = (function(){

  /* Every key the app writes. Keep this list in sync when adding modules. */
  const KEYS = [
    'pk2.trackerLog',    // food log entries
    'pk2.milestones',    // milestone id -> date achieved
    'pk2.blwChecks',     // BLW checklist ticks
    'pk2.planner',       // planner form settings
    'pk2.lang',          // language preference
    'pk2.lastTab',       // last open tab
  ];
  const FORMAT_VERSION = 2;

  /* Is localStorage actually usable? Private/incognito modes and some
     embedded webviews expose the API but throw when writing to it. */
  function storageWorks(){
    try{
      localStorage.setItem('pk2.__probe', '1');
      localStorage.removeItem('pk2.__probe');
      return true;
    }catch(e){ return false; }
  }

  /* --- Export ------------------------------------------------------- */
  function collect(){
    const data = {};
    KEYS.forEach(function(k){
      try{
        const v = localStorage.getItem(k);
        if(v !== null) data[k] = v;
      }catch(e){}
    });
    return {
      app: 'prothom-khabar',
      formatVersion: FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      data: data,
    };
  }

  function counts(){
    let log = 0, ms = 0, checks = 0;
    try{ log = (JSON.parse(localStorage.getItem('pk2.trackerLog') || '[]') || []).length; }catch(e){}
    try{ ms = Object.keys(JSON.parse(localStorage.getItem('pk2.milestones') || '{}') || {}).length; }catch(e){}
    try{ checks = Object.keys(JSON.parse(localStorage.getItem('pk2.blwChecks') || '{}') || {}).length; }catch(e){}
    return { log: log, ms: ms, checks: checks };
  }

  function download(){
    const payload = JSON.stringify(collect(), null, 2);
    const stamp = new Date().toISOString().slice(0,10);
    const name = 'prothom-khabar-backup-' + stamp + '.json';
    try{
      const blob = new Blob([payload], { type:'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
      flash(Util.tt('✅ ব্যাকআপ ফাইল ডাউনলোড হয়েছে: ' + name,
                    '✅ Backup downloaded: ' + name), 'ok');
    }catch(e){
      /* Fallback for webviews that block downloads: show the JSON to copy. */
      flash(Util.tt('এই ব্রাউজারে ডাউনলোড কাজ করছে না — নিচের লেখাটি কপি করে নিরাপদ জায়গায় রাখুন।',
                    'Download is blocked in this browser — copy the text below and keep it somewhere safe.'), 'warn');
      const box = document.getElementById('bk-fallback');
      if(box){ box.style.display = 'block'; box.value = payload; box.select(); }
    }
  }

  /* --- Import ------------------------------------------------------- */
  function restore(input){
    const file = input.files && input.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(){
      let obj;
      try{ obj = JSON.parse(reader.result); }
      catch(e){
        flash(Util.tt('❌ ফাইলটি পড়া যায়নি — এটি সঠিক ব্যাকআপ ফাইল নয়।',
                      '❌ Could not read that file — it is not a valid backup.'), 'err');
        return;
      }
      if(!obj || obj.app !== 'prothom-khabar' || typeof obj.data !== 'object'){
        flash(Util.tt('❌ এটি এই অ্যাপের ব্যাকআপ ফাইল নয়।',
                      '❌ That is not a backup file from this app.'), 'err');
        return;
      }
      const when = obj.exportedAt ? obj.exportedAt.slice(0,10) : '?';
      const msg = Util.tt(
        'ব্যাকআপ ফাইলটি ' + when + ' তারিখের। এটি পুনরুদ্ধার করলে এই ডিভাইসের বর্তমান সব তথ্য মুছে গিয়ে ব্যাকআপের তথ্য বসবে। চালিয়ে যাবেন?',
        'This backup is from ' + when + '. Restoring will replace all data currently on this device. Continue?');
      if(!confirm(msg)) return;

      try{
        KEYS.forEach(function(k){ localStorage.removeItem(k); });
        Object.keys(obj.data).forEach(function(k){
          /* Only accept our own namespaced keys from the file. */
          if(KEYS.indexOf(k) > -1) localStorage.setItem(k, obj.data[k]);
        });
      }catch(e){
        flash(Util.tt('❌ সংরক্ষণ করা যায়নি — ব্রাউজারের স্টোরেজ বন্ধ থাকতে পারে।',
                      '❌ Could not save — browser storage may be disabled.'), 'err');
        return;
      }
      flash(Util.tt('✅ পুনরুদ্ধার সম্পন্ন। পেজটি রিলোড হচ্ছে…',
                    '✅ Restored. Reloading the page…'), 'ok');
      setTimeout(function(){ location.reload(); }, 900);
    };
    reader.readAsText(file);
  }

  /* --- Clear -------------------------------------------------------- */
  function clearAll(){
    if(!confirm(Util.tt('এই ডিভাইস থেকে খাবারের লগ, মাইলস্টোন ও চেকলিস্টের সব তথ্য মুছে ফেলা হবে। এটি ফিরিয়ে আনা যাবে না। আগে ব্যাকআপ নিয়েছেন তো?',
                        'This will erase the food log, milestones and checklists from this device. It cannot be undone. Have you taken a backup first?'))) return;
    if(!confirm(Util.tt('নিশ্চিতভাবে সব মুছে ফেলতে চান?', 'Are you sure you want to erase everything?'))) return;
    try{ KEYS.forEach(function(k){ localStorage.removeItem(k); }); }catch(e){}
    location.reload();
  }

  /* --- Small inline status message ---------------------------------- */
  function flash(msg, kind){
    const el = document.getElementById('bk-flash');
    if(!el) return;
    el.textContent = msg;
    el.className = 'bk-flash ' + (kind || 'ok');
    el.style.display = 'block';
    clearTimeout(flash._t);
    flash._t = setTimeout(function(){ el.style.display = 'none'; }, 9000);
  }

  /* --- Render ------------------------------------------------------- */
  function render(){
    const el = document.getElementById('backup-body');
    if(!el) return;
    const works = storageWorks();
    const c = counts();
    const total = c.log + c.ms + c.checks;

    let html = '';

    if(!works){
      html += `<div class="bk-warn">
        <b>⚠ ${Util.tt('এই ব্রাউজারে তথ্য সংরক্ষণ করা যাচ্ছে না','This browser cannot save your data')}</b>
        <p>${Util.tt('আপনি সম্ভবত প্রাইভেট/ইনকগনিটো মোডে আছেন, অথবা ব্রাউজারে স্টোরেজ বন্ধ করা আছে। এই অবস্থায় পেজ বন্ধ করলেই সব তথ্য মুছে যাবে। সাধারণ ব্রাউজার উইন্ডোতে খুলে নিন।','You are probably in private or incognito mode, or storage is blocked. Anything you record now will be lost when you close the page. Please open the app in a normal browser window.')}</p>
      </div>`;
    }

    html += `<div class="bk-grid">
      <div class="stat"><div class="sv">${Util.num(c.log)}</div><div class="sl">${Util.tt('খাবারের এন্ট্রি','food log entries')}</div></div>
      <div class="stat"><div class="sv">${Util.num(c.ms)}</div><div class="sl">${Util.tt('মাইলস্টোন','milestones')}</div></div>
      <div class="stat"><div class="sv">${Util.num(c.checks)}</div><div class="sl">${Util.tt('চেকলিস্ট টিক','checklist ticks')}</div></div>
    </div>`;

    html += `<p class="v-muted" style="margin:14px 0;">${works
      ? Util.tt('✅ আপনার তথ্য স্বয়ংক্রিয়ভাবে এই ফোনেই সংরক্ষিত হচ্ছে — পেজ রিলোড বা ব্রাউজার বন্ধ করলেও মুছবে না। কিছুই ইন্টারনেটে পাঠানো হয় না।',
                '✅ Your data saves automatically on this phone — it survives a reload or closing the browser. Nothing is sent over the internet.')
      : ''}</p>`;

    html += `<div class="bk-actions">
      <button class="v-btn leaf" onclick="Backup.download()">💾 ${Util.tt('ব্যাকআপ ডাউনলোড করুন','Download backup')}</button>
      <label class="v-btn ghost" style="display:inline-block;">
        📂 ${Util.tt('ব্যাকআপ থেকে ফেরান','Restore from backup')}
        <input type="file" accept="application/json,.json" style="display:none;" onchange="Backup.restore(this)">
      </label>
      ${total ? `<button class="v-btn ghost" style="color:var(--alert);" onclick="Backup.clearAll()">🗑 ${Util.tt('সব মুছুন','Erase all')}</button>` : ''}
    </div>`;

    html += `<textarea id="bk-fallback" style="display:none;width:100%;height:120px;margin-top:12px;font-size:0.75rem;" readonly></textarea>`;
    html += `<div id="bk-flash" class="bk-flash" style="display:none;"></div>`;

    html += Util.accordion('🛡 ' + Util.tt('কখন তথ্য হারিয়ে যেতে পারে, আর কীভাবে বাঁচাবেন','When data can be lost, and how to protect it'),
      `<ul class="plain">
        <li>${Util.tt('<b>ব্রাউজারের ডেটা/হিস্ট্রি মুছে ফেললে</b> — অ্যাপের তথ্যও মুছে যাবে।','<b>Clearing browsing data</b> also clears the app\'s data.')}</li>
        <li>${Util.tt('<b>নতুন ফোনে গেলে বা অন্য ব্রাউজারে খুললে</b> — তথ্য সাথে যাবে না। ক্রোম আর ফেসবুকের ভেতরের ব্রাউজার আলাদা হিসেবে গণ্য হয়।','<b>A new phone or a different browser</b> starts empty. Chrome and the in-app Facebook browser count as separate.')}</li>
        <li>${Util.tt('<b>আইফোনে (Safari)</b> — টানা কয়েক সপ্তাহ অ্যাপটি না খুললে তথ্য মুছে যেতে পারে। হোম স্ক্রিনে "Add to Home Screen" দিয়ে ইনস্টল করে রাখলে এই ঝুঁকি থাকে না।','<b>On iPhone (Safari)</b>, data can be evicted if you do not open the app for several weeks. Installing it via "Add to Home Screen" removes that risk.')}</li>
        <li>${Util.tt('<b>সবচেয়ে নিরাপদ অভ্যাস:</b> মাসে একবার "ব্যাকআপ ডাউনলোড" চাপুন এবং ফাইলটি নিজের হোয়াটসঅ্যাপ/ইমেইলে পাঠিয়ে রাখুন। নতুন ফোনে "ব্যাকআপ থেকে ফেরান" দিয়ে সব ফিরে পাবেন।','<b>Best habit:</b> tap "Download backup" once a month and send the file to yourself on WhatsApp or email. On a new phone, "Restore from backup" brings everything back.')}</li>
        <li>${Util.tt('<b>দুজনে আলাদা ফোনে লগ রাখলে</b> মিলবে না — একজন লগ রাখুন, অন্যজনকে মাঝে মাঝে ব্যাকআপ ফাইল পাঠান।','<b>Two phones will not sync.</b> Let one person keep the log and share the backup file with the other from time to time.')}</li>
      </ul>`, false);

    el.innerHTML = html;
  }

  function init(){ render(); }
  LANG_HOOKS.push(render);
  return { init, render, download, restore, clearAll, storageWorks, KEYS };
})();


/* ---------------------------------------------------------------------
   OPTIONAL OFFLINE SUPPORT
   If sw.js and manifest.json are published alongside this file, the app
   becomes installable and works with no connection at all. If they are
   absent (e.g. the HTML is opened straight from disk), registration fails
   quietly and nothing else changes.
   --------------------------------------------------------------------- */
(function(){
  if(!('serviceWorker' in navigator)) return;
  if(location.protocol !== 'http:' && location.protocol !== 'https:') return;
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('sw.js').catch(function(){ /* not published: fine */ });
  });
})();
