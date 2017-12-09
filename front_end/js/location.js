'use strict'

function getLocation() {
    // check for Geolocation support
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
        console.log('Geolocation is supported!');
    } else {
        console.log('Geolocation is not supported for this Browser/OS version yet.');
    }
}

function geoSuccess(position) {
    document.getElementById('startLat').textContent = position.coords.latitude;
    document.getElementById('startLon').textContent = position.coords.longitude;
    setSelection(position.coords.longitude, position.coords.latitude);
};

function geoError(error) {
    console.log('Error occurred. Error code: ' + error.code);
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
};

function setSelection(lon, lat) {
    // initial location
    $("#upload-location").val('6');
    if (lon >= 120.214791 && lon <= 120.216891) {
        if (lat >= 22.996430 && lat <= 22.997637) {
            $("#upload-location").val('1'); // selects "guan fu"
        }
    } 
    else if (lon >= 120.217152 && lon <= 120.218704) {
        if (lat >= 22.998407 && lat <= 22.999077) {
            $("#upload-location").val('2'); // selects "yuan pin"
        }
    }
    else if (lon >= 120.215482 && lon <= 120.217182) {
        if(lat >= 23.000521 && lat <= 23.001786) {
            $("#upload-location").val('3'); // selects "social"
        }
    }
    else if (lon >= 120.220100 && lon <= 120.222244) {
        if (lat >= 22.995908 && lat <= 22.998956) {
            $("#upload-location").val('4'); // selects "csie"
        }
    }
    else if (lon >= 120.219007 && lon <= 120.221164) {
        if (lat >= 22.992849 && lat <= 22.993531) {
            $("#upload-location").val('5'); // selects "senli"
        }
    }
}

function getLonAndLat() {
    return [parseFloat($("#startLon").text()), parseFloat($("#startLat").text())];
}

// 1: guan fu
// 2: yuan pin
// 3: social
// 4: csie
// 5: senli
// 6: others
function parseToWord(id) {
    switch (id) {
        case 1:
            return "guan-fu";
            break;
        case 2:
            return "yuan-pin";
            break;
        case 3:
            return "social";
            break;
        case 4:
            return "csie";
            break;
        case 5:
            return "senli";
            break;
        case 6:
            return "others";
            break;
        default:
            return "error";
            break;
    }
}
