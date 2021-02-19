$("#login-btn").on("click", function () {
    // Login with google
    firebase.auth().signInWithRedirect(provider);
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
var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User has logged in
        window.location = "profile.html"
    } else {
        // User not logged in
        $("#wrapper").css("display", "")
        $("#loading-icon").attr("style", "margin-top: 100px; display: none !important;")
    }
});
