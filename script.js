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
