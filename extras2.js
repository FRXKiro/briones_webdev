// ===== ROUND 2 =====
eggNames.abyss = "Into the Abyss";
eggNames.menu = "Paimon's Menu";
eggNames.tea = "Serenitea Pot";

// ----- Page loader (element wheel) -----
var loader = document.getElementById("loader");
var loaderGone = false;
function hideLoader() {
    if (loaderGone) { return; }
    loaderGone = true;
    loader.classList.add("done");
    tick();
}
window.addEventListener("load", function () { setTimeout(hideLoader, 900); });
setTimeout(hideLoader, 4000);

// ----- Typewriter tagline -----
var words = ["BSIT Student", "Web Developer", "Genshin Fan"];
var typeEl = document.getElementById("type");
var w = 0, c = 0, del = false;
function tick() {
    var word = words[w];
    if (!del) {
        c++;
        typeEl.textContent = word.slice(0, c);
        if (c == word.length) { del = true; setTimeout(tick, 1300); return; }
        setTimeout(tick, 90);
        return;
    }
    c--;
    typeEl.textContent = word.slice(0, c);
    if (c == 0) { del = false; w = (w + 1) % words.length; setTimeout(tick, 300); return; }
    setTimeout(tick, 45);
}

// ----- Hero: giant name + quote follow the selected character, parallax -----
var heroInfo = {
    Venti: "🍃 Anemo · Bow. The wind shall lead you onward.",
    Zhongli: "⛰️ Geo · Polearm. Every journey has its final day. Don't rush.",
    Ei: "⚡ Electro · Polearm. Rainfall alone does not constitute a storm.",
    Nahida: "🌱 Dendro · Catalyst. Wisdom is not about knowing everything, but knowing what is enough.",
    Furina: "💧 Hydro · Sword. Justice is not a mere performance...but oh, how divine it is when it is.",
    Mavuika: "🔥 Pyro · Claymore. Before you become one with flame, be proud of who you are now.",
    Columbina: "🌙 A quiet song in the moonlight.",
    Anastasya: "✨ A special guest of this portfolio."
};
var heroNameEl = document.getElementById("hero-name");
var heroBig = document.getElementById("hero-big");
var heroQuote = document.getElementById("hero-quote");
function syncHero() {
    heroBig.textContent = heroNameEl.textContent;
    heroQuote.textContent = heroInfo[heroNameEl.textContent] || "";
}
new MutationObserver(syncHero).observe(heroNameEl, { childList: true, characterData: true, subtree: true });
syncHero();

var heroBox = document.querySelector("header");
if (canHover) {
    heroBox.addEventListener("mousemove", function (event) {
        var dx = (event.clientX / window.innerWidth - 0.5) * -22;
        var dy = (event.clientY / window.innerHeight - 0.5) * -14;
        heroImg.style.transform = "scale(1.07) translate(" + dx + "px," + dy + "px)";
    });
}

// ----- Sky background (follows scroll) + day/night button -----
var sky = document.createElement("div");
sky.id = "sky";
document.body.insertBefore(sky, document.body.firstChild);
var rainBox = document.createElement("div");
rainBox.id = "rain";
document.body.appendChild(rainBox);

var skyStops = [[[242, 166, 90], [59, 74, 122]], [[74, 144, 217], [160, 210, 240]], [[192, 96, 90], [43, 42, 90]], [[11, 16, 32], [27, 36, 64]]];
var skyMode = "auto";
function mix(a, b, t) {
    return [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); });
}
function updateSky() {
    var max = document.body.scrollHeight - window.innerHeight;
    var p = skyMode == "day" ? 0.34 : skyMode == "night" ? 1 : (max > 0 ? window.scrollY / max : 0);
    var x = p * 3, i = Math.min(2, Math.floor(x)), t = x - i;
    var top = mix(skyStops[i][0], skyStops[i + 1][0], t);
    var bottom = mix(skyStops[i][1], skyStops[i + 1][1], t);
    sky.style.background = "linear-gradient(rgb(" + top + "), rgb(" + bottom + "))";
}
window.addEventListener("scroll", updateSky);
updateSky();

var skyBtn = document.createElement("button");
skyBtn.id = "sky-btn";
skyBtn.textContent = "🌗";
skyBtn.title = "Sky: auto / day / night";
skyBtn.onclick = function () {
    skyMode = skyMode == "auto" ? "day" : skyMode == "day" ? "night" : "auto";
    skyBtn.textContent = skyMode == "auto" ? "🌗" : skyMode == "day" ? "☀️" : "🌙";
    updateSky();
};
siteNav.insertBefore(skyBtn, menuBtn);

// ----- Constellation: stars light up when you scroll to them -----
var constellation = document.getElementById("constellation");
var starList = constellation.querySelectorAll(".star");
var starInfo = document.getElementById("star-info");
new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) { return; }
    constellation.classList.add("lit");
    starList.forEach(function (s, n) {
        setTimeout(function () { s.classList.add("lit"); }, 300 * n);
    });
}, { threshold: 0.4 }).observe(constellation);
starList.forEach(function (s) {
    s.onmouseenter = s.onclick = function () { starInfo.textContent = s.getAttribute("data-info"); };
});

// ----- Cursor glow + sparkle trail + click burst -----
var glow = null;
var sparkCount = 0;
function spark(x, y, dx, dy) {
    var sp = document.createElement("span");
    sp.className = "spark";
    sp.style.left = x + "px";
    sp.style.top = y + "px";
    sp.style.setProperty("--dx", dx + "px");
    sp.style.setProperty("--dy", dy + "px");
    document.body.appendChild(sp);
    setTimeout(function () { sp.remove(); }, 650);
}
if (canHover) {
    glow = document.createElement("div");
    glow.id = "glow";
    document.body.appendChild(glow);
    window.addEventListener("mousemove", function (event) {
        glow.style.left = event.clientX + "px";
        glow.style.top = event.clientY + "px";
        sparkCount = sparkCount + 1;
        if (sparkCount % 4 == 0) { spark(event.clientX, event.clientY, (Math.random() - 0.5) * 20, 24); }
    });
    window.addEventListener("click", function (event) {
        for (var b = 0; b < 8; b++) {
            spark(event.clientX, event.clientY, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80);
        }
    });
}

// ----- Live preview of an activity when hovering its button -----
if (canHover) {
    var prev = document.createElement("div");
    prev.id = "preview";
    prev.innerHTML = '<iframe tabindex="-1" title="preview"></iframe>';
    document.body.appendChild(prev);
    var prevFrame = prev.querySelector("iframe");
    document.querySelectorAll(".card .btn").forEach(function (b) {
        b.addEventListener("mouseenter", function () {
            if (prevFrame.getAttribute("src") != b.getAttribute("href")) { prevFrame.src = b.getAttribute("href"); }
            prev.classList.add("show");
        });
        b.addEventListener("mousemove", function (event) {
            prev.style.left = Math.min(event.clientX + 20, window.innerWidth - 380) + "px";
            prev.style.top = Math.max(80, Math.min(event.clientY - 120, window.innerHeight - 245)) + "px";
        });
        b.addEventListener("mouseleave", function () { prev.classList.remove("show"); });
    });
}

// ----- Daily commissions (quest tracker) -----
var questNames = { about: "Visit About", activity: "Open an activity", secrets: "Find 3 secrets", bottle: "Send a message" };
var questDone = {};
var quests = document.createElement("div");
quests.id = "quests";
quests.innerHTML = "<b>Daily Commissions</b><ul>" + Object.keys(questNames).map(function (k) { return '<li id="q-' + k + '">' + questNames[k] + "</li>"; }).join("") + "</ul>";
document.body.appendChild(quests);
if (window.innerWidth < 1400) { quests.classList.add("min"); }
quests.querySelector("b").onclick = function () { quests.classList.toggle("min"); };

function questDoneNow(k) {
    if (questDone[k]) { return; }
    questDone[k] = true;
    document.getElementById("q-" + k).classList.add("done");
    showToast("Commission complete: " + questNames[k]);
    if (Object.keys(questDone).length == 4) {
        say("All commissions done! Great job, Traveler!", 4000);
        emojiRain(["⭐", "✨"], 40);
    }
}
document.querySelectorAll(".card .btn").forEach(function (b) {
    b.addEventListener("click", function () { questDoneNow("activity"); });
});
setInterval(function () {
    if (window.scrollY + window.innerHeight / 2 > document.getElementById("about").offsetTop) { questDoneNow("about"); }
    if (Object.keys(eggsFound).length >= 3) { questDoneNow("secrets"); }
    if (eggsFound.bottle) { questDoneNow("bottle"); }
}, 800);

// ----- Back to top + settings menu -----
var toTop = document.createElement("button");
toTop.id = "to-top";
toTop.textContent = "↑";
toTop.onclick = function () { window.scrollTo({ top: 0 }); };
window.addEventListener("scroll", function () { toTop.classList.toggle("show", window.scrollY > 500); });

var saved = {};
try { saved = JSON.parse(localStorage.getItem("settings")) || {}; } catch (err) { saved = {}; }
var sets = {
    particles: saved.particles !== false,
    cursor: saved.cursor !== false,
    pal: saved.pal !== false,
    calm: saved.calm === undefined ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : saved.calm
};
var gear = document.createElement("button");
gear.id = "gear";
gear.textContent = "⚙";
gear.title = "Settings";
var panel = document.createElement("div");
panel.id = "settings";
panel.innerHTML = "<b>Paimon's Menu</b>" + [["particles", "Fireflies"], ["cursor", "Cursor glow"], ["pal", "Paimon pal"], ["calm", "Reduce motion"]].map(function (o) {
    return '<label><input type="checkbox" data-k="' + o[0] + '"> ' + o[1] + "</label>";
}).join("");
document.body.appendChild(toTop);
document.body.appendChild(gear);
document.body.appendChild(panel);

function applySets() {
    document.body.classList.toggle("calm", sets.calm);
    document.body.classList.toggle("nofly", !sets.particles);
    document.body.classList.toggle("nocursor", !sets.cursor);
    pal.style.display = sets.pal ? "" : "none";
    panel.querySelectorAll("input").forEach(function (i) { i.checked = sets[i.getAttribute("data-k")]; });
}
panel.addEventListener("change", function (event) {
    sets[event.target.getAttribute("data-k")] = event.target.checked;
    try { localStorage.setItem("settings", JSON.stringify(sets)); } catch (err) {}
    applySets();
});
gear.onclick = function () { panel.classList.toggle("open"); };
applySets();

// ----- Serenitea Pot mode: click the footer -----
function toggleTea() {
    var on = document.body.classList.toggle("tea");
    showToast(on ? "Welcome to the Serenitea Pot..." : "Back to Teyvat!");
    if (on) { say("So cozy! Paimon loves the rain!", 3500); foundEgg("tea"); }
}
document.querySelector("footer p").onclick = function (event) {
    if (event.target.closest && event.target.closest("[data-secret]")) { return; }
    toggleTea();
};

// ----- Abyss flashlight: click the hero background 10 times -----
var abyss = document.createElement("div");
abyss.id = "abyss";
var abyssMsg = document.createElement("div");
abyssMsg.id = "abyss-msg";
abyssMsg.textContent = "✦ The Abyss says: thanks for visiting! ✦";
document.body.appendChild(abyssMsg);
document.body.appendChild(abyss);

function moveLight(x, y) {
    abyss.style.setProperty("--ax", x + "px");
    abyss.style.setProperty("--ay", y + "px");
}
abyss.addEventListener("mousemove", function (event) { moveLight(event.clientX, event.clientY); });
abyss.addEventListener("touchmove", function (event) { moveLight(event.touches[0].clientX, event.touches[0].clientY); });
abyss.onclick = function (event) {
    var r = abyssMsg.getBoundingClientRect();
    var d = Math.hypot(event.clientX - (r.left + r.width / 2), event.clientY - (r.top + r.height / 2));
    if (d < 90) {
        abyss.classList.remove("on");
        abyssMsg.classList.remove("on");
        flash("rgba(255, 217, 138, 0.8)");
        showToast("You found the Abyss message!");
        foundEgg("abyss");
    }
};
var abyssLeaveTimer;
function leaveAbyss() {
    clearTimeout(abyssLeaveTimer);
    abyss.classList.remove("on");
    abyssMsg.classList.remove("on");
}
abyss.ondblclick = leaveAbyss;
document.addEventListener("keydown", function (event) {
    if (event.key == "Escape") { leaveAbyss(); }
});

var abyssClicks = 0;
var abyssTimer;
heroBox.addEventListener("click", function (event) {
    var t = event.target;
    if (t.id != "hero-img" && !t.classList.contains("hero-shade") && t.tagName != "HEADER") { return; }
    abyssClicks = abyssClicks + 1;
    clearTimeout(abyssTimer);
    abyssTimer = setTimeout(function () { abyssClicks = 0; }, 5000);
    if (abyssClicks == 10) {
        abyssClicks = 0;
        abyssMsg.style.left = (15 + Math.random() * 65) + "vw";
        abyssMsg.style.top = (20 + Math.random() * 55) + "vh";
        abyssMsg.classList.add("on");
        abyss.classList.add("on");
        abyssLeaveTimer = setTimeout(leaveAbyss, 45000);
        moveLight(window.innerWidth / 2, window.innerHeight / 2);
        showToast("The lights went out... find the hidden message. (double-click to leave)");
    }
});

// ----- Genshin right-click menu (desktop) -----
var ctx = document.createElement("div");
ctx.id = "ctx";
ctx.innerHTML = '<button data-a="call">Call Paimon</button><button data-a="wish">Make a Wish</button><button data-a="top">Teleport to Top</button><button data-a="tea">Serenitea Pot</button>';
document.body.appendChild(ctx);
var ctxX = 0, ctxY = 0;

document.addEventListener("contextmenu", function (event) {
    if (!canHover) { return; }
    if (event.target.closest && event.target.closest("input, textarea")) { return; }   // keep normal paste/copy menu in forms
    event.preventDefault();
    ctxX = event.clientX;
    ctxY = event.clientY;
    ctx.style.left = Math.min(ctxX, window.innerWidth - 180) + "px";
    ctx.style.top = Math.min(ctxY, window.innerHeight - 170) + "px";
    ctx.style.display = "block";
});
document.addEventListener("click", function () { ctx.style.display = "none"; });
window.addEventListener("scroll", function () { ctx.style.display = "none"; });

ctx.onclick = function (event) {
    var a = event.target.getAttribute("data-a");
    if (!a) { return; }
    if (a == "call") {
        pal.style.right = "auto";
        pal.style.bottom = "auto";
        pal.style.left = Math.min(ctxX, window.innerWidth - 90) + "px";
        pal.style.top = Math.min(ctxY, window.innerHeight - 90) + "px";
        pal.classList.add("hop");
        setTimeout(function () { pal.classList.remove("hop"); }, 700);
        say("Paimon is here! What do you need?", 3000);
    } else if (a == "wish") {
        document.getElementById("wish-btn").click();
    } else if (a == "top") {
        flash("rgba(120, 200, 255, 0.7)");
        window.scrollTo({ top: 0 });
    } else if (a == "tea") {
        toggleTea();
    }
    foundEgg("menu");
};
