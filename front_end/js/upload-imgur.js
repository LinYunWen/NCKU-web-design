var clientId = "188209a74ecddfc"

function uploadImage(blob) {
    console.log(blob.type);
    var file = new File([blob], "image", {type: "image/png", lastModified: Date.now()});
    console.log("file: ", file);
    var setting = {
        method: "POST",
        url: "https://api.imgur.com/3/image",
        headers: {
            Authorization: 'Client-ID ' + clientId,
            Accept: 'application/json'
        },
        data: {
            "image": file[0]
        },
        success: uploadSuccess,
        error: uploadError
    }

    $.ajax(setting);
}

function uploadSuccess(result) {

}

function uploadError(error) {
    onError(error);
}