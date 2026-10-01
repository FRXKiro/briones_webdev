// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Open and close the menu on phones
var menuBtn = document.getElementById("menu-btn");
var navLinks = document.getElementById("nav-links");

menuBtn.onclick = function () {
    navLinks.classList.toggle("show");
};

var links = document.querySelectorAll("#nav-links a");
for (var i = 0; i < links.length; i++) {
    links[i].onclick = function () {
        navLinks.classList.remove("show");
    };
}

// Highlight the nav link of the section you are viewing
var sections = document.querySelectorAll("header, section");

window.onscroll = function () {
    var current = "home";
    for (var i = 0; i < sections.length; i++) {
        if (window.scrollY >= sections[i].offsetTop - 120) {
            current = sections[i].id;
        }
    }
    for (var j = 0; j < links.length; j++) {
        links[j].classList.remove("active");
        if (links[j].getAttribute("href") == "#" + current) {
            links[j].classList.add("active");
        }
    }
};

// Hero slideshow: click a thumbnail to change the big picture
var heroImg = document.getElementById("hero-img");
var heroName = document.getElementById("hero-name");
var thumbs = document.querySelectorAll(".thumb");
var current = 0;
var timer;

function showSlide(n) {
    current = n;
    heroImg.style.opacity = 0;

    setTimeout(function () {
        heroImg.src = thumbs[n].src;
        heroName.textContent = thumbs[n].alt;
        heroImg.style.opacity = 1;
    }, 300);

    for (var i = 0; i < thumbs.length; i++) {
        thumbs[i].classList.remove("active");
    }
    thumbs[n].classList.add("active");
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(function () {
        showSlide((current + 1) % thumbs.length);
    }, 5000);
}

for (var k = 0; k < thumbs.length; k++) {
    thumbs[k].onclick = function () {
        showSlide(Array.prototype.indexOf.call(thumbs, this));
        startTimer();
    };
}

showSlide(0);
startTimer();

// Contact form: show the message on the page (no server needed)
var form = document.getElementById("contact-form");
var messages = document.getElementById("messages");

form.onsubmit = function (event) {
    event.preventDefault();
    var item = document.createElement("li");
    item.textContent = document.getElementById("cname").value + ": " + document.getElementById("cmsg").value;
    messages.appendChild(item);
    form.reset();
};

// ===== EASTER EGGS =====
var toast = document.getElementById("toast");
var toastTimer;
var eggsFound = {};
var eggTotal = 8;

function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}

// Count each egg only once
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
        showToast("All secrets found! You are a true Traveler!");
    }
}

// ----- effects used by the eggs -----
var overlay = document.getElementById("overlay");
var overlayImg = document.getElementById("overlay-img");
var flashBox = document.getElementById("flash");
var overlayTimer;

function flash(color) {
    flashBox.style.background = color;
    flashBox.classList.remove("go");
    void flashBox.offsetWidth;
    flashBox.classList.add("go");
}

function shake() {
    document.body.classList.add("shake");
    setTimeout(function () {
        document.body.classList.remove("shake");
    }, 700);
}

// Big picture popup (click it to close). The ?t= makes the GIF play again each time
function showPicture(src, look, ms) {
    overlayImg.src = src + "?t=" + Date.now();
    overlay.className = "show " + look;
    clearTimeout(overlayTimer);
    overlayTimer = setTimeout(closePicture, ms);
}

function closePicture() {
    overlay.className = "";
}
overlay.onclick = closePicture;

// Things falling from the top of the screen
function rain(n, make) {
    for (var i = 0; i < n; i++) {
        var p = make();
        p.classList.add("fall");
        p.style.left = Math.random() * 95 + "vw";
        p.style.animationDuration = (2 + Math.random() * 2.5) + "s";
        p.style.animationDelay = (Math.random() * 0.8) + "s";
        document.body.appendChild(p);
        (function (el) {
            setTimeout(function () { el.remove(); }, 5500);
        })(p);
    }
}

function emojiRain(chars, n) {
    rain(n, function () {
        var span = document.createElement("span");
        span.textContent = chars[Math.floor(Math.random() * chars.length)];
        return span;
    });
}

function paimonRain(n) {
    rain(n, function () {
        var img = document.createElement("img");
        img.src = "images/paimon.jpg";
        img.alt = "";
        return img;
    });
}

// 1. Link to the official Genshin website
document.getElementById("egg-link").onclick = function () {
    flash("rgba(120, 200, 255, 0.7)");
    emojiRain(["✨", "💠"], 30);
    showToast("Teleporting to Teyvat...");
    foundEgg("link");
};

// 2. Paimon is NOT emergency food: angry Paimon GIF + screen shake
document.getElementById("egg-paimon").onclick = function () {
    flash("rgba(255, 0, 0, 0.55)");
    shake();
    showPicture("images/paimon-angry-trigger.gif", "angry", 2800);
    showToast("Paimon is NOT emergency food!");
    foundEgg("paimon");
};

// 3. Citlali: angry at first, click 2 times and the whole site turns cheerful
var pictureClicks = 0;
var mood = "angry";
var aboutImg = document.getElementById("about-img");
var aboutSection = document.getElementById("about");

aboutImg.onclick = function () {
    pictureClicks = pictureClicks + 1;
    if (pictureClicks < 2) {
        shake();
        showToast(mood == "angry" ? "Citlali is NOT in the mood... click again!" : "Citlali is having fun... click again?");
        return;
    }
    pictureClicks = 0;
    var next = (mood == "angry") ? "happy" : "angry";
    flash("#fff");
    aboutImg.style.opacity = 0;

    setTimeout(function () {
        mood = next;
        aboutImg.className = next;
        if (next == "happy") {
            aboutImg.src = "images/citlali.jpg";
            aboutImg.alt = "Cheerful Citlali";
            aboutSection.classList.remove("angry");
            document.body.classList.add("cheerful");
        } else {
            aboutImg.src = "images/angry_citlali.jpg";
            aboutImg.alt = "Angry Citlali";
            aboutSection.classList.add("angry");
            document.body.classList.remove("cheerful");
        }
        aboutImg.style.opacity = 1;
    }, 350);

    if (next == "happy") {
        emojiRain(["🎉", "🌈", "🎈", "✨", "🌸"], 60);
        showToast("Citlali cheered up! The whole page is happy now!");
    } else {
        showToast("Citlali is angry again...");
    }
    foundEgg("mood");
};

// 4. Double click the logo
document.getElementById("logo").ondblclick = function () {
    flash("rgba(211, 188, 142, 0.7)");
    emojiRain(["✦", "💎"], 40);
    showToast("Welcome back, Traveler!");
    foundEgg("logo");
};

// 5. Type "paimon" anywhere, and 8. the Konami code
var typed = "";
var konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
var konamiPos = 0;

document.onkeydown = function (event) {
    var key = event.key.length == 1 ? event.key.toLowerCase() : event.key;

    if (key == konami[konamiPos]) {
        konamiPos = konamiPos + 1;
        if (konamiPos == konami.length) {
            konamiPos = 0;
            paimonRain(40);
            flash("rgba(255, 255, 255, 0.8)");
            showToast("Cheat code! Paimon invasion!");
            foundEgg("konami");
        }
    } else {
        konamiPos = (key == konami[0]) ? 1 : 0;
    }

    if (event.key.length == 1) {
        typed = (typed + key).slice(-6);
        if (typed == "paimon") {
            showPicture("images/paimon.jpg", "happy", 3200);
            emojiRain(["🎈", "🎉", "✨", "⭐"], 45);
            showToast("You called me? Paimon is here!");
            foundEgg("keyboard");
        }
    }
};

// 6. Element buttons: each has its own flash and rain, all 7 together start a resonance
var elementLines = {
    Anemo: "Anemo: the wind goes wherever it wants.",
    Geo: "Geo: stand strong like a mountain.",
    Electro: "Electro: lightning never waits.",
    Dendro: "Dendro: little seeds, big forests.",
    Hydro: "Hydro: calm water, deep secrets.",
    Pyro: "Pyro: let the fire burn bright!",
    Cryo: "Cryo: stay cool, Traveler."
};

var elementFx = {
    Anemo: ["#3fb6a8", "🍃"],
    Geo: ["#d99a3d", "💎"],
    Electro: ["#8e5fc7", "⚡"],
    Dendro: ["#6aa84f", "🌱"],
    Hydro: ["#3a7bd5", "💧"],
    Pyro: ["#e0603f", "🔥"],
    Cryo: ["#5bb8cc", "❄️"]
};

var elementsClicked = {};
var elButtons = document.querySelectorAll(".el");
for (var e = 0; e < elButtons.length; e++) {
    elButtons[e].onclick = function () {
        var name = this.textContent;
        showToast(elementLines[name]);
        flash(elementFx[name][0]);
        emojiRain([elementFx[name][1]], 25);
        elementsClicked[name] = true;

        if (Object.keys(elementsClicked).length == 7) {
            elementsClicked = {};
            document.body.classList.add("resonance");
            emojiRain(["🍃", "💎", "⚡", "🌱", "💧", "🔥", "❄️"], 70);
            showToast("Elemental Resonance! All 7 elements united!");
            setTimeout(function () {
                document.body.classList.remove("resonance");
            }, 3200);
            foundEgg("elements");
        }
    };
}

// 7. Make a Wish
var fiveStars = ["Venti", "Zhongli", "Ei", "Nahida", "Furina", "Mavuika", "Columbina"];
var fourStars = ["Bennett", "Xiangling", "Fischl", "Sucrose"];
var wishResult = document.getElementById("wish-result");

document.getElementById("wish-btn").onclick = function () {
    var roll = Math.random();
    wishResult.classList.remove("gold");

    if (roll < 0.1) {
        var five = fiveStars[Math.floor(Math.random() * fiveStars.length)];
        wishResult.textContent = "5 stars: " + five + "!!!";
        wishResult.classList.add("gold");
        flash("rgba(255, 215, 0, 0.8)");
        emojiRain(["⭐", "✨", "🌟"], 60);
    } else if (roll < 0.4) {
        var four = fourStars[Math.floor(Math.random() * fourStars.length)];
        wishResult.textContent = "4 stars: " + four;
        flash("rgba(160, 100, 220, 0.5)");
        emojiRain(["✨"], 15);
    } else {
        wishResult.textContent = "3 stars: Another Slingshot... try again!";
        flash("rgba(80, 140, 255, 0.4)");
    }
    foundEgg("wish");
};
