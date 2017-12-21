
var state = "sign-in";
var signUpLink = document.getElementById("sign-up-link");
var signInLink = document.getElementById("sign-in-link");

var signIn = document.getElementById("sign-in");
var signUp = document.getElementById("sign-up");

var signInButton = document.getElementById("sign-in-button");
var signUpButton = document.getElementById("sign-up-button");

signInLink.addEventListener("click", showSignIn);
signUpLink.addEventListener("click", showSignUp);

function showSignUp(event) {
    event.preventDefault();
    signIn.style.display = "none";
    signUp.style.display = "inline";
    state = "sign-up";
}

function showSignIn(event) {
    event.preventDefault();
    signUp.style.display = "none";
    signIn.style.display = "inline";
    state = "sign-in";
}

function clickSignInButton(event) {
    event.preventDefault();
    $.ajax({
        method: "GET",
        url: "/signin",
        data: {
            account: "2woe",
            password: "wqeqw"
        },
        success: signInSuccess,
        error: signInError
    });
}

function clickSignUpButton(event) {
    event.preventDefault();
    $.ajax({
        method: "GET",
        url: "/signup",
        data: {
            account: "",
            password: "",
            email: ""
        },
        success: signUpSuccess,
        error: signUpError
    });
}

function signUpSuccess(result) {
    console.log("sign up success: ", result);
}

function signUpError(error) {
    onError(error);
}

function signInSuccess(result) {
    console.log("sign in success: ", result);
}

function signInError(error) {
    onError(error);
}

