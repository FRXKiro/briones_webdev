console.log(document);

const pic = document.getElementById("pic");
const nameDisplay = document.getElementById("nameDisplay")
const nameBox = document.getElementById("nameBox")
const focusBox = document.getElementById("focusBox")
const yearSelect = document.getElementById("yearSelect")
const btnClick = document.getElementById("btnClick")
const btnDouble = document.getElementById("btnDouble")
const btnHold = document.getElementById("btnHold")
const status = document.getElementById("status")

const defaultName = "Mark Jefferson Briones"
let rotated = false

pic.addEventListener("click", function () {
    rotated = !rotated
    pic.style.transform = rotated ? "rotate(180deg)" : "rotate(0deg)"
    status.innerHTML = "The photo was rotated!"
})

nameBox.addEventListener("focus", function () {
    if (nameBox.value.trim()==="") {
        nameDisplay.innerHTML = defaultName
    }else{
        nameDisplay.innerHTML = nameBox.value
    }   
})

focusBox.addEventListener("focus", function () {
    focusBox.style.backgroundColor = "lightyellow"
    status.innerHTML = "The textbox is now focused."
})

focusBox.addEventListener("blur", function () {
    focusBox.style.backgroundColor = "white"
    status.innerHTML = "The textbox lost focus."
})

yearSelect.addEventListener("change", function () {
    status.innerHTML = "You selected: " + yearSelect.value
})



