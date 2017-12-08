document.getElementById("edit-button").addEventListener("click", clickEditButton);
document.getElementById("post-button").addEventListener("click", clickPostButton);

var isSectionShow = false;

function clickEditButton(event) {
    document.getElementById("use-camera").click();
    // tugglePostSection();
}

function tugglePostSection() {
    var section = document.getElementById("post-illegal-parking");
    var state = isSectionShow ? "none" : "inline";
    if ($(window).width() < 800) {
        section.style.height = "100vh";
        section.style.width = "100vw";
        section.style.bottom = "0";
        section.style.left = "0";
    }
    section.style.display = state;
    isSectionShow = !isSectionShow;
}

function postSuccess(result) {
    console.log("post success: ", result);
    window.alert("You are successfully post.");
}

function postError(error) {
    onError("post error: ", error);
}

function sendPost(imageURL) {
    $.ajax(
        {
            method: "POST",
            url: "/report_illegal",
            data: {
                location: $("#upload-location").val(),
                name: $("#upload-name").val(),
                picture: imageURL,
                car_num: "XXXX",
                longitude: 22.32,
                latitude: 122.11
            },
            success: postSuccess,
            error: postError
        }
    );
}

function clickPostButton(event) {
    event.preventDefault();
    mediaStreamTrack.stop();
    uploadImage(imageBlob);
    tugglePostSection();
}

function onError(error) {
    console.log(error);
    window.alert(error);
}