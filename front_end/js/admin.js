var selectText = ["10分鐘內處理", "20分鐘內處理", "處理完畢", "其他"];

function addRecord(info) {
    var container = document.getElementById("record-contain");
    var record = document.createElement("div");
    var size = [1, 2, 2, 2, 1, 2, 1, 1];
    record.classList.add("row");
    record.id = `record-${info[0]}`;

    for (let i = 0; i < 8; i++) {
        var div = document.createElement("div");
        div.classList.add("col-md-" + size[i].toString());
        var span = document.createElement("span");
        if (i >= 0 && i < 7) {
            span.textContent = info[i];
        } else {
            var select = document.createElement("select");
            select.classList.add("form-control");
            select.id = `update-${info[0]}`;
            setUpdateSelect(info[0], select);
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
        url: "",
        data: {
        },
        success: getRecordsSuccess,
        error: getRecordsError
    });
}

function getRecordsSuccess(result) {
    for (let i = 0; i < result.length; i++) {
        addRecord(result[i]);
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
        url: "",
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
         document.getElementById(`row-${result.data.id}`).getElementsByTagName("div")[4].textContent = result.data.status;
         if (result.data.status == "處理完畢") {
            document.getElementById(`row-${result.data.id}`).getElementsByTagName("div")[5].textContent = result.data.time;
         }
    } else {
        alert("fail to update status");
    }
}

function updateStatusError(error) {
    console.log("error: ", error);
    alert("fail to update status");
}