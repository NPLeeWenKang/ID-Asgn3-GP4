$(".card").on("click", function () {
    $("#shop-item").attr("src", $(this).attr("id"))
    $("#modal-name").text(`${$(this).find("h4").text()} (${parseInt($(this).find("div.coin-div").text())} coins)`)
    $("#shop-item").attr("data-cost", parseInt($(this).find("div.coin-div").text()))
    $("#shop-item").attr("data-type", this.className.replace("card ", ""))
})
$("#purchase-btn").on("click", function () {
    var dataString = sessionStorage.getItem("user")
    var data = JSON.parse(dataString)
    if (data.coins - $("#shop-item").attr("data-cost") >= 0) {
        data.coins -= $("#shop-item").attr("data-cost")
        if (data.items == null) {
            data.items = {}
        }
        if ($("#shop-item").attr("data-type") == "badges") {
            if (data.items.badges == null) {
                data.items.badges = []
            }
            data.items.badges.push($("#shop-item").attr("src"))
        } else {
            if (data.items.collectibles == null) {
                data.items.collectibles = []
            }
            data.items.collectibles.push($("#shop-item").attr("src"))
        }

        sessionStorage.setItem("user", JSON.stringify(data))
        database.ref("user/" + data.uid).set(data)
        removeItem()
        $("#success").css("display", "")
        setTimeout(function () {
            $("#success").css("display", "none")
        }, 3000)
    } else {
        $("#warning").css("display", "")
        setTimeout(function () {
            $("#warning").css("display", "none")
        }, 3000)
    }

})
function removeItem() {
    var dataString = sessionStorage.getItem("user")
    var data = JSON.parse(dataString)
    if (data.items.badges != null) {
        const badgeDiv = document.querySelectorAll(".badges")
        data.items.badges.forEach(badge => {
            badgeDiv.forEach(element => {
                if (element.firstElementChild.getAttribute("src") == badge) {
                    element.parentNode.removeChild(element)
                }
            })
        });
    }
    if (data.items.collectibles != null) {
        const collectibleDiv = document.querySelectorAll(".collectible")
        data.items.collectibles.forEach(collectible => {
            collectibleDiv.forEach(element => {
                console.log(element.firstElementChild.getAttribute("src"))
                console.log(collectible)
                console.log(element.firstElementChild.getAttribute("src") == collectible)
                if (element.firstElementChild.getAttribute("src") == collectible) {
                    element.parentNode.removeChild(element)
                }
            })
        });
    }
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
        console.log(sessionStorage.getItem("user"))
        if (sessionStorage.getItem("user") == null) {
            window.location = "profile.html"
        }
        removeItem()
    } else {
        window.location = "login.html"
    }
});

// Navigation Bar
if (window.innerWidth < 800) {
    // On first start up
    $("#hamburger").css("display", "")
    $("#nav-btn").css("display", "none")
} else {
    $("#hamburger").css("display", "none")
    $("#nav-btn").css("display", "")
}
window.addEventListener("resize", function (event) {
    // Only on screen size change
    if (window.innerWidth < 800) {
        // On first start up
        $("#hamburger").css("display", "")
        $("#nav-btn").css("display", "none")
    } else {
        $("#hamburger").css("display", "none")
        $("#nav-btn").css("display", "")
    }
})