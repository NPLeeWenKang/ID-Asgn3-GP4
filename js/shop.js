var snapshotUserDetails;
$(".card").on("click", function () {
    // When item card is clicked, load data into modal
    $("#shop-item").attr("src", $(this).attr("id"))
    $("#modal-name").text(`${$(this).find("h4").text()} (${parseInt($(this).find("div.coin-div").text())} coins)`)
    $("#shop-item").attr("data-cost", parseInt($(this).find("div.coin-div").text()))
    $("#shop-item").attr("data-type", this.className.replace("card ", ""))
})
$("#purchase-btn").on("click", function () {
    // When user clicks confirm purchase
    // Checks if user has enough money
    if (snapshotUserDetails.coins - $("#shop-item").attr("data-cost") >= 0) {
        // Has enough money
        snapshotUserDetails.coins -= $("#shop-item").attr("data-cost")
        $("#user-coins").text(`${snapshotUserDetails.coins} Coins`)
        if (snapshotUserDetails.items == null) {
            snapshotUserDetails.items = {}
        }
        if ($("#shop-item").attr("data-type") == "badges") {
            if (snapshotUserDetails.items.badges == null) {
                snapshotUserDetails.items.badges = []
            }
            snapshotUserDetails.items.badges.push($("#shop-item").attr("src"))
        } else {
            if (snapshotUserDetails.items.collectibles == null) {
                snapshotUserDetails.items.collectibles = []
            }
            snapshotUserDetails.items.collectibles.push($("#shop-item").attr("src"))
        }
        // Updates data with new item data
        database.ref("user/" + snapshotUserDetails.uid).set(snapshotUserDetails)
        removeItem() // Removes items from shop UI
        $("#success").css("display", "")
        setTimeout(function () {
            $("#success").css("display", "none")
        }, 3000)
    } else {
        // Has not enough money
        $("#warning").css("display", "")
        setTimeout(function () {
            $("#warning").css("display", "none")
        }, 3000)
    }

})
function removeItem() {
    // Removes items from shop IU
    if (snapshotUserDetails.items != null) {
        if (snapshotUserDetails.items.badges != null) {
            const badgeDiv = document.querySelectorAll(".badges")
            snapshotUserDetails.items.badges.forEach(badge => {
                badgeDiv.forEach(element => {
                    if (element.firstElementChild.getAttribute("src") == badge) {
                        element.parentNode.removeChild(element)
                    }
                })
            });
        }
        if (snapshotUserDetails.items.collectibles != null) {
            const collectibleDiv = document.querySelectorAll(".collectible")
            snapshotUserDetails.items.collectibles.forEach(collectible => {
                collectibleDiv.forEach(element => {
                    if (element.firstElementChild.getAttribute("src") == collectible) {
                        element.parentNode.removeChild(element)
                    }
                })
            });
        }
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
        // User logged in
        database.ref("user/" + user.uid).once("value").then((userSnapshot) => {
            $(".scroll-wrapper>div").css("display", "")
            $("#loading-icon").attr("style", "margin-top: 100px; display: none !important;")
            if (userSnapshot.exists()) {
                // If initial user data is present
                snapshotUserDetails = userSnapshot.val()
                $("#user-coins").text(`${snapshotUserDetails.coins} Coins`)
                removeItem()
            } else {
                // If initial user data is not present
                window.location = "profile.html"
            }
        })

    } else {
        // User not logged in
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