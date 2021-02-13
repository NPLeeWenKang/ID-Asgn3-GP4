function createQuizBox(key, value, quiz_area) {
    {/* <div id="card" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <img class="quiz-img" src="...">
                <div class="text-div">
                    <h3>Computer Science</h3>
                    <p>Computers are just stuff science hasn't made boring yet.</p>
                </div>
            </div> */}
    const card = document.createElement("div")
    card.id = key
    card.className = "card"
    card.setAttribute("data-bs-toggle", "modal")
    card.setAttribute("data-bs-target", "#exampleModal")
    const img = document.createElement("img")
    img.className = "quiz-img"
    img.src = "..."
    const text_div = document.createElement("div")
    text_div.className = "text-div"
    const h3 = document.createElement("h3")
    h3.innerHTML = value.name
    const p = document.createElement("p")
    p.innerHTML = value.ownerId

    text_div.appendChild(h3)
    text_div.appendChild(p)
    card.appendChild(img)
    card.appendChild(text_div)
    quiz_area.appendChild(card)


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
database.ref("/pubQuiz/").once("value").then((snapshot) => {
    var state = snapshot.val() || 'Anonymous';
    const quiz_area = document.getElementById("quiz-area")
    for (const [key, value] of Object.entries(state)) {
        createQuizBox(key, value, quiz_area)
    }
    $("#quiz-area").css("display", "")
    $("#loading-icon, #loading-icon>lottie-player, #loading-icon>h5").css("display", "none")

})