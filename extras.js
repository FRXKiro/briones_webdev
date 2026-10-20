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

// ----- Gacha wish -----
// Pictures live in images/wish/<name>.jpg (spaces become hyphens). 5-star heroes without one fall back to images/<name>.jpg
var fiveStars = ["Venti", "Zhongli", "Ei", "Nahida", "Furina", "Mavuika", "Columbina", "Citlali", "Ganyu", "Linnea", "Skirk", "Wanderer"];
var fourStars = [["Alyosha", "✨"], ["Bennett", "🔥"], ["Chevreuse", "🔥"], ["Collei", "🌱"], ["Jahoda", "✨"], ["Kujou Sara", "⚡"], ["Ningguang", "💎"], ["Ororon", "⚡"]];
var threeStars = [["Twin Nephrite", "🔮"], ["Recurve Bow", "🏹"], ["Fillet Blade", "⚔️"], ["Halberd", "🔱"], ["Skyrider Greatsword", "🗡️"]];
var pity = 0;
try { pity = parseInt(localStorage.getItem("pity")) || 0; } catch (err) { pity = 0; }
var pityBox = document.getElementById("pity");
var wishModal = document.getElementById("wish-modal");

function slug(name) {
    return name.toLowerCase().replace(/ /g, "-");
}

function showPity() {
    pityBox.textContent = "Pity: " + pity + " / 20";
}
showPity();

function openWish(star, name, emoji, arts) {
    var rar = star == 5 ? "r5" : star == 4 ? "r4" : "r3";
    wishModal.innerHTML = '<div class="wish-card ' + rar + '"><div class="wish-art"></div><div class="wish-stars">' + "★".repeat(star) + '</div><div class="wish-name">' + name + '</div><small>click to close</small></div>';
    var box = wishModal.querySelector(".wish-art");
    if (star == 3) {
        box.classList.add("weapon");
    }
    var img = document.createElement("img");
    var tried = 0;
    img.alt = name;
    img.onerror = function () {
        tried = tried + 1;
        if (tried < arts.length) {
            img.src = arts[tried];
            return;
        }
        box.textContent = emoji || "✨";
        box.classList.add("ph");
    };
    img.src = arts[0];
    box.appendChild(img);
    wishModal.className = "show";
    flash(star == 5 ? "rgba(255, 215, 0, 0.8)" : star == 4 ? "rgba(160, 100, 220, 0.5)" : "rgba(80, 140, 255, 0.4)");
    if (star == 5) {
        emojiRain(["⭐", "✨", "🌟"], 60);
    } else if (star == 4) {
        emojiRain(["✨"], 15);
    }
    document.getElementById("wish-result").textContent = star + " stars: " + name;
}
wishModal.onclick = function () { wishModal.className = ""; };

document.getElementById("wish-btn").onclick = function () {
    pity = pity + 1;
    var star = 3, name, emoji, arts, p;
    if (pity >= 20 || Math.random() < (pity >= 12 ? 0.4 : 0.06)) {
        star = 5;
        pity = 0;
        name = pick(fiveStars);
        arts = ["images/wish/" + slug(name) + ".jpg", "images/" + slug(name) + ".jpg"];
    } else if (Math.random() < 0.25) {
        star = 4;
        p = pick(fourStars);
        name = p[0]; emoji = p[1];
        arts = ["images/wish/" + slug(name) + ".jpg"];
    } else {
        p = pick(threeStars);
        name = p[0]; emoji = p[1];
        arts = ["images/wish/" + slug(name) + ".jpg"];
    }
    try { localStorage.setItem("pity", pity); } catch (err) {}
    showPity();
    openWish(star, name, emoji, arts);
    foundEgg("wish");
};

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
