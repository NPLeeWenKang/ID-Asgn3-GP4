var database = firebase.database();

function loadUserData(snapshot) {
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

    $("#email").text(data.email)
    $("#edu-inst").text(data.edu)
    $("#grade").text(data.grade)
    $("#birthday").text(data.bDay)


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
    }, (error) => {
        const data = {
            username: "User Name"
        }
        loadUserData(data)
    })
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        database.ref("user/" + user.uid).once("value").then((snapshot) => {
            if (snapshot.exists()) {
                console.log("exists")
                loadUserData(snapshot.val())
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
        profilePic: findAvatarSrc(),
        username: $("#modal-username").val(),
        email: $("#modal-email").val(),
        edu: $("#modal-edu-inst").val(),
        grade: $("#modal-grade").val(),
        dDay: $("#modal-birthday").val(),
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