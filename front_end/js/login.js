
var state = "sign-in";
var signUpLink = document.getElementById("sign-up-link");
var signInLink = document.getElementById("sign-in-link");

var signIn = document.getElementById("sign-in");
var signUp = document.getElementById("sign-up");

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

