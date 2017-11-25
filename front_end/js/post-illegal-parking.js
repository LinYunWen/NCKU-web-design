document.getElementById("edit-button").addEventListener("click", showPostSection);

var isSectionShow = false;

function showPostSection(event) {
    var section = document.getElementById("post-illegal-parking");
    var state = isSectionShow ? "none" : "inline";
    if ($(window).width() > 800) {
    } else {
        section.style.height = "100vh";
        section.style.width = "100vw";
        section.style.bottom = "0";
        section.style.left = "0";
    }
    section.style.display = state;
    isSectionShow = !isSectionShow;
}

function postSuccess() {

}

function postError() {
    
}

function sendPost() {
    $.ajax(
        {
            url: "",
            location: $("#upload-location").val(),
            name: $("#upload-name").val(),
            picture: $("#upload-picture-img").attr("src"),
            success: postSuccess,
            error: postError
        }
    )
}