Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
});

// document.getElementById("publish-button").addEventListener("click", displayNotification);

var pubishButton = document.getElementById("publish-button");
pubishButton.addEventListener("click", clickPublishButton);

function clickPublishButton(event) {
    var anwser = alert("Are you sure to publish?");
    if (anwser) {
        $.ajax({
            method: "POST",
            url: "",
            data: {
                name: "publish",
                longitude: 312,
                latitude: 12
            },
            success: publicSuccess,
            error: publicError
        });
    }
}

function displayNotification() {
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        var options = {
            body: 'Here is a notification body!',
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
        reg.showNotification('Hello world!', options);
      });
    }
}

function pubishSuccess(result) {
    
}
    
function publishError(error) {
    onError(error);
}
