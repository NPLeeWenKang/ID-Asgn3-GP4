


function loadQuizzes(state) {
    console.log(state)
    const container = document.createElement("div");
    container.className = "container"

    const add_img = document.createElement("div");
    add_img.className = "add-img"

    const add_button = document.createElement("button");
    add_button.className = "add-icon-btn"
    add_button.textContent = "+ Add Icon"

    const text_container = document.createElement("div");
    text_container.className = "text-container"

    const span = document.createElement("span");
    const h3 = document.createElement("h3")
    h3.textContent = state.name
    const p = document.createElement("p");
    p.textContent = state.description
    const remove_button = document.createElement("button");
    remove_button.id = "remove-btn"
    remove_button.textContent = "x Remove"

    text_container.appendChild(span)
    text_container.appendChild(h3)
    text_container.appendChild(p)
    text_container.appendChild(remove_button)

    container.appendChild(add_img)
    container.appendChild(add_button)
    container.appendChild(text_container)
    quizBody.appendChild(container)

}

const quizBody = document.getElementById("my-quizzes")
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        database.ref("user/" + user.uid).once("value").then((snapshot) => {
            if (snapshot.exists()) {
                var value = snapshot.val()
                if (value.quizCreated != null) {
                    value.quizCreated.forEach(element => {
                        database.ref("quiz/" + element).once("value").then((snapshot) => {
                            if (snapshot.exists()) {
                                loadQuizzes(snapshot.val())
                            } else {
                                console.log("null")
                            }
                        })
                    });
                } else {
                    console.log("no quiz created")
                }

            } else {
                console.log("null")
            }
        })
    } else {
        window.location = "login.html"
    }
});