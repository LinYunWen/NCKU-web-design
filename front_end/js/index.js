document.getElementById("sign-out-li").addEventListener("click", clickSignOut);

function clickSignOut(event) {
    $.ajax({
        method: "POST",
        url: "/signout",
        data: {
            command: "sign-out"
        },
        success: signOutSuccess,
        error: signOutError
    });
}

function signOutSuccess(result) {
    if (result["result"] == 1) {
        document.getElementById("account-name").value = "";
        setSignOutDisplay(false);
        alert("You have successfully signed out.");
    } else {
        alert("Error on signing out.");
    }
}

function signOutError(error) {
    onError(error);
}

function getSession() {
    $.ajax({
        method: "GET",
        url: "/get_session",
        data: {
        },
        success: getSessionSuccess,
        error: getSessionError
    });
}

function getSessionSuccess(result) {
    if (result["signin_status"]) {
        var account = document.getElementById("account-name");
        account.value = result["account"];
        setSignOutDisplay(true);
    }
}

function getSessionError(error) {
    onError(error);
}

function setSignOutDisplay(display) {
    if (display) {
        document.getElementById("sign-in-li").style.display = "none";
        document.getElementById("sign-out-li").style.display = "block";
    } else {
        document.getElementById("sign-in-li").style.display = "block";
        document.getElementById("sign-out-li").style.display = "none";
    }
}

function onError(error) {
    console.log(error);
}