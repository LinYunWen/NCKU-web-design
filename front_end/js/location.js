// check for Geolocation support
if (navigator.geolocation) {
    window.onload = function() {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    };
    console.log('Geolocation is supported!');
} else {
    console.log('Geolocation is not supported for this Browser/OS version yet.');
}

function geoSuccess(position) {
    var startPos = position;
    document.getElementById('startLat').textContent = startPos.coords.latitude;
    document.getElementById('startLon').textContent = startPos.coords.longitude;
};

function geoError(position) {
    console.log('Error occurred. Error code: ' + error.code);
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
  };