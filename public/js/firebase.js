/**
 * Created by ryanb on 5/31/2017.
 */
// Initialize Firebase
var config = {
    apiKey: "AIzaSyD948shiDf3MGUUvat45QCIvt97DSiJTW8",
    authDomain: "ryanpdev.firebaseapp.com",
    databaseURL: "https://ryanpdev.firebaseio.com",
    projectId: "ryanpdev",
    storageBucket: "ryanpdev.appspot.com",
    messagingSenderId: "536412277169"
};
firebase.initializeApp(config);

var database = firebase.database().ref();



function signup(){
    console.log("Signing up!");

    const password = $('#password').val();
    const email = $('#email').val();

    console.log("Email", email);
    console.log("Password",password);

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
    });}

function login(){
    console.log("Logging in!");

    const password = $('#password').val();
    const email = $('#email').val();

    console.log("Email", email);
    console.log("Password",password);
    console.log("Password",password);
}

