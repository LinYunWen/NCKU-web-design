'use strict'

function getIllegalPost() {
    $.ajax({
        method: "GET",
        url: "/get_illegal_post",
        data: {
        },
        success: getIllegalSuccess,
        error: getIllegalError
    });
}

function getTopPost(index) {
    $.ajax({
        method: "GET",
        url: "/get_top_post",
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
            url: "/publish",
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
    var parkingImgs = document.getElementsByClassName("illegal-parking");
    for (let i=0; i<5; i++) {
        parkingImgs[i].src = result["data"][i]["picture"];
    }
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