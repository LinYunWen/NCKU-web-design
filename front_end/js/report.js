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

function onError(error) {
    console.log(error);
}