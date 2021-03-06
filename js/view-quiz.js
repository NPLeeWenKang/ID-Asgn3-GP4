$("#link").on("keypress", function (event) {
    if (event.key == "Enter") {
        // When user clicks "enter" on keyboard
        // Finds the "key" and verifies it.
        const urlLocation = $("#link").val().split("?")[1]
        const key = new URLSearchParams(urlLocation).get("key")
        database.ref("/quiz/" + key).once("value").then((snapshot) => {
            if (snapshot.exists()) {
                // Key is valid
                window.location = `take-quiz.html?key=${key}`
            } else {
                // Key is not valid
                $("#warning").css("display", "")
                setTimeout(function () {
                    $("#warning").css("display", "none")
                }, 3000)
            }
        })

    }
})
$("#link-btn").on("click", function () {
    // When user clicks search icon
    // Finds the "key" and verifies it.
    const urlLocation = $("#link").val().split("?")[1]
    const key = new URLSearchParams(urlLocation).get("key")
    database.ref("/quiz/" + key).once("value").then((snapshot) => {
        if (snapshot.exists()) {
            // Key is valid
            window.location = `take-quiz.html?key=${key}`
        } else {
            $("#warning").css("display", "")
            setTimeout(function () {
                // Key is not valid
                $("#warning").css("display", "none")
            }, 3000)
        }
    })


})

$("#take-quiz").on("click", function () {
    // When clicking "take quiz" in modal
    window.location = `https://npleewenkang.github.io/ID-Asgn3-GP4/take-quiz.html?key=${$(this).attr("data-target")}`
})

function createQuizBox(key, value, quiz_area) {
    // Uses user created quiz data to display them
    // Only displays public quizzes
    const card = document.createElement("div")
    card.id = key
    card.className = "card"
    card.setAttribute("data-bs-toggle", "modal")
    card.setAttribute("data-bs-target", "#exampleModal")
    const img = document.createElement("img")
    img.className = "quiz-img"
    img.alt = "image of quiz category"
    // Checks if image has been assigned to quiz
    if (value.img != null) {
        img.src = value.img
    } else {
        img.src = "src/Category-Images/No-Category.jpg"
    }
    const text_div = document.createElement("div")
    text_div.className = "text-div"
    const h3 = document.createElement("h3")
    h3.innerHTML = value.name
    const p = document.createElement("p")
    p.style.display = "none"
    // Checks if description has been added to quiz
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

$(".card").on("click", function () {
    // When clicking of quiz card, load data into modal
    $("#quiz-title").text($(this).find("h3").text())
    $("#quiz-description").text($(this).find("p").text())
    $("#quiz-img").attr("src", $(this).find("img").attr("src"))
    $("#take-quiz").attr("data-target", $(this).attr("id"))
})

// Get data from database
database.ref("/pubQuiz/").once("value").then((snapshot) => {
    $("#quiz-area").css("display", "")
    $("#loading-icon, #loading-icon>lottie-player, #loading-icon>h5").css("display", "none")
    if (snapshot.exists()) {
        // Public quiz data 
        var state = snapshot.val();
        const quiz_area = document.getElementById("quiz-area")
        for (const [key, value] of Object.entries(state)) {
            createQuizBox(key, value, quiz_area)
        }

    }

})

// Checks if user is logged in
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // Logged in
    } else {
        // Not logged in
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