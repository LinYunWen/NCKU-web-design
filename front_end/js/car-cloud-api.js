'use strict'

function carNumRecognition(blob) {
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        var base64Data = reader.result;
        // var form = new FormData();
        base64Data = base64Data.substring(base64Data.indexOf(",")+1);
        // form.append("image", base64Data);
        
        var settings = {
            async: true,
            crossDomain: true,
            url: "https://api.openalpr.com/v2/recognize_bytes?secret_key=sk_0a54ed4196ae68cbaf9d978e&recognize_vehicle=0&country=us&return_image=0&topn=10",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: base64Data,
            success: carNumRecognitionSuccess,
            error: carNumRecognitionError
        }
        $.ajax(settings);
    }
}

function carNumRecognitionSuccess(result) {
    result = JSON.parse(result);
    var cars = result["results"];
    if (cars.length > 0) {
        var maxConfidence = 0;
        var carNum = "";
        for (let i = 0; i < cars.length; i++) {
            if (maxConfidence < cars[i]["confidence"]) {
                maxConfidence = cars[i]["confidence"];
                carNum = cars[i]["plate"];
            }
            console.log(cars[i]["plate"]);
            console.log(cars[i]["confidence"]);
        }
        $("#upload-car-num").val(carNum);
    } else {
        console.log("no result");
    }
}

function carNumRecognitionError(error) {
    onError(error);
}