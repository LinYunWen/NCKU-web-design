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

function postSuccess(result, status, xhr) {

}

function postError(xhr, status, error) {
    
}

function sendPost() {
    $.ajax(
        {
            method: "GET",
            url: "/report_illegal",
            data: {
                location: $("#upload-location").val(),
                name: $("#upload-name").val(),
                picture: $("#upload-picture-img").attr("src")
            },
            success: postSuccess,
            error: postError
        }
    )
}

function clickPostButton(event) {
    // event.preventDefault();
    // sendPost();
    mediaStreamTrack.stop();
    uploadImage(imageBlob);
    tugglePostSection();
}