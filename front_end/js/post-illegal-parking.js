document.getElementById("edit-button").addEventListener("click", showPostSection);

function showPostSection(event) {
    if ($(window).width() > 800) {
        var section = document.getElementById("post-illegal-parking");
        if (section.style.display == "none") {
            section.style.display = "inline";
            return;
        }
        section.style.display = "none";
    } else {
    }
}