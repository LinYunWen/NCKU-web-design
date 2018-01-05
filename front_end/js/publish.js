Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
});

var pubishButton = document.getElementById("publish-button");
pubishButton.addEventListener("click", clickPublishButton);

function clickPublishButton(event) {
    // check for Geolocation support
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var anwser = window.confirm("Are you sure to publish?");
            console.log("anwser: ", anwser);
            if (anwser) {
                $.ajax({
                    method: "POST",
                    url: "/publish",
                    data: {
                        name: "publish",
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude
                    },
                    success: publishSuccess,
                    error: publishError
                });
                console.log("position: ", position);
                console.log("here");
                //displayNotification();
            }
        } , geoError);
        console.log('Geolocation is supported!');
    } else {
        console.log('Geolocation is not supported for this Browser/OS version yet.');
    }
}

/*
function displayNotification() {
    if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
            var options = {
                body: '地點: 自強測',
                icon: 'img/icons/logo_144.png',
                vibrate: [100, 50, 100],
                data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
                },
                actions: [
                    {action: 'explore', title: 'Explore this new world',
                    icon: 'img/icons/scan.png'},
                    {action: 'close', title: 'Close notification',
                    icon: 'img/icons/search2.png'},
                ]
            };
        reg.showNotification('有拖吊哦~', options);
      });
    }
}*/

function publishSuccess(result) {
    console.log("get publish success: ", result);
    alert("You have successfully published.");
}

function publishError(error) {
    onError(error);
}
