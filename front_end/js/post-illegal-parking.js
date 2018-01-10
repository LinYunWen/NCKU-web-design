document.getElementById("edit-button").addEventListener("click", clickEditButton);
document.getElementById("post-button").addEventListener("click", clickPostButton);
document.getElementById("cancel-button").addEventListener("click", clickCancelButton);

function clickEditButton(event) {
    document.getElementById("use-camera").click();
    getLocation();
}

function clickCancelButton(event) {
    event.preventDefault();
    stopTracks();
    setPostSectionDisplay("none");
    setWebPageDisplay("block");
    setFixedButton("inline-block");
}

function clickPostButton(event) {
    event.preventDefault();
    mediaStreamTrack.stop();
    uploadImage(imageBlob);
    setPostSectionDisplay("none");
    setWebPageDisplay("block");
    setFixedButton("inline-block");
}

function setPostSectionDisplay(state) {
    var section = document.getElementById("post-illegal-parking");
    if ($(window).width() < 800) {
        section.style.top = "10vh";
    }
    section.style.display = state;
    document.getElementById("loading-text").style.display = state;
    document.getElementById("loader").style.display = state;
}

function setWebPageDisplay(state) {
    document.getElementById("rank").style.display = state;
    document.getElementById("illegal-parking").style.display = state;
    document.getElementById("intro").style.display = state;
    document.getElementsByTagName("footer")[0].style.display = state;
    document.getElementsByTagName("nav")[0].style.display = state;
}

function setFixedButton(state) {
    document.getElementById("edit-button").style.display = state;
    document.getElementById("publish-button").style.display = state;
}

function setName(name) {
    document.getElementById("upload-name").value = name;
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

function onError(error) {
    console.log(error);
    window.alert(error);
}