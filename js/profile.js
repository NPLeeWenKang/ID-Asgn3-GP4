var database = firebase.database();
var userDetails;
function loadUserData(snapshot, user) {
    sessionStorage.setItem("user", JSON.stringify(snapshot))
    displayData()
}

function displayData() {
    var dataString = sessionStorage.getItem("user")
    var data = JSON.parse(dataString)
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
function noUserData(user, snapshot) {
    database.ref("user/" + user.uid).set({
        username: "User Name",
        coins: 50,
        uid: user.uid
    }, (error) => {
        const data = {
            username: "User Name",
            coins: 50,
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
                loadUserData(snapshot.val(), user)
            } else {
                console.log("null")
                noUserData(user, snapshot)
            }
        })
    } else {
        window.location = "login.html"
    }
});
$("#update").on("click", function () {
    console.log("ok")
    const snapshot = {
        uid: userDetails.uid,
        profilePic: findAvatarSrc(),
        username: $("#modal-username").val(),
        edu: $("#modal-edu-inst").val(),
        grade: $("#modal-grade").val(),
        bDay: $("#modal-birthday").val(),
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