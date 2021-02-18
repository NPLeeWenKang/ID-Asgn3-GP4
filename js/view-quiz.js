$("#link").on("keypress", function (event) {
    if (event.key == "Enter") {
        const urlLocation = $("#link").val()
        const key = new URLSearchParams(urlLocation).get("key")
        database.ref("/quiz/" + key).once("value").then((snapshot) => {
            if (snapshot.exists()) {
                window.location = urlLocation
            } else {
                $("#warning").css("display", "")
                setTimeout(function () {
                    $("#warning").css("display", "none")
                }, 3000)
            }
        })

    }
})
$("#link-btn").on("click", function () {

    const urlLocation = $("#link").val()
    const key = new URLSearchParams(urlLocation).get("key")
    database.ref("/quiz/" + key).once("value").then((snapshot) => {
        if (snapshot.exists()) {
            window.location = urlLocation
        } else {
            $("#warning").css("display", "")
            setTimeout(function () {
                $("#warning").css("display", "none")
            }, 3000)
        }
    })


})



$("#take-quiz").on("click", function () {
    window.location = `https://npleewenkang.github.io/ID-Asgn3-GP4/take-quiz.html?key=${$(this).attr("data-target")}`
})
function createQuizBox(key, value, quiz_area) {
    console.log(value)
    const card = document.createElement("div")
    card.id = key
    card.className = "card"
    card.setAttribute("data-bs-toggle", "modal")
    card.setAttribute("data-bs-target", "#exampleModal")
    const img = document.createElement("img")
    img.className = "quiz-img"
    img.src = value.img
    const text_div = document.createElement("div")
    text_div.className = "text-div"
    const h3 = document.createElement("h3")
    h3.innerHTML = value.name
    const p = document.createElement("p")
    p.style.display = "none"
    if (value.description == null) {
        p.innerHTML = ""
    } else {
        p.innerHTML = value.description
    }

    text_div.appendChild(h3)
    text_div.appendChild(p)
    card.appendChild(img)
    card.appendChild(text_div)
    quiz_area.appendChild(card)
    $(".card").unbind("click")
    $(".card").on("click", function () {
        $("#quiz-title").text($(this).find("h3").text())
        $("#quiz-description").text($(this).find("p").text())
        $("#quiz-img").attr("src", $(this).find("img").attr("src"))
        $("#take-quiz").attr("data-target", $(this).attr("id"))
    })
}
var firebaseConfig = {
    apiKey: "AIzaSyAvLIsQrahzjTlAAElrm85Mu_S8Rh6a_KY",
    authDomain: "id-assign3.firebaseapp.com",
    projectId: "id-assign3",
    storageBucket: "id-assign3.appspot.com",
    messagingSenderId: "193413395450",
    appId: "1:193413395450:web:df43638dcdb414967aea43"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

const queryString = window.location.search;
const key = new URLSearchParams(queryString).get("key")
database.ref("/pubQuiz/").once("value").then((snapshot) => {
    var state = snapshot.val() || 'Anonymous';
    const quiz_area = document.getElementById("quiz-area")
    for (const [key, value] of Object.entries(state)) {
        createQuizBox(key, value, quiz_area)
    }
    $("#quiz-area").css("display", "")
    $("#loading-icon, #loading-icon>lottie-player, #loading-icon>h5").css("display", "none")


})





firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
    } else {
        window.location = "login.html"
    }
});



// Navigation Bar
if (window.innerWidth < 800) {
    // On first start up
    $("#hamburger").css("display", "")
    $("#navbarSupportedContent").css("display", "")
    $("#nav-btn").css("display", "none")
} else {
    $("#hamburger").css("display", "none")
    $("#navbarSupportedContent").css("display", "none")
    $("#nav-btn").css("display", "")
}
window.addEventListener("resize", function (event) {
    // Only on screen size change
    if (window.innerWidth < 800) {
        // On first start up
        $("#hamburger").css("display", "")
        $("#navbarSupportedContent").css("display", "")
        $("#nav-btn").css("display", "none")
    } else {
        $("#hamburger").css("display", "none")
        $("#navbarSupportedContent").css("display", "none")
        $("#nav-btn").css("display", "")
    }
})