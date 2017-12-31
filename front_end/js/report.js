'use strict'

getIllegalPost();
getTopPost();

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

function getIllegalSuccess(result) {
    console.log("get illegal success: ", result);
    var parkingImgs = document.getElementsByClassName("illegal-parking");
    var parkingLocation = document.getElementById("lpcation-span");
    var parkingCar = document.getElementById("car-span");
    var parkingTime = document.getElementById("time-span");
    for (let i=0; i<5; i++) {
        parkingImgs[i].src = result["data"][i]["picture"];
        parkingLocation.textContent = result["data"][i]["location"];
        parkingCar.textContent = result["data"][i]["car_num"];
        parkingTime.textContent = result["data"][i]["time"];
    }
}

function getIllegalError(error) {
    onError(error);
}

function getTopSuccess(result) {
    console.log("get top success: ", result);
    var top3Imgs = document.getElementsByClassName("top3-img");
    for (let i = 0; i < 3; i++) {
        top3Imgs[i].src = result["data"][i]["picture"];
    }
}

function getTopError(error) {
    onError(error);
}

function publishSuccess(result) {
    console.log("get publish success: ", result);
    alert("You have successfully published.");
}

function publishError(error) {
    onError(error);
}

function onError(error) {
    console.log(error);
}