$(".card").on("click", function () {
    $("#shop-item").attr("src", $(this).attr("id"))
    $("#shop-item").attr("data-cost", parseInt($(this).find("div.coin-div").text()))
})
$("#purchase-btn").on("click", function () {
    var dataString = sessionStorage.getItem("user")
    var data = JSON.parse(dataString)
    if (data.coins - $("#shop-item").attr("data-cost") >= 0) {
        data.coins -= $("#shop-item").attr("data-cost")
        if (data.items == null) {
            data.items = []
        }
        data.items.push($("#shop-item").attr("src"))
        sessionStorage.setItem("user", JSON.stringify(data))
        database.ref("user/" + data.uid).set(data)
    }

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
var database = firebase.database();