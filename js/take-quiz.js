
var tf = true
$("audio").prop("volume", 0.6);


$("#start").on("click", function () {
    $("#start-div").css("display", "none")
    $("#start").css("display", "none")
    $("#start").unbind("click")
    $("#quiz").css("display", "")
    $("audio").trigger("play");
    loadQuestion(questions[2])
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
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function loadQuestion(question) {
    $("audio").trigger("play")
    var ans = 0
    var div;
    $(".innerDiv").on("click", function () {
        $(".quizInput").css("background-color", "")
        $(".quizInput").parent().parent().css("background-color", "")
        $(this).css("background-color", "#aaff00")
        $(this).parent().parent().css("background-color", "#aaff00")
        ans = $(this).find("input").val()
        div = this
    })
    console.log(question)
    const arr = [question.correctAns, question.wrongAns[0], question.wrongAns[1], question.wrongAns[2]]
    $(".question-div").text(question.question)
    console.log(arr)
    shuffleArray(arr)
    console.log(arr)
    arr.forEach((element) => {
        console.log(arr.indexOf(element) + 1)
        console.log(element)
        $(`.answer${arr.indexOf(element) + 1}`).val(element)
    })
    $(".time").text(question.timeNeeded)
    var time = question.timeNeeded
    const timer = setInterval(() => {
        time -= 1;
        $(".time").text(time)

        if (time <= 0) {
            clearInterval(timer)
            $(".innerDiv").unbind("click")
            if (ans == question.correctAns) {
                var audio = new Audio('../src/correct-effect.wav');
                audio.play();
            } else {
                var audio = new Audio('../src/wrong-effect.wav');
                $(div).css("background-color", "#ec6b83")
                audio.play();
            }


            $("audio").trigger("pause")
            console.log($(`.answer2`).val())
            $(".time").css("background-color", "d05860")
            if ($(`.answer1`).val() == question.correctAns) {
                $(`.answer1`).css("background-color", "#1ae56e")
                $(`.answer1`).parent().parent().css("background-color", "#1ae56e")
            }
            if ($(`.answer2`).val() == question.correctAns) {
                $(`.answer2`).css("background-color", "#1ae56e")
                $(`.answer2`).parent().parent().css("background-color", "#1ae56e")
            }
            if ($(`.answer3`).val() == question.correctAns) {
                $(`.answer3`).css("background-color", "#1ae56e")
                $(`.answer3`).parent().parent().css("background-color", "#1ae56e")
            }
            if ($(`.answer4`).val() == question.correctAns) {
                $(`.answer4`).css("background-color", "#1ae56e")
                $(`.answer4`).parent().parent().css("background-color", "#1ae56e")
            }
        }
    }, 200);
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
var questions = {}
database.ref("/quiz/" + key).once("value").then((snapshot) => {
    var state = snapshot.val() || 'Anonymous';
    console.log($(".question-div").first())
    $(".question-div").first().text(state.name)
    $("#made-by").text(`Made By: ${state.ownerName}`)
    $("#est-time").text(`Estimated quiz duration: ${calEstimatedTime(state.quizQuestion)}s`)
    questions = state.quizQuestion
})