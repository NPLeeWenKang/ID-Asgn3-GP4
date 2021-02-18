function calcRangeDisplay_Points(val, dom) {
    if (val == "0") {
        dom.innerHTML = parseInt(val) * 1000 + " lux";
    } else if (val == "1") {
        dom.innerHTML = parseInt(val) * 1000 + " lux";
    } else if (val == "2") {
        dom.innerHTML = parseInt(val) * 1000 + " lux";
    }
}

function calcRangeDisplay_Time(val, dom) {
    if (val == "0") {
        dom.innerHTML = "5 sec";
    } else if (val == "1") {
        dom.innerHTML = "10 sec";
    } else if (val == "2") {
        dom.innerHTML = "20 sec";
    } else if (val == "3") {
        dom.innerHTML = "30 sec";
    } else if (val == "4") {
        dom.innerHTML = "60 sec";
    } else if (val == "5") {
        dom.innerHTML = "90 sec";
    } else if (val == "6") {
        dom.innerHTML = "120 sec";
    }
}
function convertPoints(point) {
    if (point == "0") {
        return parseInt(point) * 1000;
    } else if (point == "1") {
        return parseInt(point) * 1000;
    } else if (point == "2") {
        return parseInt(point) * 1000;
    }
}
function convertPointsToVal(points) {
    return points / 1000
}
function convertTime(point) {
    if (point == "0") {
        return 5;
    } else if (point == "1") {
        return 10;
    } else if (point == "2") {
        return 20;
    } else if (point == "3") {
        return 30;
    } else if (point == "4") {
        return 60;
    } else if (point == "5") {
        return 90;
    } else if (point == "6") {
        return 120;
    }
}
function convertTimeToVal(point) {
    if (point == 5) {
        return 0;
    } else if (point == 10) {
        return 1;
    } else if (point == 20) {
        return 2;
    } else if (point == 30) {
        return 3;
    } else if (point == 60) {
        return 4;
    } else if (point == 90) {
        return 5;
    } else if (point == 120) {
        return 6;
    }
}
function submitDatabase(arr, qnArr, userQnList) {
    database.ref("quiz/" + arr.quizId).set(arr, (error) => {
        if (error) {
            console.alert(error);
        } else {
            database.ref("quiz/" + arr.quizId + "/quizQuestion").set(qnArr, (error) => {
                if (error) {
                    console.alert(error);
                } else {
                    database.ref("user/" + snapshotUserDetails.uid).update({ quizCreated: userQnList }, (error) => {
                        if (error) {
                            console.alert(error);
                        } else {
                            if (arr.type == "public") {
                                database.ref("pubQuiz/" + arr.quizId).set(arr, (error) => {
                                    if (error) {
                                        console.alert(error);
                                    } else {
                                        window.location = "my-quiz.html"
                                        //console.log("done")
                                    }
                                })
                            } else {
                                console.log("no pub")
                                window.location = "my-quiz.html"
                            }
                        }
                    });


                }
            });
        }
    })

}
function validateQuiz(questionArr) {
    // $("#row1").addClass("row-cols-1")
    // $("#row1").removeClass("row-cols-2")
    var myModalEl = document.getElementById('staticBackdrop')
    var modal = bootstrap.Modal.getInstance(myModalEl)
    setTimeout(function () {

        if (pass_fail) {
            $("#validation-loading-icon").find("lottie-player").css("display", "none");
            $("#validation-loading-icon").find("div").css("display", "none");
            $("#after-validation-pass").css("display", "");
            $("#checkmark").css("color", "green")
            $("#comment").text("Validation successful! Your quiz looks great!")
            $("#modal-submit").removeClass("modal-submit")
            $("#modal-submit").on("click", function () {
                var type = "public";
                if ($("#public").prop('checked')) {
                    type = "public"
                } else {
                    type = "private"
                }
                const arr = {
                    quizId: Date.now(),
                    name: $("#quiz-name").val(),
                    description: $("#quiz-desc").val(),
                    ownerId: snapshotUserDetails.uid,
                    type: type,
                }
                if (snapshotUserDetails.quizCreated == null) {
                    snapshotUserDetails.quizCreated = [arr.quizId]
                } else {
                    snapshotUserDetails.quizCreated.push(arr.quizId)
                }

                submitDatabase(arr, questionArr, snapshotUserDetails.quizCreated)
            })
        } else {
            $("#wrapper").empty();
            $("#validation-loading-icon").find("lottie-player").css("display", "none");
            $("#validation-loading-icon").find("div").css("display", "none");
            $("#after-validation-fail").css("display", "");
            $("#modal-body-validate").css("backgroundColor", "#eee")
            $("#modal-body-validate").css("paddingBottom", "0")
            $("#modal-body-validate").css("paddingTop", "0")
            $("#checkmark").css("color", "red")
            $("#comment").text("Validation failed! Something went wrong!")
            for (const [key, value] of Object.entries(failed)) {
                createFailedValidation(document.getElementById("wrapper"), key, value)
            }

        }
    }, 3000)
    var pass_fail = true;
    var failed = {}
    for (const [key, value] of Object.entries(questionArr)) {
        const errMessage = []
        let didQnFail = true;
        if (value.question.length == 0) {
            pass_fail = false;
            didQnFail = false;
            errMessage.push("err1")
        }
        if (value.correctAns.length == 0) {
            pass_fail = false;
            didQnFail = false;
            errMessage.push("err2")
        }
        if (value.wrongAns[0].length == 0) {
            pass_fail = false;
            didQnFail = false;
            errMessage.push("err3")
        }
        if (!didQnFail) {

            failed = {
                ...failed,
                [key]: errMessage
            }
        }

    }

}
function createFailedValidation(dom, qnNo, err) {
    const div = document.createElement("div");
    div.style.borderRadius = "3px";
    div.style.backgroundColor = "white"
    div.style.padding = "5px"
    div.style.marginTop = "10px"
    div.style.marginBottom = "10px"
    div.style.borderBottom = "4px solid rgba(0,0,0,0.2)";
    const questionNo = document.createElement("div");
    questionNo.style.borderBottom = "1px solid #757575"
    questionNo.style.paddingBottom = "5px";
    questionNo.innerHTML = `Question - ${parseInt(qnNo) + 1}`
    div.appendChild(questionNo)


    const iconErr = document.createElement("img");
    iconErr.style.marginRight = "5px"
    iconErr.src = "src/exclamation-circle-fill.svg"

    if (err.includes("err1")) {
        const errorDiv1 = document.createElement("div");
        errorDiv1.style.marginTop = "5px"
        errorDiv1.className = "d-flex align-items-center"
        const errorMessage1 = document.createElement("span");
        errorMessage1.innerHTML = "Question field is empty."
        errorDiv1.appendChild(iconErr.cloneNode(true))
        errorDiv1.appendChild(errorMessage1)
        div.appendChild(errorDiv1)
    }
    if (err.includes("err2")) {
        const errorDiv2 = document.createElement("div");
        errorDiv2.style.marginTop = "5px"
        errorDiv2.className = "d-flex align-items-center"
        const errorMessage2 = document.createElement("span");
        errorMessage2.innerHTML = "There is no correct answer."
        errorDiv2.appendChild(iconErr.cloneNode(true))
        errorDiv2.appendChild(errorMessage2)
        div.appendChild(errorDiv2)
    }
    if (err.includes("err3")) {
        const errorDiv3 = document.createElement("div");
        errorDiv3.style.marginTop = "5px"
        errorDiv3.className = "d-flex align-items-center"
        const errorMessage3 = document.createElement("span");
        errorMessage3.innerHTML = "There is no wrong answer."
        errorDiv3.appendChild(iconErr.cloneNode(true))
        errorDiv3.appendChild(errorMessage3)
        div.appendChild(errorDiv3)
    }

    dom.appendChild(div)
}
function createQBank() {
    $.ajax({
        method: "POST",
        url: "https://opentdb.com/api_category.php",
    }).done(function (result) {
        const category = document.getElementById("category")
        let option = document.createElement("option")
        option.value = 1
        option.textContent = "Any Category"
        category.appendChild(option)
        for (const [key, value] of Object.entries(result.trivia_categories)) {
            const option = document.createElement("option")
            option.value = value.id
            option.textContent = value.name
            category.append(option)
        }

    })
}
$("#category").on("input", function () {
    console.log($("#category option:selected").val())
    console.log(this.value)

})
function get_QBank_And_Create(url, questionArr, targetLength) {
    $.ajax({
        method: "POST",
        url: url,
    }).done(function (result) {
        for (const [key, value] of Object.entries(result.results)) {
            if (Object.keys(questionArr).length == targetLength) {
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
            questionArr = {
                ...questionArr,
                [Object.keys(questionArr).length]: newQn,
            }
        }

        if (Object.keys(questionArr).length != targetLength) {
            console.log("error")
            get_QBank_And_Create(url, questionArr, targetLength)
        } else {
            var qnNo = 1
            $("#create-quiz-area").empty();
            for (const [key, value] of Object.entries(questionArr)) {
                createQuizDiv(body, qnNo, value)
                qnNo += 1
            }
            $(".range1").unbind("input")
            $(".range1").on("input", function () {
                calcRangeDisplay_Points(this.value, this.parentElement.firstElementChild)
            })
            $(".range2").unbind("input")
            $(".range2").on("input", function () {
                calcRangeDisplay_Time(this.value, this.parentElement.firstElementChild)
            })
            $(".delete-icon").unbind("click")
            $(".delete-icon").on("click", function () {
                const index = this.previousSibling.textContent.replace("Question ", "")
                deleteQuestion(parseInt(index))

            })
        }



    })
}
$("#q-bank-submit").on("click", function () {
    var number_qns = $("#number-qns").val();
    var category = $("#category option:selected").val();
    var difficulty = $("#difficulty option:selected").val().toLowerCase();

    var type = $("#type option:selected").val().toLowerCase();

    console.log(number_qns, category, difficulty, type)
    var url = `https://opentdb.com/api.php?amount=${number_qns}`;
    if (category != 1) {
        url += `&category=${category}`
    }
    if (difficulty == "easy" || difficulty == "medium" || difficulty == "hard") {
        url += `&difficulty=${difficulty}`;
    }
    if (type == "true / false") {
        url += `&type=boolean`
    }
    if (type == "multiple choice") {
        url += `&type=multiple`
    }
    console.log(url)
    var questionArr = getQuestionData()
    var targetLength = parseInt(Object.keys(questionArr).length) + parseInt(number_qns)
    get_QBank_And_Create(url, questionArr, targetLength);





})
createQBank()
function createQuizDiv(body, questionNo, questionArr) {
    const container = document.createElement("div");
    container.className = "question"
    container.style.marginTop = "10px"



    const questionDiv = document.createElement("div");
    questionDiv.style.position = "relative"
    questionDiv.style.width = "100%";
    questionDiv.style.maxWidth = "700px";
    questionDiv.style.margin = "auto";
    questionDiv.style.marginBottom = "10px";
    questionDiv.style.borderRadius = "3px"
    questionDiv.style.borderBottom = "4px solid rgba(0,0,0,0.2)"
    questionDiv.style.height = "70px"
    questionDiv.style.backgroundColor = "white"
    const inputDiv = document.createElement("input");
    inputDiv.className = "user-qn"
    inputDiv.style.textAlign = "center";
    inputDiv.style.width = "100%";
    inputDiv.style.height = "100%";
    inputDiv.style.fontSize = "22px";
    inputDiv.placeholder = "Type your question!"
    inputDiv.maxLength = 100;
    if (questionArr != null && questionArr.question.length != 0) {
        inputDiv.value = questionArr.question
    }

    const text = document.createElement("div");
    text.style.position = "absolute"
    text.style.top = "3px"
    text.style.left = "3px"
    text.innerHTML = `Question ${questionNo}`

    const deleteIcon = document.createElement("img");
    deleteIcon.className = "delete-icon"
    deleteIcon.src = "src/trash.svg"

    deleteIcon.innerHTML = `Question ${questionNo}`

    questionDiv.appendChild(text)
    questionDiv.appendChild(deleteIcon)
    questionDiv.appendChild(inputDiv)

    const rangeDiv = document.createElement("div");
    rangeDiv.style.maxWidth = "500px";
    rangeDiv.style.margin = "auto";
    rangeDiv.className = "range-wrapper d-flex justify-content-between align-items-center"

    const rangeInnerDiv1 = document.createElement("div");
    const score1 = document.createElement("div");
    score1.className = "score d-flex justify-content-center align-items-center"
    score1.innerHTML = "1000 lux"

    const rangeList = document.createElement("input")
    rangeList.type = "range"
    rangeList.className = "range form-range range1 points"
    rangeList.setAttribute("min", 0)
    rangeList.setAttribute("max", 2)
    rangeList.setAttribute("step", 1)
    rangeList.setAttribute("value", 1)
    if (questionArr != null) {
        score1.innerHTML = `${questionArr.points} lux`
        rangeList.setAttribute("value", convertPointsToVal(questionArr.points))
    }

    rangeInnerDiv1.appendChild(score1)
    rangeInnerDiv1.appendChild(rangeList)

    const rangeInnerDiv2 = document.createElement("div");
    const score2 = document.createElement("div");
    score2.className = "score d-flex justify-content-center align-items-center"
    score2.innerHTML = "30 sec"

    const rangeList2 = document.createElement("input")
    rangeList2.type = "range"
    rangeList2.className = "range form-range range2 time"
    rangeList2.setAttribute("min", 0)
    rangeList2.setAttribute("max", 6)
    rangeList2.setAttribute("step", 1)
    rangeList2.setAttribute("value", 3)
    if (questionArr != null) {
        score2.innerHTML = `${questionArr.timeNeeded} sec`
        rangeList2.setAttribute("value", convertTimeToVal(questionArr.timeNeeded))
    }

    rangeInnerDiv2.appendChild(score2)
    rangeInnerDiv2.appendChild(rangeList2)

    rangeDiv.appendChild(rangeInnerDiv1);
    rangeDiv.appendChild(rangeInnerDiv2);

    const answerDiv = document.createElement("div");
    //answerDiv.style.marginTop = "10px"
    const row1 = document.createElement("div");
    row1.id = "row1"
    row1.className = "row row-cols-2 g-0"

    const answer1 = document.createElement("div");
    answer1.className = "col "
    const innerDiv1 = document.createElement("div");
    innerDiv1.className = "innerDiv left"
    const content1 = document.createElement("div");
    content1.className = "contentDiv"
    const color1 = document.createElement("div");
    color1.className = "tag"
    color1.style.backgroundColor = "red"
    const input1 = document.createElement("input");
    input1.className = "quizInput answer1"
    input1.placeholder = "Option 1 (Correct Answer)"
    input1.maxLength = 20;
    if (questionArr != null && questionArr.correctAns.length != 0) {
        input1.value = questionArr.correctAns
    }

    content1.appendChild(color1)
    content1.appendChild(input1)
    innerDiv1.appendChild(content1)
    answer1.appendChild(innerDiv1);

    const answer2 = document.createElement("div");
    answer2.className = "col "
    const innerDiv2 = document.createElement("div");
    innerDiv2.className = "innerDiv right"
    const content2 = document.createElement("div");
    content2.className = "contentDiv"
    const color2 = document.createElement("div");
    color2.className = "tag"
    color2.style.backgroundColor = "blue"
    const input2 = document.createElement("input");
    input2.className = "quizInput answer2"
    input2.placeholder = "Option 2"
    input2.maxLength = 20;
    if (questionArr != null && questionArr.wrongAns.length != 0) {
        input2.value = questionArr.wrongAns[0]
    }


    content2.appendChild(color2)
    content2.appendChild(input2)
    innerDiv2.appendChild(content2)
    answer2.appendChild(innerDiv2);

    const answer3 = document.createElement("div");
    answer3.className = "col "
    const innerDiv3 = document.createElement("div");
    innerDiv3.className = "innerDiv left"
    const content3 = document.createElement("div");
    content3.className = "contentDiv"
    const color3 = document.createElement("div");
    color3.className = "tag"
    color3.style.backgroundColor = "green"
    const input3 = document.createElement("input");
    input3.className = "quizInput answer3"
    input3.placeholder = "Option 3 (Optional)"
    input3.maxLength = 20;
    if (questionArr != null && questionArr.wrongAns.length != 0) {
        input3.value = questionArr.wrongAns[1]
    }

    content3.appendChild(color3)
    content3.appendChild(input3)
    innerDiv3.appendChild(content3)
    answer3.appendChild(innerDiv3);

    const answer4 = document.createElement("div");
    answer4.className = "col "
    const innerDiv4 = document.createElement("div");
    innerDiv4.className = "innerDiv right"
    const content4 = document.createElement("div");
    content4.className = "contentDiv"
    const color4 = document.createElement("div");
    color4.className = "tag"
    color4.style.backgroundColor = "yellow"
    const input4 = document.createElement("input");
    input4.className = "quizInput answer4"
    input4.placeholder = "Option 4 (Optional)"
    input4.maxLength = 20;
    if (questionArr != null && questionArr.wrongAns.length != 0) {
        input4.value = questionArr.wrongAns[2]
    }

    content4.appendChild(color4)
    content4.appendChild(input4)
    innerDiv4.appendChild(content4)
    answer4.appendChild(innerDiv4);

    row1.appendChild(answer1);
    row1.appendChild(answer2);
    row1.appendChild(answer3);
    row1.appendChild(answer4);
    answerDiv.appendChild(row1)


    //const answer3 = document.createElement("div");
    //const answer4 = document.createElement("div");

    container.appendChild(questionDiv)
    container.appendChild(rangeDiv)
    container.appendChild(answerDiv)

    body.appendChild(container);
}

function deleteQuestion(index) {
    const questionArr = getQuestionData();
    console.log(questionArr)
    delete questionArr[index - 1];
    var qnNo = 1
    $("#create-quiz-area").empty();
    for (const [key, value] of Object.entries(questionArr)) {
        createQuizDiv(body, qnNo, value)
        qnNo += 1
    }
    $(".range1").unbind("input")
    $(".range1").on("input", function () {
        calcRangeDisplay_Points(this.value, this.parentElement.firstElementChild)
    })
    $(".range2").unbind("input")
    $(".range2").on("input", function () {
        calcRangeDisplay_Time(this.value, this.parentElement.firstElementChild)
    })
    $(".delete-icon").unbind("click")
    $(".delete-icon").on("click", function () {
        const index = this.previousSibling.textContent.replace("Question ", "")
        deleteQuestion(parseInt(index))

    })

}
function getQuestionData() {
    const questions = document.getElementsByClassName("question");
    var questionArr = {}
    for (i = 0; i < questions.length; i++) {
        let user_qn = questions[i].getElementsByClassName("user-qn")[0].value;
        let qn_1 = questions[i].getElementsByClassName("answer1")[0].value;
        let qn_2 = questions[i].getElementsByClassName("answer2")[0].value;
        let qn_3 = questions[i].getElementsByClassName("answer3")[0].value;
        let qn_4 = questions[i].getElementsByClassName("answer4")[0].value;
        let points = questions[i].getElementsByClassName("points")[0].value;
        let time = questions[i].getElementsByClassName("time")[0].value;
        const newQn = {
            question: user_qn,
            wrongAns: [qn_2, qn_3, qn_4],
            correctAns: qn_1,
            timeNeeded: convertTime(time),
            points: convertPoints(points),
        }
        questionArr = {
            ...questionArr,
            [i]: newQn,
        }

    }
    return questionArr;
}
const body = document.getElementById("create-quiz-area");
const b = document.getElementById("add-question");
b.addEventListener("click", function () {
    createQuizDiv(body, body.childElementCount + 1)
    $(".range1").unbind("input")
    $(".range1").on("input", function () {
        calcRangeDisplay_Points(this.value, this.parentElement.firstElementChild)
    })
    $(".range2").unbind("input")
    $(".range2").on("input", function () {
        calcRangeDisplay_Time(this.value, this.parentElement.firstElementChild)
    })
    $(".delete-icon").unbind("click")
    $(".delete-icon").on("click", function () {
        const index = this.previousSibling.textContent.replace("Question ", "")
        deleteQuestion(parseInt(index))

    })
    b.style.color = "rgba(0,0,0,0.5)";
    setTimeout(function () {
        b.style.color = "rgba(0,0,0,1)";
    }, 500)
})
const range1 = document.getElementsByClassName("range1")


createQuizDiv(body, 1)
$(".range1").on("input", function () {
    calcRangeDisplay_Points(this.value, this.parentElement.firstElementChild)
})
$(".range2").on("input", function () {
    calcRangeDisplay_Time(this.value, this.parentElement.firstElementChild)
})
$("input#number-qns").on("input", function () {
    $("#number-qns-label").text(`Number of Questions: ${$("#number-qns").val()}`)
})

$(".delete-icon").on("click", function () {
    const index = this.previousSibling.textContent.replace("Question ", "")
    deleteQuestion(parseInt(index))

})
$("#done-btn").on("click", function () {
    clearModal()
    validateQuiz(getQuestionData());
})
function clearModal() {
    $("#validation-loading-icon").find("lottie-player").css("display", "");
    $("#validation-loading-icon").find("div").css("display", "");
    $("#after-validation-pass").css("display", "none");
    $("#after-validation-fail").css("display", "none");
    $("#wrapper").empty();
    $("#checkmark").css("color", "")
    $("#modal-body-validate").css("backgroundColor", "")
    $("#modal-body-validate").css("paddingBottom", "")
    $("#modal-body-validate").css("paddingTop", "")
    $("#comment").text("Please wait while our system validates the quiz!")
    $("#modal-submit").addClass("modal-submit")
    $("#modal-submit").unbind("click")
}
$('#staticBackdrop').on('hidden.bs.modal', function () {
    clearModal()
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
var userDetails;
var snapshotUserDetails;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userDetails = user
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