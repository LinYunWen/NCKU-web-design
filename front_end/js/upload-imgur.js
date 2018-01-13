'use strict'

function uploadImage(blob) {
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        var base64Data = reader.result;
        var form = new FormData();
        base64Data = base64Data.substring(base64Data.indexOf(",")+1);
        form.append("image", base64Data);
        
        var settings = {
            async: true,
            crossDomain: true,
            url: "https://api.imgur.com/3/image",
            method: "POST",
            headers: {
                Authorization: "Client-ID 188209a74ecddfc"
            },
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: form,
            success: uploadSuccess,
            error: uploadError
        }
        $.ajax(settings);
    }
}

function uploadSuccess(result) {
    result = JSON.parse(result);
    console.log("link: ", result["data"]["link"]);
    sendPost(result["data"]["link"]);
}

function uploadError(error) {
    onError(error);
}

function transfromImage(blob) {
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        var base64Data = reader.result;
        base64Data = base64Data.substring(base64Data.indexOf(",")+1);
        sendPost(base64Data);
    }
}