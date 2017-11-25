const cameraButton = document.querySelector("#use-camera");
// const photoImg = document.querySelector("#take-photo");
const photoImg = document.querySelector("#upload-picture-img");
const player = document.querySelector("#camera-video");
imageCapture = undefined;
mediaStreamTrack = undefined;

var isCameraShow = false;

document.getElementById("take-photo").addEventListener("click", startTakePhoto);
cameraButton.addEventListener("click", clickCameraButton);

function clickCameraButton(event) {
    if (cameraButton.value == "Start Camera") {
        navigator.mediaDevices.getUserMedia({video: true})
            .then(gotMedia)
            .catch(error => console.error('getUserMedia() error:', error));
        cameraButton.value = "Stop Camera";
    } else {
        // Stop all video streams.
        player.srcObject.getVideoTracks().forEach(track => track.stop());
        cameraButton.value = "Start Camera";
    }
    tuggleCamera();
}

function gotMedia(mediaStream) {
    player.srcObject = mediaStream;
    mediaStreamTrack = mediaStream.getVideoTracks()[0];
    imageCapture = new ImageCapture(mediaStreamTrack);
    console.log("Construct: ", imageCapture);
}

function startTakePhoto(event) {
    imageCapture.takePhoto()
        .then(blob => {
            photoImg.src = URL.createObjectURL(blob);
            photoImg.onload = () => { URL.revokeObjectURL(this.src); }
        })
        .catch(error => console.error('takePhoto() error:', error));
    tuggleCamera();
}

function tuggleCamera() {
    var state = isCameraShow ? "none" : "inline";
    document.getElementById("camera").style.display = state;
    document.getElementById("take-photo").style.display = state;
    isCameraShow = !isCameraShow;
}