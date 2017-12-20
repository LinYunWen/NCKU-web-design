function addRecord(info) {
    var container = document.getElementById("record-contain");
    var record = document.createElement("div");
    var size = [1, 2, 2, 2, 1, 2, 1, 1];
    record.classList.add("row");

    for (let i = 0; i < 8; i++) {
        var div = document.createElement("div");
        div.classList.add("col-md-" + size[i].toString());
        var span = document.createElement("span");
        if (i >= 0 && i < 7) {
            span.textContent = info[i-1];
        } else {
            var input = document.createElement("input");
            input.type = "button";
            setUpdateButton(info[0], input);
            span.appendChild(input);
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

function setUpdateButton(id, input) {
    input.value = "update...";
    input.id = `update-${id}`;
    input.addEventListener("click", clickUpdate);
}

function clickUpdate(event) {
    var update = event.target;
    var id = update.id.substring(update.id.indexOf("-") + 1);
    updateStatus(id, status);
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
    
}

function updateStatusError(error) {
    console.log("error: ", error);
}