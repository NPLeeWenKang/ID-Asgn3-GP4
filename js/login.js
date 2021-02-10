$("#login-btn").on("click", function () {
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
        console.log(user.uid)
        window.location = "profile.html"
    }
});

// var user = firebase.auth().currentUser;
// console.log(user)
// if (user) {
//     window.location = "profile.html"
// } else {
//     // No user is signed in.
// }