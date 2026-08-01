#!/usr/bin/env python3
"""Splice the v2 extension parts into the original single-file app.

Every edit is an exact-string replacement (or a tightly anchored regex) so
the original markup, CSS and JavaScript are preserved byte-for-byte apart
from the documented touch points.
"""
import sys, io, os, re

BASE = os.path.dirname(os.path.abspath(__file__))
def read(p):
    with io.open(os.path.join(BASE, p), encoding='utf-8') as f:
        return f.read()

html = read('base.html')
css = read('part.css')
tabs = read('part.tabs.html')
panels = read('part.panels.html')
MODULE_ORDER = [1, 2, 3, 4, 5, 7, 6]   # bootstrap (6) last: it references all modules
js = "\n".join(read('part.js%d.js' % i) for i in MODULE_ORDER)

edits = 0
def sub(old, new, label):
    global html, edits
    n = html.count(old)
    if n != 1:
        print('!! ANCHOR PROBLEM (%d matches): %s' % (n, label)); sys.exit(1)
    html = html.replace(old, new, 1)
    edits += 1
    print('   ok  %s' % label)

def resub(pattern, new, label, flags=0):
    global html, edits
    rx = re.compile(pattern, flags)
    if len(rx.findall(html)) != 1:
        print('!! REGEX ANCHOR PROBLEM: %s' % label); sys.exit(1)
    html = rx.sub(lambda m: new, html, count=1)
    edits += 1
    print('   ok  %s' % label)

# ---------------------------------------------------------------- 1. CSS
sub('</style>', css + '\n</style>', 'inject CSS before </style>')

# ---------------------------------------------------------------- 2. tab buttons
tracker_btn = ('  <button class="tab-btn" data-tab="tracker" onclick="setTab(\'tracker\')">\n'
               '    <span lang-bn>\U0001F4CB ট্র্যাকার</span>')
sub(tracker_btn, tabs + tracker_btn, 'insert new tab buttons before Tracker tab')

# ---------------------------------------------------------------- 3. panels
sub('<footer>', panels + '\n<footer>', 'insert new tab panels before <footer>')

# ---------------------------------------------------------------- 4. language hook
sub('''  render();
  populateFoodSelect();
  renderTracker();
}''',
    '''  render();
  populateFoodSelect();
  renderTracker();
  /* v2: re-render every JS-generated module in the new language. */
  if(typeof runLangHooks === 'function') runLangHooks();
}''',
    'call runLangHooks() from setLang()')

# ---------------------------------------------------------------- 5. tracker persistence
old_tracker = '''let trackerLog = [];
let nextLogId = 1;'''
new_tracker = '''/* v2: the log is now persisted to localStorage so entries survive a reload.
   Reads and writes are wrapped in try/catch because private-browsing modes
   and some file:// contexts throw on localStorage access; in that case the
   tracker silently falls back to the original in-memory behaviour.
   For multi-device sync (e.g. both parents logging), swap loadTracker and
   saveTracker for Firebase Firestore calls -- nothing else has to change. */
const TRACKER_KEY = 'pk2.trackerLog';

function loadTracker(){
  try{ return JSON.parse(localStorage.getItem(TRACKER_KEY) || '[]'); }
  catch(e){ return []; }
}
function saveTracker(){
  try{ localStorage.setItem(TRACKER_KEY, JSON.stringify(trackerLog)); }
  catch(e){ /* storage unavailable -- keep working in memory */ }
}

let trackerLog = loadTracker();
let nextLogId = trackerLog.reduce(function(m, e){ return Math.max(m, e.id || 0); }, 0) + 1;'''
sub(old_tracker, new_tracker, 'upgrade tracker to localStorage')

sub('''  trackerLog.push({ id: nextLogId++, foodId, date: dateVal, issue, note });''',
    '''  trackerLog.push({ id: nextLogId++, foodId, date: dateVal, issue, note });
  saveTracker();''',
    'persist on addLogEntry()')

sub('''  trackerLog = trackerLog.filter(e => e.id !== id);
  renderTracker();''',
    '''  trackerLog = trackerLog.filter(e => e.id !== id);
  saveTracker();
  renderTracker();''',
    'persist on deleteLogEntry()')

# tracker footnote no longer describes a session-only demo
note_new = (
 '    <p class="tracker-note" lang-bn>\U0001F4BE '
 'এন্ট্রিগুলো এই '
 'ডিভাইসেই সংরক্ষিত '
 'থাকে (localStorage) — পেজ রিলোড '
 'করলেও হারাবে না। '
 'কোনো তথ্য ইন্টারনেটে '
 'পাঠানো হয় না।</p>\n'
 '    <p class="tracker-note" lang-en>\U0001F4BE Entries are saved on this device with localStorage, '
 'so they survive a page reload. Nothing is sent over the internet. '
 'To sync across two devices, see the Firebase note in the code.</p>')
resub(r'    <p class="tracker-note" lang-bn>.*?</p>\s*\n\s*<p class="tracker-note" lang-en>.*?</p>',
      note_new, 'update tracker persistence footnote', re.S)

# ---------------------------------------------------------------- 6. footer disclaimer
footer_new = '''<footer>
  <span lang-bn>এই অ্যাপের সমস্ত তথ্য WHO, UNICEF, AAP ও NHS-এর সাধারণ পরিপূরক খাদ্য নির্দেশিকার উপর ভিত্তি করে শিক্ষামূলক উদ্দেশ্যে দেওয়া — এটি কোনোক্রমেই শিশু বিশেষজ্ঞ, পুষ্টিবিদ বা জরুরি সেবার বিকল্প নয়। জরুরি অবস্থায় ৯৯৯-এ কল করুন।</span>
  <span lang-en>Everything here is educational content based on general WHO, UNICEF, AAP and NHS complementary feeding guidance — it does not replace a pediatrician, a dietitian or emergency services. In an emergency, call 999.</span>
  <div style="margin-top:10px;font-size:0.78rem;opacity:0.8;">
    <span lang-bn>\U0001F512 আপনার সব তথ্য কেবল এই ডিভাইসেই সংরক্ষিত হয় — কোনো সার্ভারে পাঠানো হয় না।</span>
    <span lang-en>\U0001F512 All your data stays on this device — nothing is uploaded to any server.</span>
  </div>
</footer>'''
resub(r'<footer>\s*\n\s*<span lang-bn>.*?</footer>', footer_new, 'strengthen footer disclaimer', re.S)


# ------------------------------------------------- 6b. data safety panel in Tracker
backup_panel = """
    <h3 class="tracker-h3" style="margin-top:30px;"><span lang-bn>\U0001F512 আপনার তথ্য ও ব্যাকআপ</span><span lang-en>\U0001F512 Your data &amp; backup</span></h3>
    <div id="backup-body"></div>
"""
resub(r'(\n  </section>\n</div><!-- /tab-tracker -->)', backup_panel + r'  </section>\n</div><!-- /tab-tracker -->', 'add data-safety panel to Tracker tab')

# ------------------------------------------------- 6c. PWA hooks (optional files)
sub('<link rel="preconnect" href="https://fonts.googleapis.com">',
    '''<meta name="theme-color" content="#FBF3E4">
<meta name="description" content="Bangla guide to starting solids: food database, BLW guide, meal planner, recipes and first aid.">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="\u09aa\u09cd\u09b0\u09a5\u09ae \u0996\u09be\u09ac\u09be\u09b0">
<!-- Optional: publish manifest.json + sw.js alongside this file to make the
     app installable and fully offline. Absent files degrade silently. -->
<link rel="manifest" href="manifest.json">
<link rel="icon" href="icon-192.png" sizes="192x192">
<link rel="apple-touch-icon" href="icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">''',
    'add PWA meta tags')

# ---------------------------------------------------------------- 7. JS
sub('''render();
</script>''',
    'render();\n' + js + '\n</script>',
    'inject JS modules before </script>')

out = os.path.join(BASE, '..', 'index.html')
with io.open(out, 'w', encoding='utf-8') as f:
    f.write(html)
print('\n%d edits applied -> %s (%d bytes)' % (edits, os.path.abspath(out), len(html.encode('utf-8'))))
