// extras3.js - second batch of UI upgrades and easter eggs.
// Loads LAST in index.html, so it never breaks script.js, extras.js or extras2.js.
(function () {

// ===== settings you may need to edit =====
var SKY_BTN = '#sky-btn';     // selector of your sun / moon button (used by E158 and U93)

// ===== small helpers =====
function $(s) { return document.querySelector(s); }
function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
function load(k, d) { try { var v = localStorage.getItem('x3_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function save(k, v) { try { localStorage.setItem('x3_' + k, JSON.stringify(v)); } catch (e) {} }
function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function make(tag, cls, html) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  document.body.appendChild(e);
  return e;
}

var toastBox = make('div', 'x3-toast');
toastBox.setAttribute('role', 'status');
function toast(msg) {
  toastBox.textContent = msg;
  toastBox.classList.add('show');
  clearTimeout(toastBox.t);
  toastBox.t = setTimeout(function () { toastBox.classList.remove('show'); }, 3200);
}

// tap an element N times within a time window
function tapper(el, need, ms, fn) {
  if (!el) return;
  var n = 0, t;
  el.setAttribute('data-secret', '1');   // E156 ignores these taps
  el.addEventListener('click', function () {
    n++;
    clearTimeout(t);
    t = setTimeout(function () { n = 0; }, ms);
    if (n >= need) { n = 0; fn(); }
  });
}

// ===== FIX 1: one full-page effect at a time =====
var busy = '';
function startTakeover(name) {
  if (busy) { return false; }
  busy = name;
  document.body.classList.add('x3-temp');   // U93 never saves while this is on
  return true;
}
function endTakeover() { busy = ''; document.body.classList.remove('x3-temp'); }
function runTakeover(name, secs, onStart, onEnd) {
  if (!startTakeover(name)) { paimonSay('Not now!', 2); return false; }
  onStart();
  setTimeout(function () { onEnd(); endTakeover(); }, secs * 1000);
  return true;
}

// ===== FIX 3: popups wait in a line =====
var queue = [], showing = false;
function addPopup(fn) { queue.push(fn); nextPopup(); }
function nextPopup() {
  if (showing || queue.length == 0) { return; }
  showing = true;
  queue.shift()(function () { showing = false; setTimeout(nextPopup, 3000); });
}

// ===== FIX 4: Paimon speaks through one function =====
var pBox = make('div', 'x3-paimon', '<b>Paimon</b><span id="x3-say"></span>');
var pSay = pBox.querySelector('#x3-say');
var pLevel = 0, pTimer;
function paimonSay(text, level, ms) {
  level = level || 2;
  if (level < pLevel) { return; }
  pLevel = level;
  pSay.textContent = text;
  pBox.classList.add('show');
  clearTimeout(pTimer);
  pTimer = setTimeout(paimonHide, ms || 3500);
}
function paimonHide() { pLevel = 0; pBox.classList.remove('show'); }

// ===== FIX 7: one list of secrets (U96, E148, E174 all read it) =====
var SECRETS = [
  { id: 'dizzy',     name: 'Dizzy Logo',            hint: 'The logo does not like fast fingers.', count: true },
  { id: 'cursed',    name: 'Cursed Comic Sans',     hint: 'One section title has a cursed side.', count: true },
  { id: 'bsod',      name: 'Blue Screen of Paimon', hint: 'Something in the Skills area can crash the page.', count: true },
  { id: 'nopress',   name: 'Disobedient Traveler',  hint: 'Some buttons ask you not to press them.', count: true },
  { id: 'resin',     name: 'Resin Refill',          hint: 'Paimon is short on Resin.', count: true },
  { id: 'sleep',     name: 'Sleepy Paimon',         hint: 'Leave Paimon alone for a while.', count: true },
  { id: 'gravity',   name: 'Gravity Glitch',        hint: 'The footer has a heavy side.', count: true },
  { id: 'slime',     name: 'Slime on the Heading',  hint: 'Something green sits in About.', count: true },
  { id: 'clicker',   name: 'Clicker of Teyvat',     hint: 'Keep clicking. A lot.', count: true },
  { id: 'grass',     name: 'Touch Grass',           hint: 'Keep clicking. Even more.', count: true },
  { id: 'eclipse',   name: 'Eclipse',               hint: 'The sun and moon button has a limit.', count: true },
  { id: 'rainbow',   name: 'Rainbow Wish',          hint: 'Hard pity looks different.', count: true },
  { id: 'chaos',     name: 'Chaos Banner',          hint: 'Pull the wrong Paimon.', count: true },
  { id: 'pigeon',    name: 'Pigeon Mail',           hint: 'Some letters get a special courier.', count: false },
  { id: 'cookie',    name: 'Sweet Madame Cookies',  hint: 'A banner shows up once.', count: false },
  { id: 'ad',        name: 'Runaway Ad',            hint: 'A pop-up that is hard to close.', count: false },
  { id: 'lag',       name: 'Lag Spike',             hint: 'The page sometimes freezes.', count: false },
  { id: 'typing',    name: 'Paimon is typing',      hint: 'She has something to say.', count: false },
  { id: 'credits',   name: 'Credits Roll',          hint: 'Find them all, or poke the credits line.', count: false }
];
var found = load('found', {});

function findSecret(id) {
  if (found[id]) { return; }
  found[id] = 1;
  save('found', found);
  var s = SECRETS.filter(function (x) { return x.id == id; })[0];
  if (s) { toast('Secret found: ' + s.name); }
  renderCodex();
  checkCredits();
}
function renderCodex() {
  var list = $('#codex-list');
  if (!list) { return; }
  var n = 0, total = 0, html = '';
  SECRETS.forEach(function (s) {
    if (s.count) { total++; if (found[s.id]) { n++; } }
    if (found[s.id]) {
      html += '<li class="got"><b>' + s.name + '</b><span>Found</span></li>';
    } else {
      html += '<li><b>???</b><span>' + s.hint + '</span></li>';
    }
  });
  list.innerHTML = html;
  var c = $('#codex-count');
  if (c) { c.textContent = n + ' / ' + total; }
}
function allFound() {
  return SECRETS.every(function (s) { return !s.count || found[s.id]; });
}
function checkCredits() {
  if (allFound() && !load('creditsAuto', 0)) { save('creditsAuto', 1); setTimeout(showCredits, 1500); }
}

// E148 hint button
var hintBtn = $('#hint-btn');
if (hintBtn) {
  hintBtn.addEventListener('click', function () {
    var left = SECRETS.filter(function (s) { return s.count && !found[s.id]; });
    if (left.length == 0) { paimonSay('You found everything! Paimon is proud.', 2); return; }
    paimonSay('Hmm... ' + rand(left).hint, 2, 5000);
  });
}

// ===== U93 remember my choices =====
var saveTimer;
function saveChoices() {
  if (document.body.classList.contains('x3-temp')) { return; }
  var keep = document.body.className.split(' ').filter(function (c) {
    return c && c.indexOf('x3-') != 0 && c != 'lite';
  }).join(' ');
  save('body', keep);
}
document.addEventListener('click', function () { clearTimeout(saveTimer); saveTimer = setTimeout(saveChoices, 400); });
var savedBody = load('body', '');
if (savedBody) { savedBody.split(' ').forEach(function (c) { if (c) { document.body.classList.add(c); } }); }
var savedHero = load('hero', '');
$$('.thumb').forEach(function (t) {
  t.addEventListener('click', function () { save('hero', t.getAttribute('alt')); });
});
if (savedHero) {
  var th = $$('.thumb').filter(function (t) { return t.getAttribute('alt') == savedHero; })[0];
  if (th) { setTimeout(function () { th.click(); }, 300); }
}

// ===== U116 auto lite mode =====
var lite = load('lite', null);
if (lite === null) {
  lite = (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 3);
}
function applyLite() {
  document.body.classList.toggle('lite', !!lite);
  var b = $('#lite-toggle');
  if (b) { b.textContent = 'Effects: ' + (lite ? 'Off' : 'On'); }
}
applyLite();
var liteBtn = $('#lite-toggle');
if (liteBtn) {
  liteBtn.addEventListener('click', function () { lite = !lite; save('lite', lite); applyLite(); });
}

// ===== U88 accessibility =====
$$('.thumb').forEach(function (t) {
  t.setAttribute('tabindex', '0');
  t.setAttribute('role', 'button');
  t.setAttribute('aria-label', 'Choose ' + t.getAttribute('alt') + ' as hero');
  t.addEventListener('keydown', function (e) { if (e.key == 'Enter' || e.key == ' ') { e.preventDefault(); t.click(); } });
});
var menuBtn = $('#menu-btn');
if (menuBtn) {
  menuBtn.setAttribute('aria-controls', 'nav-links');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.addEventListener('click', function () {
    menuBtn.setAttribute('aria-expanded', menuBtn.getAttribute('aria-expanded') == 'true' ? 'false' : 'true');
  });
}
$$('.el').forEach(function (b) { b.setAttribute('aria-label', b.textContent + ' element power'); });

// ===== U107 Midterm / Finals tabs =====
$$('.tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    $$('.tab').forEach(function (t) { t.classList.remove('on'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('on');
    tab.setAttribute('aria-selected', 'true');
    var want = tab.getAttribute('data-tab');
    $$('.cards .card').forEach(function (card) {
      var link = card.querySelector('a.btn');
      var term = link && link.getAttribute('href').indexOf('midterm') > -1 ? 'midterm' : 'finals';
      card.classList.toggle('x3-hide', want != 'all' && want != term);
    });
  });
});

// ===== U115 friendlier contact form =====
var form = $('#contact-form');
if (form) {
  var msg = $('#cmsg');
  var counter = document.createElement('small');
  counter.className = 'x3-counter';
  counter.textContent = '0 / 300';
  if (msg) {
    msg.setAttribute('maxlength', '300');
    msg.parentNode.appendChild(counter);
    msg.addEventListener('input', function () { counter.textContent = msg.value.length + ' / 300'; });
  }
  var friendly = { cname: 'Paimon needs a name!', cmsg: 'Paimon cannot deliver an empty bottle!', cemail: 'That email looks lost. Check the @ part.' };
  $$('#contact-form input, #contact-form textarea').forEach(function (f) {
    if (!friendly[f.id]) { return; }
    f.addEventListener('invalid', function () { f.setCustomValidity(friendly[f.id]); });
    f.addEventListener('input', function () { f.setCustomValidity(''); });
  });
  var check = document.createElement('div');
  check.className = 'x3-check';
  check.innerHTML = '<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M14 27l8 8 16-17"/></svg>';
  form.appendChild(check);
  form.addEventListener('submit', function () {
    if (!form.checkValidity()) { return; }
    check.classList.remove('go');
    void check.offsetWidth;
    check.classList.add('go');
    if (Math.random() < 0.4) { flyPigeon(); }   // E140: animation only
  });
}
function flyPigeon() {
  var p = make('div', 'x3-pigeon', '<svg viewBox="0 0 80 40"><ellipse cx="38" cy="24" rx="18" ry="10"/><circle cx="58" cy="16" r="7"/><path d="M64 16l9 3-9 2z"/><path class="wing" d="M30 20q8-18 20-4z"/></svg><i>&#9993;</i>');
  setTimeout(function () { p.remove(); }, 4200);
  findSecret('pigeon');
}

// ===== U84 + E129 + E159 + E164 + E182 : Wish section, ONE pull() =====
var FEATURED = ['flins', 'arlecchino'];
var POOL5 = ['mavuika', 'furina', 'columbina', 'nahida'];
var POOL4 = ['venti', 'zhongli', 'ei', 'anastasya', 'archons'];
var JOKES = ['Mark\'s sleep schedule (never obtained)', 'A slime\'s autograph', 'Half a Mora', 'One (1) Fragile Resin', 'Hilichurl dance lessons'];
var W = load('wish', { total: 0, pity: 0 });
var banner = 'main';

function titleFor(n) {
  if (n >= 100) { return 'Certified Pity Survivor'; }
  if (n >= 50) { return 'Primogem Burner'; }
  if (n >= 10) { return 'Gambler'; }
  return 'Newbie';
}
function pullOne() {
  W.total++;
  if (banner == 'chaos') {
    if (Math.random() < 0.12) { findSecret('chaos'); return { name: 'Sweet Madame', stars: 5, note: 'Paimon is not available for adoption.' }; }
    return { name: rand(JOKES), stars: 3 };
  }
  W.pity++;
  var hard = W.pity >= 90;
  var chance = W.pity >= 74 ? 0.06 + (W.pity - 73) * 0.06 : 0.06;
  if (hard || Math.random() < chance) {
    W.pity = 0;
    var id = Math.random() < 0.6 ? rand(FEATURED) : rand(POOL5);
    return { name: cap(id), stars: 5, img: id, hard: hard };
  }
  var id4 = rand(POOL4);
  return { name: cap(id4), stars: 4, img: id4 };
}
function showWishInfo() {
  var r = $('#w-rank'), p = $('#w-pity'), l = $('#luck');
  if (r) { r.textContent = 'Rank: ' + titleFor(W.total) + ' (' + W.total + ' pulls)'; }
  if (p) { p.textContent = banner == 'main' ? 'Pity: ' + W.pity + ' / 90' : 'No pity here. Only chaos.'; }
  if (l) { l.textContent = 'Today\'s luck: ' + rand(['Blessed', 'Average', 'Cursed']); }
}
function doWish(times) {
  var out = $('#w-results'), items = [], rainbow = false, gold = false;
  for (var i = 0; i < times; i++) {
    var it = pullOne();
    items.push(it);
    if (it.hard) { rainbow = true; }
    if (it.stars == 5) { gold = true; }
  }
  save('wish', W);
  var html = '';
  items.forEach(function (it) {
    html += '<div class="w-item s' + it.stars + '">';
    if (it.img) { html += '<img src="images/' + it.img + '.jpg" alt="" onerror="this.style.display=\'none\'">'; }
    html += '<b>' + it.name + '</b><span>' + (it.stars == 3 ? '' : it.stars + ' stars') + '</span>';
    if (it.note) { html += '<em>' + it.note + '</em>'; }
    html += '</div>';
  });
  out.innerHTML = html;
  var card = $('#wish-card');
  card.classList.remove('flash-gold', 'flash-rainbow');
  void card.offsetWidth;
  if (rainbow) { card.classList.add('flash-rainbow'); findSecret('rainbow'); }
  else if (gold) { card.classList.add('flash-gold'); }
  showWishInfo();
}
if ($('#w1')) {
  $('#w1').addEventListener('click', function () { doWish(1); });
  $('#w10').addEventListener('click', function () { doWish(10); });
  $$('#wish-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      banner = b.getAttribute('data-b');
      $$('#wish-tabs button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      $('#wish-art').style.display = banner == 'main' ? '' : 'none';
      $('#chaos-art').style.display = banner == 'chaos' ? '' : 'none';
      $('#w-results').innerHTML = '';
      showWishInfo();
    });
  });
  // phone bottom sheet
  $('#wish-open').addEventListener('click', function () { $('#wish-card').classList.add('open'); });
  $('#wish-close').addEventListener('click', function () { $('#wish-card').classList.remove('open'); });
  showWishInfo();
}

// E124 resin refill
var resinBtn = $('#resin-btn');
if (resinBtn) {
  resinBtn.addEventListener('click', function () {
    var m = make('div', 'x3-modal', '<div><h3>Resin Shop</h3><p>Welkin Moon: $0.00.</p><p>Just kidding, it\'s a portfolio.</p><button class="btn">Okay</button></div>');
    m.querySelector('button').addEventListener('click', function () { m.remove(); });
    findSecret('resin');
  });
}

// E122 Do NOT press
var noBtn = $('#nopress');
if (noBtn) {
  var replies = ['Please do not press this.', 'I said do not press.', 'STOP IT.', 'DO YOU WANT TO SEE WHAT HAPPENS?!', 'FINE. YOU WIN, TRAVELER.'];
  var np = 0;
  noBtn.addEventListener('click', function () {
    var out = $('#nopress-reply');
    out.textContent = replies[Math.min(np, 4)];
    out.style.fontSize = (1 + np * 0.25) + 'rem';
    out.style.fontWeight = np > 1 ? '800' : '500';
    np++;
    if (np == 5) { findSecret('nopress'); }
  });
}

// E120 fake cookie banner (shows once)
if (!load('cookie', 0)) {
  setTimeout(function () {
    addPopup(function (done) {
      var b = make('div', 'x3-cookie', '<p>We use cookies. Sweet Madame cookies.</p><button>Accept</button><button>Accept</button>');
      $$('.x3-cookie button').forEach(function (btn) {
        btn.addEventListener('click', function () { b.remove(); save('cookie', 1); findSecret('cookie'); done(); });
      });
    });
  }, 2500);
}

// E136 runaway ad (once per visit)
setTimeout(function () {
  addPopup(function (done) {
    var ad = make('div', 'x3-ad', '<div class="ad-box"><p>Hot slimes in your area!</p><button class="ad-x" aria-label="Close ad">X</button></div>');
    var x = ad.querySelector('.ad-x'), tries = 0;
    x.addEventListener('click', function () {
      if (tries < 3) {
        tries++;
        x.style.left = (Math.random() * 70) + '%';
        x.style.top = (Math.random() * 60) + '%';
        return;
      }
      ad.remove(); findSecret('ad'); done();
    });
  });
}, 45000);

// E185 lag spike (once per visit, never blocks the screen)
setTimeout(function () {
  addPopup(function (done) {
    var s = make('div', 'x3-lag', '<div class="spin"></div>');
    setTimeout(function () { s.remove(); toast('Sorry, Paimon sat on the server.'); findSecret('lag'); done(); }, 2000);
  });
}, 80000);

// E143 Paimon is typing... (random, once)
setTimeout(function () {
  paimonSay('...', 2, 7000);
  var dots = 0, t = setInterval(function () { dots++; pSay.textContent = '...'.slice(0, (dots % 3) + 1); }, 400);
  setTimeout(function () { clearInterval(t); pSay.textContent = '...never mind'; findSecret('typing'); }, 6500);
}, 60000);

// E130 sleepy Paimon
var asleep = false, idleT;
var dim = make('div', 'x3-dim', '<span>Zzz</span><small>Tap to wake Paimon</small>');
function resetIdle() { if (asleep) { return; } clearTimeout(idleT); idleT = setTimeout(sleepNow, 180000); }
function sleepNow() {
  if (!startTakeover('sleep')) { resetIdle(); return; }
  asleep = true;
  dim.classList.add('show');
  paimonSay('Zzz...', 1, 86400000);
  findSecret('sleep');
}
dim.addEventListener('click', function () {
  asleep = false; endTakeover(); dim.classList.remove('show'); paimonHide(); resetIdle();
  paimonSay('Paimon is awake! Paimon was not sleeping!', 2);
});
['click', 'keydown', 'touchstart', 'scroll'].forEach(function (ev) { window.addEventListener(ev, resetIdle, true); });
resetIdle();

// E135 blue screen of Paimon (tap "Adventure Rank")
tapper($('.rank-title'), 1, 500, function () {
  if (!startTakeover('bsod')) { return; }
  var b = make('div', 'x3-bsod', '<div><h2>:(</h2><p>Your portfolio ran into a problem: PAIMON.EXE stopped working.</p><p>100% complete (it isn\'t)</p><small>Tap to dismiss</small></div>');
  b.addEventListener('click', function () { b.remove(); endTakeover(); findSecret('bsod'); });
});

// E137 cursed Comic Sans (tap the "Skills" title)
tapper($('#skills h2'), 1, 500, function () {
  runTakeover('comic', 10, function () { document.body.classList.add('x3-comic'); findSecret('cursed'); },
    function () { document.body.classList.remove('x3-comic'); });
});

// E153 dizzy logo (3 quick taps)
var logo = $('#logo');
if (logo) {
  var lt = 0, ltm;
  logo.addEventListener('click', function () {
    lt++; clearTimeout(ltm); ltm = setTimeout(function () { lt = 0; }, 1000);
    if (lt >= 3) {
      lt = 0;
      runTakeover('spin', 4, function () { document.body.classList.add('x3-spin'); },
        function () { document.body.classList.remove('x3-spin'); findSecret('dizzy'); paimonSay('I feel sick...', 2); });
    }
  });
}

// E158 eclipse (10 taps on the sun / moon button, shared counter that resets)
var ec = 0, ect;
document.addEventListener('click', function (e) {
  if (!e.target.closest || !e.target.closest(SKY_BTN)) { return; }
  ec++; clearTimeout(ect); ect = setTimeout(function () { ec = 0; }, 3000);
  if (ec >= 10) {
    ec = 0;
    runTakeover('eclipse', 6, function () { make('div', 'x3-eclipse').id = 'x3-eclipse'; findSecret('eclipse'); },
      function () { var el = $('#x3-eclipse'); if (el) { el.remove(); } });
  }
});

// E156 click counter (ignores hidden-spot taps)
var clicks = 0;
document.addEventListener('click', function (e) {
  if (e.target.closest && e.target.closest('[data-secret]')) { return; }
  clicks++;
  if (clicks == 100) { findSecret('clicker'); paimonSay('Clicker of Teyvat!', 2); }
  if (clicks == 500) { findSecret('grass'); paimonSay('Please touch grass.', 2); }
});

// E162 gravity glitch (tap the copyright 5 times)
tapper($('#footer-copy'), 5, 2000, function () {
  runTakeover('gravity', 5, function () {
    var bottom = $('.eggs').getBoundingClientRect().bottom;
    $$('.el').forEach(function (b, i) {
      b.style.setProperty('--fall', (bottom - b.getBoundingClientRect().bottom - 12) + 'px');
      b.style.animationDelay = (i * 0.1) + 's';
      b.classList.add('x3-fall');
    });
    findSecret('gravity');
  }, function () {
    $$('.el').forEach(function (b) { b.classList.remove('x3-fall'); b.style.animationDelay = ''; });
  });
});

// E163 slime on the About heading
var aboutH = $('#about h2');
if (aboutH) {
  var slime = document.createElement('span');
  slime.className = 'x3-slime';
  slime.setAttribute('data-secret', '1');
  slime.setAttribute('role', 'button');
  slime.setAttribute('aria-label', 'Poke the slime');
  slime.innerHTML = '<i></i><i></i>';
  aboutH.appendChild(slime);
  slime.addEventListener('click', function () {
    slime.classList.add('poke');
    setTimeout(function () { slime.classList.add('gone'); findSecret('slime'); }, 600);
  });
}

// E174 credits roll (all secrets found, or tap the credits line 10 times)
var CREDITS = ['MARK\'S PORTFOLIO OF TEYVAT', 'Directed by|Mark Briones', 'Paimon|as Paimon', 'Slime #3|as Slime #2', 'Sweet Madame|as Cookies', 'Mark\'s sleep schedule|as Missing', 'Special thanks|Everyone who survived 90 pity', 'No slimes were harmed', 'Not affiliated with HoYoverse', 'THE END'];
function showCredits() {
  if (!startTakeover('credits')) { return; }
  var html = '';
  CREDITS.forEach(function (c) {
    var p = c.split('|');
    html += p.length == 2 ? '<p><small>' + p[0] + '</small><br>' + p[1] + '</p>' : '<h2>' + c + '</h2>';
  });
  var o = make('div', 'x3-credits', '<div class="roll">' + html + '</div><small class="skip-note">Tap to close</small>');
  function close() { o.remove(); endTakeover(); }
  o.addEventListener('click', close);
  o.querySelector('.roll').addEventListener('animationend', close);
  findSecret('credits');
}
tapper($('#footer-credits'), 10, 4000, showCredits);

// ===== start =====
renderCodex();

})();
