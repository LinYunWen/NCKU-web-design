'use strict';

const cameraButton = document.querySelector("#use-camera");
const videoChangeButton = document.querySelector("#change-camera");
const photoImg = document.querySelector("#upload-picture-img");
const player = document.querySelector("#camera-video");
var imageBlob = undefined;
var imageCapture = undefined;
var mediaStreamTrack = undefined;

var isCameraShow = false;

var deviceIds = [];
var deviceIndex = 0;

document.getElementById("take-photo").addEventListener("click", startTakePhoto);
document.getElementById("cross-icon").addEventListener("click", clickCrossIcon);
document.getElementById("upload-photo").addEventListener("click", clickUploadPhoto);
document.getElementById("upload-photo-input").addEventListener("change", uploadPhotoChange);
cameraButton.addEventListener("click", clickCameraButton);

function clickUploadPhoto(event) {
    document.getElementById("upload-photo-input").click();
}

function clickCrossIcon(event) {
    console.log("here");
    stopTracks();
    setCameraDisplay("none");
    setWebPageDisplay("block");
}

function uploadPhotoChange(event) {
    console.log("file: ", event.target.files[0]);
    photoImg.src = URL.createObjectURL(event.target.files[0]);
    setCameraDisplay("none");
    stopTracks();
    setPostSectionDisplay("inline");
}

function clickCameraButton(event) {
    start();
    if (isCameraShow) {
        // Stop all video streams.
        player.srcObject.getVideoTracks().forEach(track => track.stop());
    }
    setCameraDisplay("inline");
    setWebPageDisplay("none");
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
    window.stream.getTracks().forEach(function(track) {
        track.stop();
    });
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
  if (window.stream) {
    stopTracks();
  }
  var videoSource = deviceIds[deviceIndex];
  var constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  console.log("video: ", {deviceId: videoSource ? {exact: videoSource} : undefined});
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
  deviceIndex = (deviceIndex + 1) % deviceIds.length;
}

videoChangeButton.onclick = start;



function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}
