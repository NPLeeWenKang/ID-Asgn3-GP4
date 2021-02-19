

var userDetails;
var snapshotUserDetails;

function displayItems() {
    // Display items in user inventory
    if (snapshotUserDetails.items != null) {
        if (snapshotUserDetails.items.badges != null) {
            // Displays badges
            const badgesDiv = document.getElementById("badges-div")
            badgesDiv.textContent = ""
            // Loads and appends each item
            snapshotUserDetails.items.badges.forEach(element => {
                const div = document.createElement("div")
                div.id = "img"
                div.className = "item"

                const img = document.createElement("img")
                img.src = element
                img.alt = "item-img"
                img.className = "item-img"

                const h5 = document.createElement("h5")
                h5.className = "item-name"
                h5.textContent = element.replace(".png", "").replace("src/Collectibles-img/", "")

                div.appendChild(img)
                div.appendChild(h5)
                badgesDiv.appendChild(div)
            });
        }

        if (snapshotUserDetails.items.collectibles != null) {
            // Displays collectibles
            const collectiblesDiv = document.getElementById("collectibles-div")
            collectiblesDiv.textContent = ""
            // Loads and appends each item
            snapshotUserDetails.items.collectibles.forEach(element => {
                const div = document.createElement("div")
                div.id = "img"
                div.className = "item"

                const img = document.createElement("img")
                img.src = element
                img.alt = "item-img"
                img.className = "item-img"

                const h5 = document.createElement("h5")
                h5.className = "item-name"
                h5.textContent = element.replace(".png", "").replace("src/Collectibles-img/", "")

                div.appendChild(img)
                div.appendChild(h5)
                collectiblesDiv.appendChild(div)
            });
        }
    }

}
function displayData() {
    // Display user data onto page
    $("#username").text(snapshotUserDetails.username)
    if (snapshotUserDetails.profilePic != null) {
        // Checks if user has a profile pic
        $("#profile-text").css("display", "none")
        $("#profile-pic").attr("src", snapshotUserDetails.profilePic)
        $("#profile-pic").css("display", "")
    }
    $("#email").text(userDetails.email)
    $("#edu-inst").text(snapshotUserDetails.edu)
    $("#grade").text(snapshotUserDetails.grade)
    $("#birthday").text(snapshotUserDetails.bDay)
    $("#coins").text(snapshotUserDetails.coins)

    $("#modal-username").val(snapshotUserDetails.username)
    const ava = document.querySelectorAll(".choose-ava")
    for (var i = 0; i < ava.length; i++) {
        // Sets the user's profile pic into the modal
        if (ava[i].getAttribute("src") == snapshotUserDetails.profilePic) {
            ava[i].style.backgroundColor = "green"
            break;
        }
    }
    $("#modal-email").val(snapshotUserDetails.email)
    $("#modal-edu-inst").val(snapshotUserDetails.edu)
    $("#modal-grade").val(snapshotUserDetails.grade)
    $("#modal-birthday").val(snapshotUserDetails.bDay)
}
function findAvatarSrc() {
    // Finds the chosen profile picture if the user click "update"
    const ava = document.querySelectorAll(".choose-ava")
    var src = null;
    for (var i = 0; i < ava.length; i++) {
        if (ava[i].style.backgroundColor == "green") {
            src = ava[i].getAttribute("src")
            break;
        }
    }
    return src
}
function loadUserData() {
    // Loads user data
    displayData()
    displayItems()
}
function noUserData() {
    // If user has no initial data.
    // Function will place default data into user
    database.ref("user/" + userDetails.uid).set({
        username: "User Name",
        coins: 100,
        uid: userDetails.uid
    }, (error) => {
        const data = {
            username: "User Name",
            coins: 100,
            uid: userDetails.uid
        }
        snapshotUserDetails = data
        loadUserData(data)
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
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is logged in
        userDetails = user
        database.ref("user/" + user.uid).once("value").then((snapshot) => {
            // Getting user data
            $("#main-content").css("display", "")
            $("#loading-icon").attr("style", "margin-top: 100px; display: none !important;")
            if (snapshot.exists()) {
                // Initial data exists
                snapshotUserDetails = snapshot.val()
                loadUserData()
            } else {
                // No initial data exists
                noUserData()
            }
        })
    } else {
        // If user not logged in
        window.location = "login.html"
    }
});
$("#update").on("click", function () {
    // When "update" button is clicked
    // Updates database
    const newSnapshot = {
        ...snapshotUserDetails,
        profilePic: findAvatarSrc(),
        username: $("#modal-username").val(),
        edu: $("#modal-edu-inst").val(),
        grade: $("#modal-grade").val(),
        bDay: $("#modal-birthday").val(),
    }
    snapshotUserDetails = newSnapshot
    var user = firebase.auth().currentUser;
    database.ref("user/" + user.uid).set(newSnapshot)
    loadUserData()
})
$(".choose-ava").on("click", function () {
    $(".choose-ava").css("background-color", "")
    $(this).css("background-color", "green")
})


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