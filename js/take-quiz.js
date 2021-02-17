var tf = true
var questionNo = 0;
var playerCoins = 0;
var playerScore = 0;
$("audio").prop("volume", 0.6);


$("#start").on("click", function () {
    $("#start-div").css("display", "none")
    $("#start").css("display", "none")
    $("#start").unbind("click")
    $("#quiz").css("display", "")
    $("audio").trigger("play");
    $("#total-score").text(questions.length)
    loadQuestion(questions[questionNo])
})
$("#mute").on("click", function () {
    $("audio").prop("muted", false);
    $("#mute").css("display", "none")
    $("#unmute").css("display", "inline")
    localStorage.setItem("mute", "false")
})
$("#unmute").on("click", function () {
    $("audio").prop("muted", true);
    $("#mute").css("display", "inline")
    $("#unmute").css("display", "none")
    localStorage.setItem("mute", "true")
})
function loadEnd() {
    $("#quiz").css("display", "none")
    $("#end").css("display", "")
    $("#final-score").text(`${playerScore}/${questionNo}`)
    $("#coins-earned").text(playerCoins)
    var dataString = sessionStorage.getItem("user")
    var data = JSON.parse(dataString)
    data.coins = parseInt(data.coins) + playerCoins
    database.ref("user/" + data.uid).update({ coins: data.coins })
    sessionStorage.setItem("user", data)

}
function calEstimatedTime(quizQuestion) {
    var estTime = 0;
    for (const [key, value] of Object.entries(quizQuestion)) {
        estTime += value.timeNeeded
    }
    return estTime
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function findMute() {
    const tf = localStorage.getItem("mute") === 'true'
    if (tf) {
        $("audio").prop("muted", true);
        $("#mute").css("display", "inline")
        $("#unmute").css("display", "none")
    } else {
        $("audio").prop("muted", false);
        $("#mute").css("display", "none")
        $("#unmute").css("display", "inline")
    }
}
function loadQuestion(question) {
    if (question == null) {
        loadEnd()
        return
    }
    $(`.answer1>div`).text("")
    $(`.answer2>div`).text("")
    $(`.answer3>div`).text("")
    $(`.answer4>div`).text("")
    $(`.answer1`).css("background-color", "")
    $(`.answer1`).parent().parent().css("background-color", "")
    $(`.answer2`).css("background-color", "")
    $(`.answer2`).parent().parent().css("background-color", "")
    $(`.answer3`).css("background-color", "")
    $(`.answer3`).parent().parent().css("background-color", "")
    $(`.answer4`).css("background-color", "")
    $(`.answer4`).parent().parent().css("background-color", "")
    $(".time").css("background-color", "#1ecbe1")

    $("audio").trigger("play")
    var ans = 0
    var div;
    questionNo += 1
    $(".innerDiv").unbind("click")
    $(".innerDiv").on("click", function () {
        $(".quizInput").css("background-color", "")
        $(".quizInput").parent().parent().css("background-color", "")
        $(this).css("background-color", "#aaff00")
        $(this).parent().parent().css("background-color", "#aaff00")
        ans = $(this).find("div.quizInput>div").text()
        div = this
    })
    $("#done").unbind("click")
    $("#done").on("click", function () {
        if (!timer) {
            loadQuestion(questions[questionNo])
        } else {
            clearInterval(timer)
            timer = false
            markQuestion(ans, div, question)
        }

    })
    var arr = [question.correctAns]
    question.wrongAns.forEach(element => {
        if (element != "") {
            arr.push(element)
        }

    })
    shuffleArray(arr)
    $(".question-div").text(question.question)
    arr.forEach((element) => {
        $(`.answer${arr.indexOf(element) + 1}>div`).text(element)
    })
    $(".time").text(question.timeNeeded)
    var time = question.timeNeeded
    var timer = setInterval(() => {
        time -= 1;
        $(".time").text(time)

        if (time <= 0) {
            clearInterval(timer)
            markQuestion(ans, div, question)
        }
    }, 1000);
}
function markQuestion(ans, div, question) {
    if (ans == question.correctAns) {
        playerCoins += question.points / 100
        $("#player-coins").text(playerCoins)
        playerScore += 1
        $("#player-score").text(playerScore)
        var audio = new Audio('../src/correct-effect.wav');
        audio.play();
    } else {
        var audio = new Audio('../src/wrong-effect.wav');
        $(div).css("background-color", "#ec6b83")
        audio.play();
    }


    $("audio").trigger("pause")
    $(".time").css("background-color", "#676767")
    if ($(`.answer1>div`).text() == question.correctAns) {
        $(`.answer1`).css("background-color", "#1ae56e")
        $(`.answer1`).parent().parent().css("background-color", "#1ae56e")
    }
    if ($(`.answer2>div`).text() == question.correctAns) {
        $(`.answer2`).css("background-color", "#1ae56e")
        $(`.answer2`).parent().parent().css("background-color", "#1ae56e")
    }
    if ($(`.answer3>div`).text() == question.correctAns) {
        $(`.answer3`).css("background-color", "#1ae56e")
        $(`.answer3`).parent().parent().css("background-color", "#1ae56e")
    }
    if ($(`.answer4>div`).text() == question.correctAns) {
        $(`.answer4`).css("background-color", "#1ae56e")
        $(`.answer4`).parent().parent().css("background-color", "#1ae56e")
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
findMute()
const queryString = window.location.search;
const key = new URLSearchParams(queryString).get("key")
var questions = {}
database.ref("/quiz/" + key).once("value").then((snapshot) => {
    if (snapshot.exists()) {
        $("#loading").attr("style", "z-index: 100; width: 100%; height: 90%; display: none !important")
        $("#start-container").css("display", "")
        var state = snapshot.val() || 'Anonymous';
        $(".question-div").first().text(state.name)
        $(".end-title").text(state.name)
        $("#made-by").text(`Made By: ${state.ownerName}`)
        $("#est-time").text(`Estimated quiz duration: ${calEstimatedTime(state.quizQuestion)}s`)
        $("#start").css("background-color", "#43bc4f")
        $("#start").css("border-bottom", "6px solid #006717")
        $("#start").hover(function () {
            if ($("#start").css("background-color") == "rgb(67, 188, 79)") {
                $("#start").css("background-color", "#00881e")
                $("#start").css("border-top", "2px solid #00881e")
                $("#start").css("border-bottom", "4px solid  #003a0d")
            } else {
                $("#start").css("background-color", "#43bc4f")
                $("#start").css("border-bottom", "6px solid #006717")
                $("#start").css("border-top", "none")
            }

        })
        questions = state.quizQuestion
    } else {
        $("#loading").attr("style", "z-index: 100; width: 100%; height: 90%; display: none !important")
        $("#start-container").css("display", "")
        $(".question-div").first().text("Invalid quiz link")
    }

})

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        if (sessionStorage.getItem("user") == null) {
            window.location = "profile.html"
        }
    } else {
        window.location = "login.html"
    }
});