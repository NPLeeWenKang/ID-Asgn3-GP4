var userDetails;
var snapshotUserDetails;

function loadQuizzes(state, key) {
    // Uses quiz data to display them
    const container = document.createElement("div");
    container.className = "container"
    container.id = key

    const add_img = document.createElement("div");
    add_img.className = "add-img"


    const add_button = document.createElement("button");
    add_button.className = "add-icon-btn"

    add_button.setAttribute("data-bs-toggle", "modal")
    add_button.setAttribute("data-bs-target", "#addQuizIzon")

    const image = document.createElement("img")
    image.src = state.img
    image.style.width = "100%"
    image.style.height = "100%"
    image.style.objectFit = "cover"
    image.style.objectPosition = "center"
    // Checks image data
    if (state.img == null) {
        image.style.display = "none"
    }

    const quizName = document.createElement("div")
    quizName.textContent = "+ Add Icon"
    // Checks image data
    if (state.img != null) {
        quizName.style.display = "none"
    }

    const text_container = document.createElement("div");
    text_container.className = "text-container"

    const span = document.createElement("span");

    const div = document.createElement("div")

    const h3 = document.createElement("h3")
    h3.textContent = state.name
    h3.style.display = "inline"

    const copyLink = document.createElement("div")
    copyLink.textContent = "Copy link"
    copyLink.className = "link-btn"

    const img = document.createElement("img")
    img.src = "src/link-45deg.svg"
    img.alt = "link-icon"


    const p = document.createElement("p");
    p.textContent = state.description
    const remove_button = document.createElement("button");
    remove_button.id = "remove-btn"
    remove_button.className = "remove-btn"
    remove_button.textContent = "x Remove"
    remove_button.setAttribute("data-bs-toggle", "modal")
    remove_button.setAttribute("data-bs-target", "#deleteQuizModal")

    copyLink.appendChild(img)

    div.appendChild(h3)
    div.appendChild(copyLink)

    text_container.appendChild(span)
    text_container.appendChild(div)
    text_container.appendChild(p)
    text_container.appendChild(remove_button)

    add_button.appendChild(image)
    add_button.appendChild(quizName)

    container.appendChild(add_img)
    container.appendChild(add_button)
    container.appendChild(text_container)
    quizBody.appendChild(container)
    $(".remove-btn").unbind("click")
    $(".remove-btn").on("click", function () {
        // When user clicks on delete button
        $("#confirm-delete").attr("data-quizId", $(this).parent().parent().attr("id"))
    })
    $(".link-btn").unbind("click")
    $(".link-btn").on("click", async function () {
        // When user clicks on copy link button, quiz link is placed in their clip board
        await navigator.clipboard.writeText(`https://npleewenkang.github.io/ID-Asgn3-GP4/take-quiz.html?key=${$(this).parent().parent().parent().attr("id")}`);
    })
    $(".add-icon-btn").unbind("click")
    $(".add-icon-btn").on("click", function () {
        // When user clicks add icon / change icon
        // Loads data into modal
        $("#update").attr("data-target", $(this).parent().attr("id"))
        $("#update").attr("data-target", $(this).parent().attr("id"))
        $("#remove").attr("data-target", $(this).parent().attr("id"))
        if ($(this).find("img").attr("src") != null) {
            const icon = document.querySelectorAll(".choose-icon")
            for (var i = 0; i < icon.length; i++) {
                if (icon[i].getAttribute("src") == $(this).find("img").attr("src")) {
                    icon[i].style.backgroundColor = "green"
                    break;
                }
            }
        }

    })
}
$(".choose-icon").on("click", function () {
    $(".choose-icon").css("background-color", "")
    $(this).css("background-color", "green")
})
function findIconSrc() {
    // Finds the chosen quiz icons
    const ava = document.querySelectorAll(".choose-icon")
    var src = null;
    for (var i = 0; i < ava.length; i++) {
        if (ava[i].style.backgroundColor == "green") {
            src = ava[i].getAttribute("src")
            break;
        }
    }
    return src
}
$("#update").on("click", function () {
    // When user clicks update user icon, loads database with new information
    var id = $(this).attr("data-target")
    var src = findIconSrc()
    $(`#${id}`).find("img").first().attr("src", src)
    $(`#${id}`).find("img").first().css("display", "")
    $(`#${id}`).find("button>div").css("display", "none")
    database.ref("quiz/" + id).update({ img: src })
    database.ref("pubQuiz/" + id).once("value").then(snapshot => {
        if (snapshot.exists()) {
            database.ref("pubQuiz/" + id).update({ img: src })
        }
    })

})
$("#remove").on("click", function () {
    // When user clicks remove btn, loads data into modal
    var id = $(this).attr("data-target")
    $(`#${id}`).find("img").first().attr("src", "")
    $(`#${id}`).find("img").first().css("display", "none")
    $(`#${id}`).find("button>div").css("display", "")
    database.ref("quiz/" + id).update({ img: null })
    database.ref("pubQuiz/" + id).update({ img: null })
})
$("#confirm-delete").on("click", function () {
    // When user clicks confirm delete, removed the quiz data from db
    var id = parseInt(this.getAttribute("data-quizId"))
    snapshotUserDetails.quizCreated.splice(snapshotUserDetails.quizCreated.indexOf(id), 1)
    database.ref("user/" + userDetails.uid).set(snapshotUserDetails)
    database.ref("quiz/" + id).remove()
    database.ref("pubQuiz/" + id).remove()
    $(`#${this.getAttribute("data-quizId")}`).remove() // Removes the card from the page
})
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
const database = firebase.database()
const quizBody = document.getElementById("my-quizzes")
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userDetails = user
        database.ref("user/" + user.uid).once("value").then((userSnapshot) => {
            if (userSnapshot.exists()) {
                // Initial user data is loaded
                snapshotUserDetails = userSnapshot.val()
                if (userSnapshot.val().quizCreated != null) {
                    // User has created quizzes
                    // Loads the quiz data
                    userSnapshot.val().quizCreated.forEach(element => {
                        database.ref("quiz/" + element).once("value").then((snapshot) => {
                            $("#my-quizzes").css("display", "")
                            $("#loading-icon").attr("style", "margin-top: 100px; display: none !important;")
                            if (snapshot.exists()) {
                                loadQuizzes(snapshot.val(), element)
                            } else {
                                // Data not in database
                                console.log("null")
                            }
                        })
                    });

                } else {
                    // User has not created any quizzes
                    $("#my-quizzes").css("display", "")
                    $("#loading-icon").attr("style", "margin-top: 100px; display: none !important;")
                }
            } else {
                // Initial user data is not loaded
                window.location = "profile.html"
            }

        })

    } else {
        // User is not logged in
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