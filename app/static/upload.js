function uploadMaps() {
    var data = new FormData();
    var trHTML = '';
    var tagData = '';
    tagData = document.getElementById("mapTags");
    tagData = tagData.value;
    mapDesc = document.getElementById("usermapdescription")
    mapDesc = mapDesc.value;

    data.append("files", document.getElementById("mapFile").files[0]);
    data.append("files", document.getElementById("variantFile").files[0]);
    data.append("mapTags", tagData);
    data.append("mapUserDesc", mapDesc);

    images = document.getElementById("formFileMultiple").files

    for (let i = 0; i < images.length; i++) {
        data.append("files", images[i]);
    }

    var xhr = new XMLHttpRequest();
    var bearer_token = "Bearer " + token;

    //xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (xhr.status == 200) {
                trHTML += '<div class="alert alert-success" role="alert">';
                trHTML += 'Success!';
                trHTML += '</div>'
                document.getElementById("map-container").innerHTML = trHTML;
                $('#map-upload').modal('hide');

                delayRedirect();
            } else if (xhr.status != 200) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += '' + this.responseText + '';
                trHTML += '</div>'
                document.getElementById("map-container").innerHTML = trHTML;
                $('#map-upload').modal('hide');
            }
        }
    });

    xhr.open("POST", "/api_v2/upload/map");
    xhr.setRequestHeader("Authorization", bearer_token);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(data);
}

function uploadMods() {
    var formData = new FormData();
    var trHTML = '';
    var tagData = '';

    const progressBar = document.getElementById('progress-bar');
    let uploadPercentage = 0;

    tagData = document.getElementById("modTags");
    tagData = tagData.value;
    modDesc = document.getElementById("modDescription")
    modDesc = modDesc.value;

    formData.append("files", document.getElementById("modFile").files[0]);
    formData.append("modTags", tagData);
    formData.append("modDescription", modDesc);

    images = document.getElementById("modFileMultiple").files

    for (let i = 0; i < images.length; i++) {
        formData.append("files", images[i]);
    }

    var bearer_token = "Bearer " + token;

    $.ajax({
	url: '/api_v2/upload/mod',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
	headers: {
        'Authorization': bearer_token
        },
        xhr: function () {
            const myXhr = $.ajaxSettings.xhr();
            myXhr.open('POST', '/api_v2/upload/mod');

            if (myXhr.upload) {
                myXhr.upload.onprogress = function (event) {
                    uploadPercentage = Math.round((event.loaded / event.total) * 100);
                    progressBar.style.width = uploadPercentage + '%';
                };
             }
            return myXhr;
        },
        success: function (response) {
            console.log('File uploaded successfully!', response);
            trHTML += '<div class="alert alert-success" role="alert">';
            trHTML += 'Success!';
            trHTML += '</div>'
            document.getElementById("map-container").innerHTML = trHTML;
            $('#mod-upload').modal('hide');

            delayRedirect();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log('File upload failed.', jqXhr.status, textStatus, errorThrown);
            trHTML += '<div class="alert alert-danger" role="alert">';
            trHTML += 'Upload failed: ' + jqXhr.status + '';
            trHTML += '</div>'
            document.getElementById("map-container").innerHTML = trHTML;
            $('#mod-upload').modal('hide');
        }
    });
}


function uploadPrefab() {
    var data = new FormData();
    var trHTML = '';
    var tagData = '';

    tagData = document.getElementById("prefabTags");
    tagData = tagData.value;
    prefabDesc = document.getElementById("userprefabDesc")
    prefabDesc = userprefabDesc.value;

    data.append("files", document.getElementById("prefabFile").files[0]);
    data.append("prefabTags", tagData);
    data.append("prefabDesc", prefabDesc);

    images = document.getElementById("prefabFileMultiple").files

    for (let i = 0; i < images.length; i++) {
        data.append("files", images[i]);
    }

    var xhr = new XMLHttpRequest();
    var bearer_token = "Bearer " + token;

    //xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (xhr.status == 200) {
                trHTML += '<div class="alert alert-success" role="alert">';
                trHTML += 'Success!';
                trHTML += '</div>'
                document.getElementById("map-container").innerHTML = trHTML;
                $('#prefab-upload').modal('hide');
                delayRedirect();

            } else if (xhr.status != 200) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += '' + this.responseText + '';
                trHTML += '</div>'
                document.getElementById("map-container").innerHTML = trHTML;
                $('#prefab-upload').modal('hide');
            }
        }
    });

    xhr.open("POST", "/api_v2/upload/prefab");
    xhr.setRequestHeader("Authorization", bearer_token);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(data);
}
