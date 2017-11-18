document.getElementById("edit-button").addEventListener("click", showPostSection);

function showPostSection(event) {
    console.log("click");
    if ($(window).width() > 800) {
        document.getElementById("post-illegal-parking").style.display = "inline";
    } else {
    }
}