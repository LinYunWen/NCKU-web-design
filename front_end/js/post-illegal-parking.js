document.getElementById("edit-button").addEventListener("click", clickEditButton);
document.getElementById("post-button").addEventListener("click", clickPostButton);

var isSectionShow = false;

function clickEditButton(event) {
    document.getElementById("use-camera").click();
    getLocation();
}

function tugglePostSection() {
    var section = document.getElementById("post-illegal-parking");
    var state = isSectionShow ? "none" : "inline";
    var stateOther = !isSectionShow ? "none" : "inline";
    if ($(window).width() < 800) {
        section.style.top = "10vh";
    }
    document.getElementById("rank").style.display = stateOther;
    document.getElementById("illegal-parking").style.display = stateOther;
    document.getElementById("intro").style.display = stateOther;
    document.getElementsByTagName("footer")[0].style.display = stateOther;
    section.style.display = state;
    isSectionShow = !isSectionShow;
}

function postSuccess(result) {
    console.log("post success: ", result);
    window.alert("You have successfully posted.");
}

function postError(error) {
    onError("post error: ", error);
}

function sendPost(imageURL) {
    var location = getLonAndLat();
    $.ajax(
        {
            method: "POST",
            url: "/report_illegal",
            data: {
                location: parseToWord($("#upload-location").val()),
                name: $("#upload-name").val(),
                picture: imageURL,
                car_num: $("#upload-car-num").val(),
                longitude: location[0],
                latitude: location[1]
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