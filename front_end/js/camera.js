navigator.mediaDevices.getUserMedia({video: true})
  .then(gotMedia)
  .catch(error => console.error('getUserMedia() error:', error));

function gotMedia(mediaStream) {
  mediaStreamTrack = mediaStream.getVideoTracks()[0];
  imageCapture = new ImageCapture(mediaStreamTrack);
  console.log("Construct: ", imageCapture);
}

const img = document.querySelector('img');
imageCapture = undefined;
mediaStreamTrack = undefined;

document.getElementById("test").addEventListener("click", startTakePhoto);

function startTakePhoto(event) {
    imageCapture.takePhoto()
    .then(blob => {
      img.src = URL.createObjectURL(blob);
      img.onload = () => { URL.revokeObjectURL(this.src); }
    })
    .catch(error => console.error('takePhoto() error:', error));
}