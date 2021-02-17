var database = firebase.database();
var userDetails;
var snapshotDetails;
function loadUserData(snapshot) {
    sessionStorage.setItem("user", JSON.stringify(snapshot))
    displayData()
    displayItems()
}
function displayItems() {
    var dataString = sessionStorage.getItem("user")
    var data = JSON.parse(dataString)
    if (data.items.badges != null) {
        const badgesDiv = document.getElementById("badges-div")
        data.items.badges.forEach(element => {
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

    if (data.items.collectibles != null) {
        const collectiblesDiv = document.getElementById("collectibles-div")
        data.items.collectibles.forEach(element => {
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
function displayData() {
    var dataString = sessionStorage.getItem("user")
    var data = JSON.parse(dataString)
    snapshotDetails = data
    $("#username").text(data.username)
    if (data.profilePic != null) {

        $("#profile-text").css("display", "none")
        $("#profile-pic").attr("src", data.profilePic)
        $("#profile-pic").css("display", "")
    }
    $("#email").text(userDetails.email)
    $("#edu-inst").text(data.edu)
    $("#grade").text(data.grade)
    $("#birthday").text(data.bDay)
    $("#coins").text(data.coins)

    $("#modal-username").val(data.username)
    const ava = document.querySelectorAll(".choose-ava")
    for (var i = 0; i < ava.length; i++) {
        if (ava[i].getAttribute("src") == data.profilePic) {
            ava[i].style.backgroundColor = "green"
            break;
        }
    }
    $("#modal-email").val(data.email)
    $("#modal-edu-inst").val(data.edu)
    $("#modal-grade").val(data.grade)
    $("#modal-birthday").val(data.bDay)
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
function noUserData(user) {
    database.ref("user/" + user.uid).set({
        username: "User Name",
        coins: 50,
        uid: user.uid
    }, (error) => {
        const data = {
            username: "User Name",
            coins: 100,
            uid: user.uid
        }
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
                snapshot
                loadUserData(snapshot.val())
            } else {
                console.log("null")
                noUserData(user)
            }
        })
    } else {
        window.location = "login.html"
    }
});
$("#update").on("click", function () {
    console.log("ok")
    const snapshot = {
        coins: $("#coins").text(),
        uid: userDetails.uid,
        profilePic: findAvatarSrc(),
        username: $("#modal-username").val(),
        edu: $("#modal-edu-inst").val(),
        grade: $("#modal-grade").val(),
        bDay: $("#modal-birthday").val(),
        items: snapshotDetails.items,
    }
    console.log(findAvatarSrc())
    console.log(snapshot)
    var user = firebase.auth().currentUser;
    database.ref("user/" + user.uid).set(snapshot)
    loadUserData(snapshot)
})
$(".choose-ava").on("click", function () {
    $(".choose-ava").css("background-color", "")
    $(this).css("background-color", "green")
})