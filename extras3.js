// extras3.js - second batch, merged with script.js and extras.js.
// Loads LAST. It reuses your existing foundEgg, say, showToast, showBanner and the old gacha (G, pullOne, doWish).
(function () {

// ===== settings you may need to edit =====
var SKY_BTN = 'nav button:not(#menu-btn)';   // the sun / moon button in the navbar

// ===== small helpers =====
function $(s) { return document.querySelector(s); }
function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
function load(k, d) { try { var v = localStorage.getItem('x3_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function save(k, v) { try { localStorage.setItem('x3_' + k, JSON.stringify(v)); } catch (e) {} }
function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
function make(tag, cls, html) {
  var e = document.createElement(tag);
  if (cls) { e.className = cls; }
  if (html) { e.innerHTML = html; }
  document.body.appendChild(e);
  return e;
}
// tap an element N times within a time window
function tapper(el, need, ms, fn) {
  if (!el) { return; }
  var n = 0, t;
  el.setAttribute('data-secret', '1');   // the click counter ignores these taps
  el.addEventListener('click', function () {
    n++; clearTimeout(t);
    t = setTimeout(function () { n = 0; }, ms);
    if (n >= need) { n = 0; fn(); }
  });
}

// ===== one full-page effect at a time =====
var busy = '';
function startTakeover(name) {
  if (busy) { return false; }
  busy = name;
  document.body.classList.add('x3-temp');
  return true;
}
function endTakeover() { busy = ''; document.body.classList.remove('x3-temp'); }
function runTakeover(name, secs, onStart, onEnd) {
  if (!startTakeover(name)) { paimonSay('Not now!', 2); return false; }
  onStart();
  setTimeout(function () { onEnd(); endTakeover(); }, secs * 1000);
  return true;
}

// ===== popups wait in a line =====
var queue = [], showing = false;
function addPopup(fn) { queue.push(fn); nextPopup(); }
function nextPopup() {
  if (showing || queue.length == 0) { return; }
  showing = true;
  queue.shift()(function () { showing = false; setTimeout(nextPopup, 3000); });
}

// ===== one Paimon: reuse the pal from extras.js (say, pal, palSay) =====
var pLevel = 0, pTimer;
function paimonSay(text, level, ms) {
  level = level || 2;
  if (level < pLevel) { return; }
  pLevel = level;
  say(text, ms || 3500);
  clearTimeout(pTimer);
  pTimer = setTimeout(function () { pLevel = 0; }, ms || 3500);
}
function paimonHide() { pLevel = 0; clearTimeout(pTimer); pal.classList.remove('talk'); }

// ===== ONE list of secrets, merged with your old counter =====
var OLD = [
  { id: 'link',     hint: 'A link in About goes somewhere magical.' },
  { id: 'paimon',   hint: 'Paimon has a word about food.' },
  { id: 'mood',     hint: 'A grumpy picture can change the whole page.' },
  { id: 'logo',     hint: 'The logo likes a double tap.' },
  { id: 'elements', hint: 'All seven elements, together.' },
  { id: 'wish',     hint: 'Make a wish.' },
  { id: 'hero',     hint: 'Pick a hero character.' },
  { id: 'move',     hint: 'Heroes have signature moves.' },
  { id: 'tab',      hint: 'Leave this tab, then come back.' },
  { id: 'end',      hint: 'Reach the very bottom.' },
  { id: 'rank',     hint: 'Tap the logo many, many times.' },
  { id: 'poke',     hint: 'Poke the floating Paimon.' },
  { id: 'bottle',   hint: 'Send a message in a bottle.' }
];
var UNKNOWN = [
  { id: 'abyss', hint: 'A hero with the lights out.' },
  { id: 'menu',  hint: 'A right-click on desktop.' },
  { id: 'tea',   hint: 'Something in the footer.' }
];
var NEW = [
  { id: 'dizzy',    name: 'Dizzy Logo',            hint: 'The logo does not like fast fingers.', count: true },
  { id: 'cursed',   name: 'Cursed Comic Sans',     hint: 'One section title has a cursed side.', count: true },
  { id: 'bsod',     name: 'Blue Screen of Paimon', hint: 'Something in Skills can crash the page.', count: true },
  { id: 'nopress',  name: 'Disobedient Traveler',  hint: 'Some buttons ask you not to press them.', count: true },
  { id: 'resin',    name: 'Resin Refill',          hint: 'Paimon is short on Resin.', count: true },
  { id: 'sleep',    name: 'Sleepy Paimon',         hint: 'Leave Paimon alone for a while.', count: true },
  { id: 'gravity',  name: 'Gravity Glitch',        hint: 'The footer has a heavy side.', count: true },
  { id: 'slime',    name: 'Slime on the Heading',  hint: 'Something green sits in About.', count: true },
  { id: 'clicker',  name: 'Clicker of Teyvat',     hint: 'Keep clicking. A lot.', count: true },
  { id: 'grass',    name: 'Touch Grass',           hint: 'Keep clicking. Even more.', count: true },
  { id: 'eclipse',  name: 'Eclipse',               hint: 'The sun and moon button has a limit.', count: true },
  { id: 'rainbow',  name: 'Rainbow Wish',          hint: 'Hard pity looks different.', count: true },
  { id: 'pigeon',   name: 'Pigeon Mail',           hint: 'Some letters get a special courier.', count: false },
  { id: 'cookie',   name: 'Sweet Madame Cookies',  hint: 'A banner shows up once.', count: false },
  { id: 'ad',       name: 'Runaway Ad',            hint: 'A pop-up that is hard to close.', count: false },
  { id: 'lag',      name: 'Lag Spike',             hint: 'The page sometimes freezes.', count: false },
  { id: 'typing',   name: 'Paimon is typing',      hint: 'She has something to say.', count: false },
  { id: 'credits',  name: 'Credits Roll',          hint: 'Find them all, or poke the credits line.', count: false }
];
var byId = {};
NEW.forEach(function (s) { byId[s.id] = s; if (s.count) { eggNames[s.id] = s.name; } });
eggTotal = 16 + NEW.filter(function (s) { return s.count; }).length;   // new secrets join the same counter

// restore found secrets (your old eggsFound is not saved, so we save it)
var passive = load('passive', {});
var savedEggs = load('eggs', {});
for (var k in savedEggs) { eggsFound[k] = true; }
function foundCount() { return Object.keys(eggsFound).length; }
function updateCounter() { document.getElementById('egg-count').textContent = foundCount() + ' / ' + eggTotal; }
updateCounter();

var realFound = foundEgg;
foundEgg = function (name) {
  var was = eggsFound[name];
  realFound(name);
  if (!was && eggsFound[name]) {
    save('eggs', eggsFound);
    renderCodex();
    if (foundCount() >= eggTotal && !load('creditsAuto', 0)) { save('creditsAuto', 1); setTimeout(showCredits, 3500); }
  }
};
function findSecret(id) {
  var s = byId[id];
  if (s && !s.count) {
    if (passive[id]) { return; }
    passive[id] = 1; save('passive', passive);
    showBanner(s.name);
    renderCodex();
    return;
  }
  foundEgg(id);
}
function isFound(id) { return !!(eggsFound[id] || passive[id]); }

// ===== U96 codex (dropdown) =====
function renderCodex() {
  var list = $('#codex-list');
  if (!list) { return; }
  var known = {}, html = '';
  OLD.forEach(function (s) { known[s.id] = 1; });
  NEW.forEach(function (s) { known[s.id] = 1; });
  var extra = Object.keys(eggsFound).filter(function (id) { return !known[id]; });
  function chip(found, name, hint) {
    return found ? '<li class="got">' + name + '</li>' : '<li>???<small>' + hint + '</small></li>';
  }
  OLD.forEach(function (s) { html += chip(eggsFound[s.id], eggNames[s.id] || s.id, s.hint); });
  UNKNOWN.forEach(function (s) { html += chip(eggsFound[s.id], eggNames[s.id], s.hint); });
  NEW.forEach(function (s) { html += chip(isFound(s.id), s.name, s.hint); });
  list.innerHTML = html;
  var c = $('#codex-count');
  if (c) { c.textContent = foundCount() + ' / ' + eggTotal; }
  updateCounter();
}
var hintBtn = $('#hint-btn');
if (hintBtn) {
  hintBtn.addEventListener('click', function () {
    var left = [];
    OLD.forEach(function (s) { if (!eggsFound[s.id]) { left.push(s.hint); } });
    NEW.forEach(function (s) { if (s.count && !eggsFound[s.id]) { left.push(s.hint); } });
    UNKNOWN.forEach(function (s) { if (!eggsFound[s.id]) { left.push(s.hint); } });
    if (left.length == 0) { paimonSay('You found everything! Paimon is proud.', 2); return; }
    paimonSay('Hmm... ' + rand(left), 2, 5000);
  });
}

// ===== U93 remember my choices =====
var skipClass = { shake: 1, resonance: 1, cheerful: 1, lite: 1 };
var saveTimer;
function saveChoices() {
  if (document.body.classList.contains('x3-temp')) { return; }
  var keep = document.body.className.split(' ').filter(function (c) { return c && c.indexOf('x3-') != 0 && !skipClass[c]; }).join(' ');
  save('body', keep);
}
document.addEventListener('click', function () { clearTimeout(saveTimer); saveTimer = setTimeout(saveChoices, 400); });
var savedBody = load('body', '');
if (savedBody) { savedBody.split(' ').forEach(function (c) { if (c) { document.body.classList.add(c); } }); }
$$('.thumb').forEach(function (t) { t.addEventListener('click', function () { save('hero', t.alt); }); });
var savedHero = load('hero', '');
if (savedHero) {
  for (var h = 0; h < thumbs.length; h++) {
    if (thumbs[h].alt == savedHero) {
      showSlide(h); startTimer();
      document.documentElement.style.setProperty('--gold', heroTheme[savedHero] || '#d3bc8e');   // no secret is counted here
    }
  }
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
if ($('#lite-toggle')) { $('#lite-toggle').addEventListener('click', function () { lite = !lite; save('lite', lite); applyLite(); }); }

// ===== U88 accessibility =====
$$('.thumb').forEach(function (t) {
  t.setAttribute('tabindex', '0');
  t.setAttribute('role', 'button');
  t.setAttribute('aria-label', 'Choose ' + t.alt + ' as hero');
  t.addEventListener('keydown', function (e) { if (e.key == 'Enter' || e.key == ' ') { e.preventDefault(); t.click(); } });
});
var mb = $('#menu-btn');
if (mb) {
  mb.setAttribute('aria-controls', 'nav-links');
  mb.setAttribute('aria-expanded', 'false');
  mb.addEventListener('click', function () { mb.setAttribute('aria-expanded', mb.getAttribute('aria-expanded') == 'true' ? 'false' : 'true'); });
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

// ===== U115 friendlier contact form (works with the form submit in extras.js) =====
var cform = $('#contact-form');
if (cform) {
  var cmsg = $('#cmsg');
  var counter = document.createElement('small');
  counter.className = 'x3-counter';
  counter.textContent = '0 / 300';
  if (cmsg) {
    cmsg.setAttribute('maxlength', '300');
    cmsg.parentNode.appendChild(counter);
    cmsg.addEventListener('input', function () { counter.textContent = cmsg.value.length + ' / 300'; });
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
  cform.appendChild(check);
  // extras.js sets the status to "ok" only when the message really sent
  var statusBox = $('#form-status');
  if (statusBox) {
    new MutationObserver(function () {
      if (statusBox.className != 'ok') { return; }
      counter.textContent = '0 / 300';
      check.classList.remove('go'); void check.offsetWidth; check.classList.add('go');
      if (Math.random() < 0.4) { flyPigeon(); }   // E140: animation only
    }).observe(statusBox, { attributes: true, childList: true });
  }
}
function flyPigeon() {
  var p = make('div', 'x3-pigeon', '<svg viewBox="0 0 80 40"><ellipse cx="38" cy="24" rx="18" ry="10"/><circle cx="58" cy="16" r="7"/><path d="M64 16l9 3-9 2z"/><path class="wing" d="M30 20q8-18 20-4z"/></svg><i>&#9993;</i>');
  setTimeout(function () { p.remove(); }, 4200);
  findSecret('pigeon');
}

// ===== U84 Wish section: the OLD gacha now lives here (one system) =====
// Flins and Arlecchino join the featured banners (pictures: images/wish/flins.jpg and arlecchino.jpg)
['Flins', 'Arlecchino'].forEach(function (n) { if (limited5.indexOf(n) == -1) { limited5.push(n); } });
if (!load('wishInit', 0)) {
  G.banner = limited5.indexOf('Flins');
  saveG();
  save('wishInit', 1);
}
var sawHard = false;

// big featured picture + picker: change the featured 5-star any time (winning the 50/50 gives this character)
var thumbBox = $('#banner-thumbs');
if (thumbBox) {
  limited5.forEach(function (n, i) {
    var tb = document.createElement('button');
    tb.type = 'button';
    tb.className = 'bt';
    tb.title = n;
    tb.setAttribute('aria-label', 'Feature ' + n);
    var im = document.createElement('img');
    im.src = 'images/wish/' + slug(n) + '.jpg';
    im.alt = '';
    tb.appendChild(im);
    tb.addEventListener('click', function () { G.banner = i; saveG(); drawBanner(); });
    thumbBox.appendChild(tb);
  });
}
var realDraw = drawBanner;
drawBanner = function () {
  realDraw();
  var n = limited5[G.banner];
  var big = $('#wish-feature');
  if (big) { big.src = 'images/wish/' + slug(n) + '.jpg'; big.alt = n; }
  if ($('#wish-feature-name')) { $('#wish-feature-name').textContent = n; }
  $$('#banner-thumbs .bt').forEach(function (t, i) { t.classList.toggle('on', i == G.banner); });
};
drawBanner();
if ($('#bp-prev')) { $('#bp-prev').addEventListener('click', function () { G.banner = (G.banner + limited5.length - 1) % limited5.length; saveG(); drawBanner(); }); }
if ($('#bp-next')) { $('#bp-next').addEventListener('click', function () { G.banner = (G.banner + 1) % limited5.length; saveG(); drawBanner(); }); }

// rainbow on hard pity
var realPull = pullOne;
pullOne = function () {
  var before = G.p5;
  var r = realPull();
  if (r.star == 5 && before >= 89) { sawHard = true; }
  return r;
};

function titleFor(n) {
  if (n >= 100) { return 'Certified Pity Survivor'; }
  if (n >= 50) { return 'Primogem Burner'; }
  if (n >= 10) { return 'Gambler'; }
  return 'Newbie';
}
function wishInfo() {
  if ($('#w-rank')) { $('#w-rank').textContent = 'Wishing rank: ' + titleFor(G.total) + ' (' + G.total + ' pulls)'; }
  if ($('#luck')) { $('#luck').textContent = 'Today\'s luck: ' + rand(['Blessed', 'Average', 'Cursed']); }   // decoration only
}
var realWish = doWish;
doWish = function (n) {
  sawHard = false;
  realWish(n);
  wishInfo();
  if (sawHard) {
    wishModal.classList.add('x3-rainbow');
    findSecret('rainbow');
  }
};
wishInfo();

// Wish section buttons -> the same system as the (hidden) old buttons
function renderResults(items) {
  var box = $('#w-results');
  if (!box) { return; }
  box.innerHTML = '';
  items.forEach(function (r) {
    var d = document.createElement('div');
    d.className = 'w-item' + (r.s == 5 ? ' s5' : '');
    var img = document.createElement('img');
    img.alt = r.n;
    var srcs = ['images/wish/' + slug(r.n) + '.jpg'];
    if (r.s == 5) { srcs.push('images/' + slug(r.n) + '.jpg'); }
    var tried = 0;
    img.onerror = function () {
      tried++;
      if (tried < srcs.length) { img.src = srcs[tried]; } else { img.remove(); }
    };
    img.src = srcs[0];
    d.appendChild(img);
    var nm = document.createElement('div');
    nm.textContent = r.n;
    d.appendChild(nm);
    var em = document.createElement('em');
    em.textContent = '\u2605'.repeat(r.s);
    d.appendChild(em);
    box.appendChild(d);
  });
}
function showWPity() {
  var p = $('#w-pity');
  if (p) { p.textContent = pityBox.textContent; }
}
var realShowPity = showPity;
showPity = function () { realShowPity(); showWPity(); };
showPity();

var realWish2 = doWish;
doWish = function (n) {
  realWish2(n);
  renderResults(G.hist.slice(0, n));
  showWPity();
};
if ($('#w1')) { $('#w1').addEventListener('click', function () { wishBtn.click(); }); }
if ($('#w10')) { $('#w10').addEventListener('click', function () { wish10.click(); }); }

// phone bottom sheet
if ($('#wish-open')) {
  $('#wish-open').addEventListener('click', function () { $('#wish-card').classList.add('open'); });
  $('#wish-close').addEventListener('click', function () { $('#wish-card').classList.remove('open'); });
}

// E124 resin refill
if ($('#resin-btn')) {
  $('#resin-btn').addEventListener('click', function () {
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

// ===== popups =====
// E120 fake cookie banner (once ever)
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
      if (tries < 3) { tries++; x.style.left = (Math.random() * 70) + '%'; x.style.top = (Math.random() * 60) + '%'; return; }
      ad.remove(); findSecret('ad'); done();
    });
  });
}, 45000);
// E185 lag spike (once per visit, never blocks the screen)
setTimeout(function () {
  addPopup(function (done) {
    var s = make('div', 'x3-lag', '<div class="spin"></div>');
    setTimeout(function () { s.remove(); showToast('Sorry, Paimon sat on the server.'); findSecret('lag'); done(); }, 2000);
  });
}, 80000);

// E143 Paimon is typing...
setTimeout(function () {
  paimonSay('...', 2, 7000);
  var dots = 0, t = setInterval(function () { dots++; palSay.textContent = '...'.slice(0, (dots % 3) + 1); }, 400);
  setTimeout(function () { clearInterval(t); palSay.textContent = '...never mind'; findSecret('typing'); }, 6500);
}, 60000);

// E130 sleepy Paimon (3 minutes with no activity)
var asleep = false, idleT;
var dim = make('div', 'x3-dim', '<span>Zzz</span><small>Tap to wake Paimon</small>');
function sleepIdle() { if (asleep) { return; } clearTimeout(idleT); idleT = setTimeout(sleepNow, 180000); }
function sleepNow() {
  if (!startTakeover('sleep')) { sleepIdle(); return; }
  asleep = true;
  dim.classList.add('show');
  paimonSay('Zzz...', 1, 86400000);
  findSecret('sleep');
}
dim.addEventListener('click', function () {
  asleep = false; endTakeover(); dim.classList.remove('show'); paimonHide(); sleepIdle();
  paimonSay('Paimon is awake! Paimon was not sleeping!', 2);
});
['click', 'keydown', 'touchstart', 'scroll'].forEach(function (ev) { window.addEventListener(ev, sleepIdle, true); });
sleepIdle();

// ===== hidden taps =====
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
// E153 dizzy logo: 3 to 6 quick taps, then a pause (7 taps is still Adventure Rank Up)
var logo = $('#logo');
if (logo) {
  var lt = 0, ltm;
  logo.addEventListener('click', function () {
    lt++; clearTimeout(ltm);
    ltm = setTimeout(function () {
      var n = lt; lt = 0;
      if (n >= 3 && n < 7) {
        runTakeover('spin', 4, function () { document.body.classList.add('x3-spin'); },
          function () { document.body.classList.remove('x3-spin'); findSecret('dizzy'); paimonSay('I feel sick...', 2); });
      }
    }, 900);
  });
}
// E158 eclipse (10 taps on the sun / moon button)
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
// E162 gravity glitch (tap the copyright mark 5 times)
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

renderCodex();

})();
