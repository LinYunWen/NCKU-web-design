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
    var x=0,y=0;
    
    if (lon > 120.214941 && lon <= 120.218740) {
        x=1;
    } 
    else if (lon > 120.218740 && lon <= 120.222321) {
        x=2;
    }
    else if (lon > 120.222321 && lon <= 120.224685) {
        x=3;
    }


    if (lat > 23.001407 && lat <= 23.003730) {
        y=1;
    } 
    else if (lat > 22.999900 && lat <= 23.001407) {
        y=2;
    }
    else if(lat > 22.997557 && lat <= 22.999900) {
        y=3;
    }
    else if(lat > 22.995941 && lat <= 22.997557) {
        y=4;
    }
    else if(lat > 22.992533 && lat <= 22.995941) {
        y=5;
    }
    

    if(x==1 && y==1){
        $("#upload-location").val('3'); // selects "social"
        console.log('society');
    }
    else if(x==1 && y==2){
        console.log('tree park');
    }
    else if(x==1 && y==3){
        $("#upload-location").val('2'); // selects "yuan pin"
        console.log('cloud');
    }
    else if(x==1 && y==4){
        console.log('tree park');$("#upload-location").val('1'); // selects "guan fu"
        console.log('guanfu');
    }
    else if(x==1 && y==5){
        console.log('new parking');
    }

    else if(x==2 && y==1){
        console.log('hospital');
    }
    else if(x==2 && y==2){
        console.log('library');
    }
    else if(x==2 && y==3){
        console.log('big street');
    }
    else if(x==2 && y==4){
        $("#upload-location").val('4'); // selects "csie"
        console.log('csie');
    }
    else if(x==2 && y==5){
        $("#upload-location").val('5'); // selects "senli"
        console.log('win');
    }

    else if(x==3 && y==1){
        console.log('gin ya');
    }
    else if(x==3 && y==2){
        console.log('ball');
    }
    else if(x==3 && y==3){
        console.log('big street');
    }
    else if(x==3 && y==4){
        console.log('ee');
    }
    else if(x==3 && y==5){
        console.log('iaa');
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
    console.log("id: ", id);
    switch (parseInt(id)) {
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
