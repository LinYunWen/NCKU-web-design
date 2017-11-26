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

   

    var Lon = parseFloat($("#startLon").text());
    var Lat = parseFloat($("#startLat").text());
    $("#upload-location").val('6');
    if(Lon>=120.214791 && Lon<=120.216891){
        if(Lat>=22.996430 && Lat<=22.997637)
            $("#upload-location").val('1'); // selects "guan fu"
    } 
    else if(Lon>=120.217152 && Lon<=120.218704){
            if(Lat>=22.998407 && Lat<=22.999077)
                $("#upload-location").val('2'); // selects "yuan pin"
    }
    else if(Lon>=120.215482 && Lon<=120.217182){
            if(Lat>=23.000521 && Lat<=23.001786)
                $("#upload-location").val('3'); // selects "social"
    }
    else if(Lon>=120.220100 && Lon<=120.222244){
            if(Lat>=22.995908 && Lat<=22.998956)
                $("#upload-location").val('4'); // selects "csie"
    }
    else if(Lon>=120.219007 && Lon<=120.221164){
            if(Lat>=22.992849 && Lat<=22.993531)
                $("#upload-location").val('5'); // selects "senpi"
    }
   
    
};

function geoError(error) {
    console.log('Error occurred. Error code: ' + error.code);
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
  };

  
