const Message = document.getElementById("message");
const ButtonLoad = document.getElementById("loadBtn");

const ButtonBg = document.getElementById("changeBg");
const profile = document.getElementById("profile");
const grades = document.getElementById("grades");
const schedule = document.getElementById("schedule");

    function loadMesage(){
    return new Promise(function(resolve){
        setTimeout(function(){
            resolve("Reversal: Red...")
            Message.style.color = "red"
        },3000)
    })
}

ButtonLoad.addEventListener("click", function(){
    Message.innerHTML = "Loading..."
    loadMesage()
    .then(function(resolve){
        Message.innerHTML = resolve
        return new Promise(function(resolve){
            setTimeout(function(){
                resolve("Lapse: Blue...")
                Message.style.color = "Blue"
            }, 3000)
        })
    })

    .then(function(result){
        Message.innerHTML = result
        return new Promise(function(resolve){
            setTimeout(function(){
                resolve("Hollow Technique: Purple!")
                Message.style.color = "Purple"
            },3000)
        })
    })

    .then(function(result){
        Message.innerHTML = result
        return new Promise(function(resolve){
            setTimeout(function(){
                resolve("Just kidding XD")
                Message.style.color = "green"
            },3000)
        })
    })

    .then(function(result){
        Message.innerHTML = result
        return new Promise(function(resolve){
            setTimeout(function(){
                resolve("<3 ANSH")
                Message.style.color = "pink"
            },3000)
        })
    })

    .then(function(result){
        Message.innerHTML = result
  })
})

ButtonBg.addEventListener("click", function(){
    Message.innerHTML = "Loading Dashboard..."
    profile.innerHTML = "Profile: Waiting..."
    grades.innerHTML = "Grades: Waiting..."
    schedule.innerHTML = "Schedule: Waiting..."

    profile.style.color = "black"
    grades.style.color = "black"
    schedule.style.color = "black"
    Message.style.color = "black"

    const profilePromise = new Promise(function(resolve){
        setTimeout(function(){
            profile.innerHTML = "Profile: Loaded"
            profile.style.color = "turquoise"
            resolve()
        }, 1000)
    })

    const gradesPromise = new Promise(function(resolve){
        setTimeout(function(){
            grades.innerHTML = "Grades: Loaded"
            grades.style.color = "gray"
            resolve()
        }, 2000)
    })

    const schedulePromise = new Promise(function(resolve){
        setTimeout(function(){
            schedule.innerHTML = "Schedule: Loaded"
            schedule.style.color = "gold"
            resolve()
        }, 3000)
    })

    Promise.all([profilePromise, gradesPromise, schedulePromise])

    .then(function(){
        setTimeout(function(){
        Message.innerHTML = "Dashboard Ready!"
        Message.style.color = "lime"
        }, 2000);
    })
})

