
var state = "sign-in";
var signUpLink = document.getElementById("sign-up-link");
var signInLink = document.getElementById("sign-in-link");

var signIn = document.getElementById("sign-in");
var signUp = document.getElementById("sign-up");

var signInButton = document.getElementById("sign-in-button");
var signUpButton = document.getElementById("sign-up-button");

var signInAccountInput = document.getElementById("sign-in-account");
var signInPasswordInput = document.getElementById("sign-in-password");
var signUpAccountInput = document.getElementById("sign-up-account");
var signUpPasswordInput = document.getElementById("sign-up-password");
var signUpEmailInput = document.getElementById("email");
var signUpCarNumInput = document.getElementById("sign-up-car-number");

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
        method: "POST",
        url: "/signin",
        data: {
            account: signInAccountInput.value,
            password: signInPasswordInput.value
        },
        success: signInSuccess,
        error: signInError
    });
}

function clickSignUpButton(event) {
    event.preventDefault();
    $.ajax({
        method: "POST",
        url: "/signup",
        data: {
            account: signUpAccountInput.value,
            password: signUpPasswordInput.value,
            email: signUpEmailInput.value,
            carNum: signUpCarNumInput.value
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