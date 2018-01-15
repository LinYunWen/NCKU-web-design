'use strict';

const cameraButton = document.querySelector("#use-camera");
const videoChangeButton = document.querySelector("#change-camera");
const photoImg = document.querySelector("#upload-picture-img");
const player = document.querySelector("#camera-video");
var imageBlob = undefined;
var imageCapture = undefined;
var mediaStreamTrack = undefined;

var deviceIds = [];
var deviceIndex = 0;

document.getElementById("take-photo").addEventListener("click", startTakePhoto);
document.getElementById("cross-icon").addEventListener("click", clickCrossIcon);
document.getElementById("upload-photo").addEventListener("click", clickUploadPhoto);
document.getElementById("alternative-button").addEventListener("click", clickAlternativeButton);
document.getElementById("upload-photo-input").addEventListener("change", uploadPhotoChange);
cameraButton.addEventListener("click", clickCameraButton);

function clickUploadPhoto(event) {
    document.getElementById("upload-photo-input").click();
}

function clickAlternativeButton(event) {
    setWebPageDisplay("none");
    setFixedButton("none");
    document.getElementById("upload-photo-input").click();
}

function clickCrossIcon(event) {
    stopTracks();
    setCameraDisplay("none");
    setWebPageDisplay("block");
    setFixedButton("inline-block");
}

function uploadPhotoChange(event) {
    console.log("file: ", event.target.files[0]);
    var file = event.target.files[0];
    if (file.type.includes("image")) {
        if (file.size < 5000000) {
            imageBlob = file;
            photoImg.src = URL.createObjectURL(event.target.files[0]);
            carNumRecognition(file);
            setPostSectionDisplay("inline");
        } else {
            alert("Image size cannot over 5MB.");
            setWebPageDisplay("block");
            setFixedButton("inline-block");
        }
    } else {
        alert("Please upload the image file.");
        setWebPageDisplay("block");
        setFixedButton("inline-block");
    }
    setCameraDisplay("none");
    stopTracks();
}

function clickCameraButton(event) {
    // if (!isLogin()) {
    //     return;
    // }
    try {
        start();
    } catch (e) {
        console.error(e);
        window.alert("Your device doesn't spport this service. Please use alternative button.");
        return;
    }
    setCameraDisplay("inline");
    setWebPageDisplay("none");
    setFixedButton("none");
}

function gotMedia(mediaStream) {
    player.srcObject = mediaStream;
    mediaStreamTrack = mediaStream.getVideoTracks()[0];
    console.log("video tracks: ", mediaStreamTrack);
    imageCapture = new ImageCapture(mediaStreamTrack);
    console.log("Construct: ", imageCapture);
}

function startTakePhoto(event) {
    imageCapture.takePhoto()
        .then(blob => {
            imageBlob = blob;
            carNumRecognition(blob);
            photoImg.src = URL.createObjectURL(blob);
            photoImg.onload = () => { URL.revokeObjectURL(this.src); }
        })
        .catch(error => console.error('takePhoto() error:', error));
    setCameraDisplay("none");
    setPostSectionDisplay("inline");
}

function stopTracks() {
    if (window.stream) {
        window.stream.getTracks().forEach(function(track) {
            track.stop();
        });
    }
}

function setCameraDisplay(state) {
    document.getElementById("camera").style.display = state;
    document.getElementById("take-photo").style.display = state;
    document.getElementById("change-camera").style.display = state;
    document.getElementById("upload-photo").style.display = state;
    document.getElementById("cross-icon").style.display = state;
}

function gotDevices(deviceInfos) {
    for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];

        if (deviceInfo.kind === 'videoinput') {
            deviceIds.splice(0, 0, deviceInfo.deviceId);
        }
    }
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotStream(stream) {
    window.stream = stream; // make stream available to console
    player.srcObject = stream;
    mediaStreamTrack = stream.getVideoTracks()[0];
    imageCapture = new ImageCapture(mediaStreamTrack);
}

function start() {
    stopTracks();
    var videoSource = deviceIds[deviceIndex];
    var constraints = {
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    console.log("video: ", {deviceId: videoSource ? {exact: videoSource} : undefined});
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
}

function clickChangeCameraButton(event) {
    changeCamera();
    start();
}

function changeCamera() {
    deviceIndex = (deviceIndex + 1) % deviceIds.length;
}

videoChangeButton.onclick = clickChangeCameraButton;

function handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

function isLogin() {
    if (document.getElementById("sign-out-li").style.display === "none") {
        alert("Please login.");
        return false;
    }
    return true;
}
