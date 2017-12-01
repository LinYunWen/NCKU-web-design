'use strict'

function getIllegalPost(index) {
    $.ajax({
        method: "GET",
        url: "",
        data: {
            index: index,
            command: "get-illegal-post"
        },
        success: getIllegalSuccess,
        error: getIllegalError
    });
}

function getTopPost(index) {
    $.ajax({
        method: "GET",
        url: "",
        data: {
            index: index,
            command: "get-top-post"
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
            method: "POST",
            url: "",
            data: {
                command: "publish",
                longitude: 312,
                latitude: 12
            },
            success: publicSuccess,
            error: publicError
        });
    }
}

function getIllegalSuccess(result, status, xhr) {

}

function getIllegalError(xhr,status,error) {
    onError(error);
}

function getTopSuccess(result, status, xhr) {

}

function getTopError(xhr, status, error) {
    onError(error);
}

function pubishSuccess(result) {

}

function publishError(error) {
    onError(error);
}

function onError(error) {
    console.log(error);
}