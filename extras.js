// ===== ROUND 1 EXTRAS =====
var canHover = window.matchMedia("(hover: hover)").matches;

function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// ----- Achievement banners (this replaces foundEgg from script.js) -----
var eggNames = {
    link: "Teleporter", paimon: "Emergency Food?!", mood: "Mood Swing", logo: "Welcome Back",
    elements: "Elemental Resonance", wish: "Wish Maker", hero: "Character Select", move: "Signature Move",
    tab: "Come Back!", end: "End of Teyvat", rank: "Adventure Rank Up", poke: "Paimon Poker", bottle: "Message in a Bottle"
};
var banner = document.getElementById("banner");
var bannerTimer;

function showBanner(text) {
    banner.innerHTML = "Achievement Unlocked!<strong>" + text + "</strong>";
    banner.classList.add("show");
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(function () {
        banner.classList.remove("show");
    }, 3000);
}

function foundEgg(name) {
    if (eggsFound[name]) {
        return;
    }
    eggsFound[name] = true;
    var total = Object.keys(eggsFound).length;
    document.getElementById("egg-count").textContent = total + " / " + eggTotal;
    if (total == eggTotal) {
        flash("gold");
        emojiRain(["⭐", "✨", "🌟"], 80);
        showBanner("All secrets found!");
        showToast("All secrets found! You are a true Traveler!");
    } else {
        showBanner(eggNames[name] || name);
    }
}

// ----- Paimon pal: follows the mouse, talks, greets by time, wakes up when idle -----
var pal = document.createElement("div");
pal.id = "paimon-pal";
pal.innerHTML = '<div id="pal-say"></div><img id="pal-img" src="images/paimon.jpg" alt="Paimon">';
document.body.appendChild(pal);
var palImg = document.getElementById("pal-img");
var palSay = document.getElementById("pal-say");
var sayTimer;

function say(text, ms) {
    palSay.textContent = text;
    pal.classList.add("talk");
    clearTimeout(sayTimer);
    sayTimer = setTimeout(function () {
        pal.classList.remove("talk");
    }, ms || 3500);
}

if (canHover) {
    // Lazy follower: she only hops over when the mouse is far away, so you can walk up and poke her
    window.addEventListener("mousemove", function (event) {
        var r = pal.getBoundingClientRect();
        var far = Math.hypot(event.clientX - (r.left + r.width / 2), event.clientY - (r.top + r.height / 2)) > 170;
        if (!far) {
            return;
        }
        pal.style.right = "auto";
        pal.style.bottom = "auto";
        pal.style.left = Math.min(event.clientX + 40, window.innerWidth - 90) + "px";
        pal.style.top = Math.min(event.clientY + 30, window.innerHeight - 90) + "px";
    });
}

var pokes = 0;
var pokeTimer;
palImg.onclick = function () {
    pokes = pokes + 1;
    clearTimeout(pokeTimer);
    pokeTimer = setTimeout(function () { pokes = 0; }, 6000);
    if (pokes >= 5) {
        pokes = 0;
        palImg.src = "images/paimon-angry-trigger.gif?t=" + Date.now();
        say("Stop poking Paimon!!", 2500);
        shake();
        setTimeout(function () { palImg.src = "images/paimon.jpg"; }, 2600);
        foundEgg("poke");
    } else {
        say(pick(["Hehe, that tickles!", "Paimon is not emergency food!", "Where are we going, Traveler?", "Paimon wants snacks!"]), 2500);
    }
};

var hour = new Date().getHours();
var greeting = hour < 5 ? "Traveler, it's so late! Go to sleep!" : hour < 12 ? "Good morning, Traveler!" : hour < 18 ? "Good afternoon, Traveler!" : "Good evening, Traveler!";
setTimeout(function () { say(greeting, 4500); }, 1500);

var idleTimer;
function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
        say("Are you still there, Traveler?", 4000);
    }, 15000);
}
["mousemove", "scroll", "click", "touchstart"].forEach(function (ev) {
    window.addEventListener(ev, resetIdle);
});
resetIdle();

// ----- Hero characters: click = theme colour, double-click = signature move -----
var heroTheme = {
    Venti: "#3fb6a8", Zhongli: "#d99a3d", Ei: "#8e5fc7", Nahida: "#6aa84f",
    Furina: "#3a7bd5", Mavuika: "#e0603f", Columbina: "#b9a7e8", Anastasya: "#f08fb0"
};
var heroFx = {
    Venti: ["🍃", "🪶"], Zhongli: ["🪨", "💛"], Ei: ["⚡", "💜"], Nahida: ["🌿", "🌱"], Furina: ["💧", "👏"], Mavuika: ["🔥", "❤️"]
};

for (var t = 0; t < thumbs.length; t++) {
    thumbs[t].addEventListener("click", function () {
        document.documentElement.style.setProperty("--gold", heroTheme[this.alt] || "#d3bc8e");
        foundEgg("hero");
    });
    thumbs[t].addEventListener("dblclick", function () {
        var n = this.alt;
        flash(heroTheme[n] || "#fff");
        emojiRain(heroFx[n] || ["✨", "🌟"], 45);
        if (n == "Zhongli" || n == "Mavuika") {
            shake();
        }
        showToast(n + " used a signature move!");
        foundEgg("move");
    });
}

// ----- Logo: 7 quick clicks = Adventure Rank Up -----
var logoClicks = 0;
var logoTimer;
document.getElementById("logo").addEventListener("click", function () {
    logoClicks = logoClicks + 1;
    clearTimeout(logoTimer);
    logoTimer = setTimeout(function () { logoClicks = 0; }, 4000);
    if (logoClicks == 7) {
        logoClicks = 0;
        flash("rgba(255, 215, 0, 0.8)");
        emojiRain(["⭐", "✨"], 60);
        showToast("Adventure Rank Up!");
        foundEgg("rank");
    }
});

// ----- Tab-away Paimon -----
var oldTitle = document.title;
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        document.title = "Paimon is looking for you...";
    } else {
        document.title = "Welcome back, Traveler!";
        setTimeout(function () { document.title = oldTitle; }, 3000);
        foundEgg("tab");
    }
});

// ----- Dot navigator -----
var dots = document.createElement("div");
dots.id = "dots";
["home", "about", "skills", "activities", "contact"].forEach(function (id) {
    var a = document.createElement("a");
    a.href = "#" + id;
    a.title = id.charAt(0).toUpperCase() + id.slice(1);
    dots.appendChild(a);
});
document.body.appendChild(dots);

// ----- Scroll: smart navbar, dots, end of Teyvat -----
var siteNav = document.querySelector("nav");
var lastY = 0;
var endShown = false;

function onScrollExtras() {
    var y = window.scrollY;
    if (!navLinks.classList.contains("show")) {
        siteNav.classList.toggle("hide", y > lastY && y > 200);
    }
    lastY = y;

    var cur = "home";
    for (var i = 0; i < sections.length; i++) {
        if (y >= sections[i].offsetTop - 120) {
            cur = sections[i].id;
        }
    }
    for (var j = 0; j < dots.children.length; j++) {
        dots.children[j].classList.toggle("on", dots.children[j].getAttribute("href") == "#" + cur);
    }

    if (window.innerHeight + y >= document.body.scrollHeight - 4 && !endShown) {
        endShown = true;
        emojiRain(["🎆", "🎇", "✨", "🎉"], 70);
        flash("rgba(255, 255, 255, 0.5)");
        say("You've reached the end of Teyvat!", 4000);
        foundEgg("end");
        setTimeout(function () { endShown = false; }, 8000);
    }
}
window.addEventListener("scroll", onScrollExtras);
onScrollExtras();

// ----- Card tilt + cursor spotlight -----
if (canHover) {
    document.querySelectorAll(".card, .about-box, .eggs").forEach(function (box) {
        box.addEventListener("mousemove", function (event) {
            var r = box.getBoundingClientRect();
            var x = event.clientX - r.left;
            var y = event.clientY - r.top;
            box.style.setProperty("--mx", x + "px");
            box.style.setProperty("--my", y + "px");
            if (box.classList.contains("card")) {
                box.style.transform = "perspective(700px) rotateX(" + ((0.5 - y / r.height) * 8) + "deg) rotateY(" + ((x / r.width - 0.5) * 8) + "deg)";
            }
        });
        box.addEventListener("mouseleave", function () {
            box.style.transform = "";
        });
    });
}

// ----- Fireflies -----
for (var f = 0; f < 22; f++) {
    var fly = document.createElement("span");
    fly.className = "firefly";
    fly.style.left = Math.random() * 100 + "vw";
    fly.style.top = Math.random() * 100 + "vh";
    fly.style.animationDuration = (6 + Math.random() * 8) + "s";
    fly.style.animationDelay = (-Math.random() * 10) + "s";
    document.body.appendChild(fly);
}

// ----- Gacha wish: featured banner, 50/50, pity up to 90, x10 pulls -----
// Pictures: images/wish/<name>.jpg (lowercase, hyphens, no apostrophes)
var limited5 = ["Venti", "Zhongli", "Ei", "Nahida", "Furina", "Mavuika", "Columbina", "Citlali", "Ganyu", "Linnea", "Skirk", "Wanderer"];
var standard5 = ["Dehya", "Jean", "Mona", "Qiqi", "Tighnari", "Yumemizuki Mizuki"];
var fourChars = [["Alyosha", "✨"], ["Bennett", "🔥"], ["Chevreuse", "🔥"], ["Collei", "🌱"], ["Jahoda", "✨"], ["Kujou Sara", "⚡"], ["Ningguang", "💎"], ["Ororon", "⚡"]];
var fourWeapons = [["Dragon's Bane", "🔱"], ["Favonius Sword", "⚔️"], ["Rainslasher", "🗡️"], ["The Stringless", "🏹"], ["Wine and Song", "📖"]];
var threeWeapons = [["Fillet Blade", "⚔️"], ["Halberd", "🔱"], ["Recurve Bow", "🏹"], ["Sharpshooter's Oath", "🏹"], ["Skyrider Greatsword", "🗡️"], ["Twin Nephrite", "🔮"]];
var oneWeapons = [["Apprentice's Notes", "📖"], ["Beginner's Protector", "🔱"], ["Dull Blade", "⚔️"], ["Hunter's Bow", "🏹"], ["Waster Greatsword", "🗡️"]];

var G = { p5: 0, p4: 0, guar: false, total: 0, banner: 0, hist: [] };
try {
    var gSaved = JSON.parse(localStorage.getItem("gacha"));
    if (gSaved && gSaved.hist) { G = gSaved; }
} catch (err) {}

function slug(name) { return name.toLowerCase().replace(/'/g, "").replace(/ /g, "-"); }
function saveG() { try { localStorage.setItem("gacha", JSON.stringify(G)); } catch (err) {} }

var wishBtn = document.getElementById("wish-btn");
var pityBox = document.getElementById("pity");
var wishModal = document.getElementById("wish-modal");
var wishResult = document.getElementById("wish-result");

// banner switcher + x10 button + tools (built here so index.html stays the same)
wishBtn.textContent = "Wish ×1";
var bannerBox = document.createElement("div");
bannerBox.id = "banner-box";
bannerBox.innerHTML = '<button class="b-arrow" id="b-prev">◀</button><div id="b-card"><img id="b-img" alt=""><div><small>Featured 5★ (50/50)</small><strong id="b-name"></strong></div></div><button class="b-arrow" id="b-next">▶</button>';
wishBtn.parentNode.insertBefore(bannerBox, wishBtn);
var wish10 = document.createElement("button");
wish10.className = "btn";
wish10.id = "wish10-btn";
wish10.textContent = "Wish ×10";
wishBtn.insertAdjacentElement("afterend", wish10);
var tools = document.createElement("div");
tools.id = "wish-tools";
tools.innerHTML = '<button class="mini-btn" id="hist-btn">History</button><button class="mini-btn" id="reset-btn">Reset pity</button><div id="wish-history"></div>';
wishResult.insertAdjacentElement("afterend", tools);
var histBox = document.getElementById("wish-history");

function drawBanner() {
    var n = limited5[G.banner];
    document.getElementById("b-name").textContent = n;
    document.getElementById("b-img").src = "images/wish/" + slug(n) + ".jpg";
}
function showPity() {
    pityBox.textContent = "5★ pity: " + G.p5 + " / 90  ·  4★: " + G.p4 + " / 10" + (G.guar ? "  ·  Guaranteed featured!" : "");
}
function renderHist() {
    histBox.innerHTML = "";
    G.hist.forEach(function (h) {
        var chip = document.createElement("span");
        chip.className = "chip r" + h.s;
        chip.textContent = h.s + "★ " + h.n;
        histBox.appendChild(chip);
    });
}
document.getElementById("b-prev").onclick = function () { G.banner = (G.banner + limited5.length - 1) % limited5.length; saveG(); drawBanner(); };
document.getElementById("b-next").onclick = function () { G.banner = (G.banner + 1) % limited5.length; saveG(); drawBanner(); };
document.getElementById("hist-btn").onclick = function () { histBox.classList.toggle("open"); };
document.getElementById("reset-btn").onclick = function () {
    G = { p5: 0, p4: 0, guar: false, total: 0, banner: G.banner, hist: [] };
    saveG(); showPity(); renderHist();
    showToast("Pity reset!");
};
drawBanner(); showPity(); renderHist();

// one pull: real-style rates, soft pity from 74, hard pity 90, 50/50 with guarantee, 4-star every 10
function pullOne() {
    G.p5++; G.p4++; G.total++;
    var rate5 = G.p5 >= 90 ? 1 : G.p5 >= 74 ? 0.006 + (G.p5 - 73) * 0.06 : 0.006;
    var r, c;
    if (Math.random() < rate5) {
        var win = G.guar || Math.random() < 0.5;
        r = { star: 5, name: win ? limited5[G.banner] : pick(standard5), emoji: "✨", win: win };
        G.guar = !win; G.p5 = 0; G.p4 = 0;
    } else if (G.p4 >= 10 || Math.random() < 0.051) {
        G.p4 = 0;
        c = Math.random() < 0.5 ? pick(fourChars) : pick(fourWeapons);
        r = { star: 4, name: c[0], emoji: c[1], weapon: fourWeapons.indexOf(c) > -1 };
    } else if (Math.random() < 0.2) {
        c = pick(oneWeapons);
        r = { star: 1, name: c[0], emoji: c[1], weapon: true };
    } else {
        c = pick(threeWeapons);
        r = { star: 3, name: c[0], emoji: c[1], weapon: true };
    }
    r.art = ["images/wish/" + slug(r.name) + ".jpg"];
    if (r.star == 5) { r.art.push("images/" + slug(r.name) + ".jpg"); }
    G.hist.unshift({ s: r.star, n: r.name });
    G.hist = G.hist.slice(0, 30);
    return r;
}

function makeCard(r, mini) {
    var d = document.createElement("div");
    d.className = (mini ? "mini " : "wish-card ") + "r" + r.star;
    var art = document.createElement("div");
    art.className = "wish-art" + (r.weapon ? " weapon" : "");
    var img = document.createElement("img");
    var tried = 0;
    img.alt = r.name;
    img.onerror = function () {
        tried = tried + 1;
        if (tried < r.art.length) { img.src = r.art[tried]; return; }
        art.textContent = r.emoji || "✨";
        art.classList.add("ph");
    };
    img.src = r.art[0];
    art.appendChild(img);
    d.appendChild(art);
    var st = document.createElement("div");
    st.className = "wish-stars";
    st.textContent = "★".repeat(r.star);
    d.appendChild(st);
    var nm = document.createElement("div");
    nm.className = "wish-name";
    nm.textContent = r.name;
    d.appendChild(nm);
    return d;
}

function wishFx(star) {
    flash(star == 5 ? "rgba(255, 215, 0, 0.8)" : star == 4 ? "rgba(160, 100, 220, 0.5)" : star == 3 ? "rgba(80, 140, 255, 0.4)" : "rgba(150, 155, 165, 0.4)");
    if (star == 5) { emojiRain(["⭐", "✨", "🌟"], 60); } else if (star == 4) { emojiRain(["✨"], 15); }
}

var seq = null;
var seqTimer;

function showSingle(r) {
    clearTimeout(seqTimer);
    seq = null;
    wishModal.innerHTML = "";
    wishModal.appendChild(makeCard(r));
    wishModal.className = "show";
    wishFx(r.star);
}

function showTen(list) {
    clearTimeout(seqTimer);
    var best = Math.max.apply(null, list.map(function (r) { return r.star; }));
    seq = { list: list, i: 0 };
    wishModal.innerHTML = "";
    wishModal.className = "show";
    var m = document.createElement("div");
    m.className = "meteor";
    m.style.setProperty("--mc", best == 5 ? "#ffd54a" : best == 4 ? "#b58cf0" : "#7aa7ff");
    wishModal.appendChild(m);
    seqTimer = setTimeout(nextCard, 900);
}

function nextCard() {
    if (!seq) { return; }
    clearTimeout(seqTimer);
    if (seq.i >= seq.list.length) { showGrid(); return; }
    var r = seq.list[seq.i];
    seq.i = seq.i + 1;
    wishModal.innerHTML = "";
    wishModal.appendChild(makeCard(r));
    var skip = document.createElement("button");
    skip.className = "btn";
    skip.textContent = "Skip ▶▶";
    skip.onclick = function (event) { event.stopPropagation(); showGrid(); };
    wishModal.appendChild(skip);
    wishFx(r.star);
    seqTimer = setTimeout(nextCard, 1000);
}

function showGrid() {
    clearTimeout(seqTimer);
    var list = seq.list;
    seq = null;
    wishModal.innerHTML = "";
    var g = document.createElement("div");
    g.className = "wish-grid";
    list.forEach(function (r) { g.appendChild(makeCard(r, true)); });
    wishModal.appendChild(g);
    wishModal.className = "show";
}

wishModal.onclick = function () {
    if (seq) { nextCard(); return; }
    wishModal.className = "";
};

function doWish(n) {
    var list = [];
    for (var i = 0; i < n; i++) { list.push(pullOne()); }
    saveG(); showPity(); renderHist();
    var best = list[0];
    list.forEach(function (r) {
        if (r.star > best.star) { best = r; }
        if (r.star == 5) {
            showToast(r.win ? "You won the 50/50!" : "Lost the 50/50... your next 5★ is guaranteed featured!");
        }
    });
    wishResult.textContent = (n == 1 ? "" : "Best of 10: ") + best.star + " stars: " + best.name;
    if (n == 1) { showSingle(list[0]); } else { showTen(list); }
    foundEgg("wish");
}
wishBtn.onclick = function () { doWish(1); };
wish10.onclick = function () { doWish(10); };

// ----- Contact form: sent with Netlify Forms (goes to your email), then a bottle drops in -----
var form = document.getElementById("contact-form");
var formStatus = document.getElementById("form-status");
var messageList = document.getElementById("messages");

form.onsubmit = function (event) {
    event.preventDefault();
    var btn = document.getElementById("send-btn");
    btn.classList.add("sending");
    var data = new URLSearchParams(new FormData(form)).toString();

    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data })
        .then(function (res) {
            if (!res.ok) {
                throw new Error("failed");
            }
            var li = document.createElement("li");
            li.className = "bottle";
            li.textContent = "🍾 " + document.getElementById("cname").value + ": " + document.getElementById("cmsg").value;
            messageList.appendChild(li);
            form.reset();
            formStatus.textContent = "Message sent! It's on its way to my inbox.";
            formStatus.className = "ok";
            showToast("Message in a bottle sent!");
            say("Delivered! Paimon is a great messenger!");
            foundEgg("bottle");
        })
        .catch(function () {
            formStatus.textContent = "Could not send. This form only works on the live Netlify site.";
            formStatus.className = "bad";
            form.classList.add("shake-form");
            setTimeout(function () { form.classList.remove("shake-form"); }, 600);
        })
        .then(function () {
            btn.classList.remove("sending");
        });
};
