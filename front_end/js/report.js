'use strict'

function getIllegalPost() {
    $.ajax({
        method: "GET",
        url: "https://luffy.ee.ncku.edu.tw:2997/get_illegal_post",
        data: {
        },
        success: getIllegalSuccess,
        error: getIllegalError
    });
}

function getTopPost(index) {
    $.ajax({
        method: "GET",
        url: "https://luffy.ee.ncku.edu.tw:2997/get_top_post",
        data: {
            index: index,
        },
        success: getTopSuccess,
        error: getTopError
    });
}


var pubishButton = document.getElementById("publish-button");
pubishButton.addEventListener("click", clickPublishButton);

function clickPublishButton(event) {
    var anwser = alert("Are you sure to publish?");
    if (anwser) {
        $.ajax({
            method: "GET",
            url: "https://luffy.ee.ncku.edu.tw:2997/publish",
            data: {
                name: "publish",
                longitude: 312,
                latitude: 12
            },
            success: publishSuccess,
            error: publishError
        });
    }
}

function getIllegalSuccess(result) {
    console.log("get illegal success: ", result);
}

function getIllegalError(error) {
    onError(error);
}

function getTopSuccess(result) {
    console.log("get top success: ", result);
}

function getTopError(error) {
    onError(error);
}

function publishSuccess(result) {
    console.log("get publish success: ", result);
}

function publishError(error) {
    onError(error);
}

function onError(error) {
    console.log(error);
}