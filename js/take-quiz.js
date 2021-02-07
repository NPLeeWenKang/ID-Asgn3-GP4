var time = 5
var tf = true
$("audio").prop("volume", 0.6);

const timer = setInterval(() => {
    $(".time").text(time)
    time -= 1;
    if (time < 0) {
        clearInterval(timer)
    }
}, 1000);
$("#start").on("click", function () {
    $("#start-div").css("display", "none")
    $("#start").css("display", "none")
    $("#start").unbind("click")
    $("#quiz").css("display", "")
    $("audio").trigger("play");
})
$("#mute").on("click", function () {
    $("audio").trigger("play")
    $("#mute").css("display", "none")
    $("#unmute").css("display", "inline")
})
$("#unmute").on("click", function () {
    $("audio").trigger("pause")
    $("#mute").css("display", "inline")
    $("#unmute").css("display", "none")
})
function calEstimatedTime(quizQuestion) {
    var estTime = 0;
    for (const [key, value] of Object.entries(quizQuestion)) {
        estTime += value.timeNeeded
    }
    return estTime
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

const queryString = window.location.search;
const key = new URLSearchParams(queryString).get("key")
database.ref("/quiz/" + key).once("value").then((snapshot) => {
    var state = snapshot.val() || 'Anonymous';
    console.log($(".question-div").first())
    $(".question-div").first().text(state.name)
    $("#made-by").text(`Made By: ${state.ownerName}`)
    $("#est-time").text(`Estimated quiz duration: ${calEstimatedTime(state.quizQuestion)}s`)
})