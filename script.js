// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Count the activity cards and show the number in the About section
document.getElementById("count").textContent = document.querySelectorAll(".card").length;

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
var eggTotal = 7;

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
        showToast("All secrets found! You are a true Traveler!");
    }
}

// 1. Link to the official Genshin website
document.getElementById("egg-link").onclick = function () {
    foundEgg("link");
};

// 2. Paimon
document.getElementById("egg-paimon").onclick = function () {
    showToast("Paimon is NOT emergency food!");
    foundEgg("paimon");
};

// 3. Languages stat
document.getElementById("egg-lang").onclick = function () {
    showToast("3 languages here, but Teyvat has 7 nations!");
    foundEgg("languages");
};

// 4. Click the picture 5 times for a 5-star flash
var pictureClicks = 0;
var aboutImg = document.getElementById("about-img");

aboutImg.onclick = function () {
    pictureClicks = pictureClicks + 1;
    if (pictureClicks == 5) {
        pictureClicks = 0;
        aboutImg.classList.add("flash");
        setTimeout(function () {
            aboutImg.classList.remove("flash");
        }, 800);
        showToast("5-star! A golden light shines!");
        foundEgg("picture");
    }
};

// 5. Double click the logo
document.getElementById("logo").ondblclick = function () {
    showToast("Welcome back, Traveler!");
    foundEgg("logo");
};

// 6. Type "paimon" anywhere on the page
var typed = "";
document.onkeydown = function (event) {
    if (event.key.length == 1) {
        typed = (typed + event.key.toLowerCase()).slice(-6);
        if (typed == "paimon") {
            showToast("You called me? Paimon is here!");
            foundEgg("keyboard");
        }
    }
};

// Element buttons
var elementLines = {
    Anemo: "Anemo: the wind goes wherever it wants.",
    Geo: "Geo: stand strong like a mountain.",
    Electro: "Electro: lightning never waits.",
    Dendro: "Dendro: little seeds, big forests.",
    Hydro: "Hydro: calm water, deep secrets.",
    Pyro: "Pyro: let the fire burn bright!",
    Cryo: "Cryo: stay cool, Traveler."
};

var elButtons = document.querySelectorAll(".el");
for (var e = 0; e < elButtons.length; e++) {
    elButtons[e].onclick = function () {
        showToast(elementLines[this.textContent]);
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
    } else if (roll < 0.4) {
        var four = fourStars[Math.floor(Math.random() * fourStars.length)];
        wishResult.textContent = "4 stars: " + four;
    } else {
        wishResult.textContent = "3 stars: Another Slingshot... try again!";
    }
    foundEgg("wish");
};
