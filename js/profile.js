var database = firebase.database();
var userDetails;
var snapshotUserDetails;

function displayItems() {
    if (snapshotUserDetails.items != null) {
        if (snapshotUserDetails.items.badges != null) {
            const badgesDiv = document.getElementById("badges-div")
            badgesDiv.textContent = ""
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
            const collectiblesDiv = document.getElementById("collectibles-div")
            collectiblesDiv.textContent = ""
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
    $("#username").text(snapshotUserDetails.username)
    if (snapshotUserDetails.profilePic != null) {

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
    displayData()
    displayItems()
}
function noUserData() {
    database.ref("user/" + userDetails.uid).set({
        username: "User Name",
        coins: 50,
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
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userDetails = user
        database.ref("user/" + user.uid).once("value").then((snapshot) => {
            $("#main-content").css("display", "")
            $("#loading-icon").attr("style", "margin-top: 100px; display: none !important;")
            if (snapshot.exists()) {
                console.log("exists")
                snapshotUserDetails = snapshot.val()
                loadUserData()
            } else {
                console.log("null")
                noUserData()
            }
        })
    } else {
        window.location = "login.html"
    }
});
$("#update").on("click", function () {
    console.log("ok")
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