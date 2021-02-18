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
    console.log(questions.length)
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
$(window).focus(function () {
    $("audio").trigger("play")
})
$(window).blur(function () {
    $("audio").trigger("pause")
})
function loadEnd() {
    $("audio").trigger("pause")
    $("#quiz").css("display", "none")
    $("#end").css("display", "")
    $("#final-score").text(`${playerScore}/${questionNo}`)
    $("#coins-earned").text(playerCoins)
    snapshotUserDetails.coins = parseInt(snapshotUserDetails.coins) + playerCoins
    database.ref("user/" + snapshotUserDetails.uid).update({ coins: snapshotUserDetails.coins })

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
        $("#done>div").text("Next")
        clearInterval(timer)
        timer = false
        markQuestion(ans, div, question)
    })
    $("#done").unbind("click")
    $("#done").on("click", function () {
        if (!timer) {
            $("#done>div").text("Skip")
            loadQuestion(questions[questionNo])
        } else {
            $("#done>div").text("Next")
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
            timer = false
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
        var audio = new Audio('src/correct-effect.mp3');
        audio.play();
    } else {
        var audio = new Audio('src/wrong-effect.mp3');
        $(div).css("background-color", "#ec6b83")
        audio.play();
    }


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

function get_QBank_And_Create(key) {
    var url = "https://opentdb.com/api.php?amount=5"
    if (key != 0) {
        url = `https://opentdb.com/api.php?amount=5&category=${key}`
    }
    $.ajax({
        method: "POST",
        url: url,
    }).done(function (result) {
        if (result.response_code != 0) {
            loadFailedStartScreen();
        } else {
            for (const [key, value] of Object.entries(result.results)) {

                if (questions.length == 5) {
                    break;
                }
                if ($('<div>').html(`${value.question}`)[0].textContent.length > 100) {
                    continue;
                }
                var points = 1000
                var time = 10
                if (value.difficulty == "medium") {
                    time = 20
                }
                if (value.difficulty == "hard") {
                    points = 2000
                    time = 30
                }
                const wrong_list = []
                value.incorrect_answers.forEach(element => {
                    if ($('<div>').html(`${element}`)[0].textContent == undefined) {
                        wrong_list.push(null)
                    } else {
                        wrong_list.push($('<div>').html(`${element}`)[0].textContent)
                    }

                });
                const newQn = {
                    question: $('<div>').html(`${value.question}`)[0].textContent,
                    wrongAns: wrong_list,
                    correctAns: $('<div>').html(`${value.correct_answer}`)[0].textContent,
                    timeNeeded: time,
                    points: points,
                }
                questions.push(newQn)
            }

            if (questions.length != 5) {
                console.log("error")
                get_QBank_And_Create(key)
            } else {
                const state = {
                    ownerName: "Auto Generated",
                    name: result.results[0].category,
                    quizQuestion: questions,
                }
                loadSuccessfulStartScreen(state)
            }
        }

    })
}
function loadSuccessfulStartScreen(state) {
    console.log(questions)
    $("#loading").attr("style", "z-index: 100; width: 100%; height: 90%; display: none !important")
    $("#start-container").css("display", "")
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
}
function loadFailedStartScreen() {
    $("#loading").attr("style", "z-index: 100; width: 100%; height: 90%; display: none !important")
    $("#start-container").css("display", "")
    $(".question-div").first().text("Invalid quiz link")
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
var questions = []
console.log("ok")
database.ref("/quiz/" + key).once("value").then((snapshot) => {
    if (snapshot.exists()) {
        var state = snapshot.val();
        questions = state.quizQuestion
        loadSuccessfulStartScreen(state)
    } else {
        get_QBank_And_Create(key)
    }
})
var snapshotUserDetails;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        database.ref("user/" + user.uid).once("value").then((userSnapshot) => {
            if (userSnapshot.exists()) {
                snapshotUserDetails = userSnapshot.val()
            } else {
                window.location = "profile.html"
            }
        })

    } else {
        window.location = "login.html"
    }
});
