var selectText = ["10分鐘內處理", "20分鐘內處理", "處理完畢", "其他"];
var recordKey = ["id", "time", "picture", "parking", "processStatus", "processTime", "processPerson"];

setTimeStamps();
getRecords();
autoReflesh();
getSession();

function addRecord(info) {
    console.log("info: ", info);
    var container = document.getElementById("record-contain");
    var record = document.createElement("div");
    var size = [1, 2, 3, 1, 1, 2, 1, 1];
    record.classList.add("row");
    record.id = `record-${info["id"]}`;

    for (let i = 0; i < 8; i++) {
        var div = document.createElement("div");
        div.classList.add("col-md-" + size[i].toString());
        var span = document.createElement("span");
        if (i >= 0 && i < 7) {
            if (i == 2) {
                var img = addImage(info[recordKey[i]]);
                span.appendChild(img);
            } else {
                span.textContent = info[recordKey[i]];
            }
        } else {
            var select = document.createElement("select");
            select.classList.add("form-control");
            select.id = `update-${info["id"]}`;
            setUpdateSelect(info["id"], select);
            span.appendChild(select);
        }
        div.appendChild(span);
        record.appendChild(div);
    }
    container.appendChild(record);
}

function getRecords() {
    $.ajax({
        method: "GET",
        url: "/get_records",
        data: {
        },
        success: getRecordsSuccess,
        error: getRecordsError
    });
}

function getRecordsSuccess(result) {
    console.log("result: ", result);
    for (let i = 0; i < result.data.length; i++) {
        addRecord(result.data[i]);
    }
}

function getRecordsError(error) {
    console.log("error: ", error);
}

function setUpdateSelect(id, select) {
    for (let i = 0; i < 4; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.textContent = selectText[i];
        select.appendChild(option);
    }
    select.addEventListener("change", changeUpdate);
}

function changeUpdate(event) {
    var update = event.target;
    var id = update.id.substring(update.id.indexOf("-") + 1);
    updateStatus(id, selectText[update.value]);
    console.log("id: ", id, selectText[update.value]);
}

function updateStatus(id, status) {
    $.ajax({
        method: "POST", 
        url: "update_status",
        data: {
            id: id,
            status: status
        },
        success: updateStatusSuccess,
        error: updateStatusError
    });
}

function updateStatusSuccess(result) {
    console.log("success: ", result);
    if (result.result == 1) {
         document.getElementById(`record-${result.data.id}`).getElementsByTagName("div")[4].textContent = result.data.status;
         if (result.data.status == "處理完畢") {
            document.getElementById(`record-${result.data.id}`).getElementsByTagName("div")[5].textContent = result.data.time;
         }
    } else {
        alert("fail to update status");
    }
}

function updateStatusError(error) {
    console.log("error: ", error);
    alert("fail to update status");
}

function autoReflesh() {
    setInterval(function() {
        location.reload();
    }, 300000);
}

function setTimeStamps() {
    var d = new Date();
    var year = d.getFullYear().toString();
    var month = d.getMonth().toString();
    var date = d.getDate().toString();
    var hour = d.getHours().toString();
    var minute = d.getMinutes().toString();
    document.getElementById("time-stamps").textContent = `更新時間： ${year}/${month+1}/${date} ${hour}:${minute}`;
}

function addImage(url) {
    var img = document.createElement("img");
    img.src = url;
    img.classList.add("post-image");
    return img;
}


document.getElementById("sign-out-h3").addEventListener("click", clickSignOut);

function clickSignOut(event) {
    event.preventDefault();
    $.ajax({
        method: "POST",
        url: "/signout",
        data: {
            command: "sign-out"
        },
        success: signOutSuccess,
        error: signOutError
    });
}

function signOutSuccess(result) {
    if (result["result"] == 1) {
        alert("You have successfully signed out.");
        location.replace("/");
    } else {
        alert("Error on signing out.");
    }
}

function signOutError(error) {
    onError(error);
}

function getSession() {
    $.ajax({
        method: "GET",
        url: "/get_session",
        data: {
        },
        success: getSessionSuccess,
        error: getSessionError
    });
}

function getSessionSuccess(result) {
    if (result["signin_status"]) {
        var account = document.getElementById("account-name");
        account.value = result["account"];
        document.getElementById("account").textContent = result["account"];
    }
}

function getSessionError(error) {
    onError(error);
}

function onError(error) {
    console.log(error);
}