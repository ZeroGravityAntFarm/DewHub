token = getCookie("Authorization")


document.getElementById('search_bar').addEventListener('keypress', function () {
    searchMaps();
});


function generatePagination(pages, current, type) {
    var last = pages;
    var delta = 2;
    var left = current - delta;
    var right = current + delta + 1;
    var trHTML = "";

    if (current > 1) {
        prevpage = current - 1;
    }
    else {
        prevpage = current;
    }

    if (current < pages) {
        nextpage = current + 1;
    }
    else {
        nextpage = current;
    }

    trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark" href="javascript:' + type + '(' + prevpage + ');">Previous</a></li>';

    for (let i = 1; i <= last; i++) {
        if (i == left && left > delta - 1) {
            if (current == i) {
                trHTML += '<li class="page-item active"><a class="page-link bg-dark" href="javascript:' + type + '(' + 1 + ');">' + 1 + '</a></li>';
            }
            else {
                trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark" href="javascript:' + type + '(' + 1 + ');">' + 1 + '</a></li>';
            }

            if (left != delta) {
                trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark">...</a></li>';
            }
        }

        if (i >= left && i < right) {
            if (current == i) {
                trHTML += '<li class="page-item active"><a class="page-link bg-dark" href="javascript:' + type + '(' + i + ');">' + i + '</a></li>';
            }
            else {
                trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark" href="javascript:' + type + '(' + i + ');">' + i + '</a></li>';
            }
        }

        if (i == right) {
            if (right != last) {
                trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark">...</a></li>';
            }

            if (current == i) {
                trHTML += '<li class="page-item active"><a class="page-link bg-dark" href="javascript:' + type + '(' + last + ');">' + last + '</a></li>';
            }
            else {
                trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark" href="javascript:' + type + '(' + last + ');">' + last + '</a></li>';
            }
        }
    }

    trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark" href="javascript:' + type + '(' + nextpage + ');">Next</a></li>';

    return trHTML;
}


function generateQueryPagination(pages, current, type, query) {
    var last = pages;
    var delta = 2;
    var left = current - delta;
    var right = current + delta + 1;
    var trHTML = "";

    if (current > 1) {
        prevpage = current - 1;
    }
    else {
        prevpage = current;
    }

    if (current < pages) {
        nextpage = current + 1;
    }
    else {
        nextpage = current;
    }

    trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark" href="javascript:' + type + '(' + prevpage + ',  &quot;' + query + '&quot;)">Previous</a></li>';

    for (let i = 1; i <= last; i++) {
        if (i == left && left > delta - 1) {
            if (current == i) {
                trHTML += '<li class="page-item active"><a class="page-link bg-dark" href="javascript:' + type + '(' + 1 + ',  &quot;' + query +'&quot;)">' + 1 + '</a></li>';
            }
            else {
                trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark" href="javascript:' + type + '(' + 1 + ',  &quot;' + query + '&quot;)">' + 1 + '</a></li>';
            }

            if (left != delta) {
                trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark">...</a></li>';
            }
        }

        if (i >= left && i < right) {
            if (current == i) {
                trHTML += '<li class="page-item active"><a class="page-link bg-dark" href="javascript:' + type + '(' + i + ',  &quot;' + query + '&quot;)">' + i + '</a></li>';
            }
            else {
                trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark" href="javascript:' + type + '(' + i + ',  &quot;' + query + '&quot;)">' + i + '</a></li>';
            }
        }

        if (i == right) {
            if (right != last) {
                trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark">...</a></li>';
            }

            if (current == i) {
                trHTML += '<li class="page-item active"><a class="page-link bg-dark" href="javascript:' + type + '(' + last + ',  &quot;' + query + '&quot;)">' + last + '</a></li>';
            }
            else {
                trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark" href="javascript:' + type + '(' + last + ',  &quot;' + query + '&quot;)">' + last + '</a></li>';
            }
        }
    }

    trHTML += '<li class="page-item bg-dark"><a class="page-link bg-dark" href="javascript:' + type + '(' + nextpage + ',  &quot;' + query + '&quot;)">Next</a></li>';

    return trHTML;
}


function searchMapsQuery(page = 1, queryParam) {
    scroll(0, 0);
    var trHTML = '';
    const xhttp = new XMLHttpRequest();
    var searchQuery = queryParam;
    console.log(searchQuery);
    xhttp.open("GET", "https://api.zgaf.io/api_v1/maps/search/" + searchQuery + "?page=" + page + "&size=21");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(this.responseText);

            if (data == null || data == undefined) {
                trHTML += '<div class="alert alert-warning" role="alert">';
                trHTML += 'No results found';
                trHTML += '</div>'
                document.getElementById("map-cards").innerHTML = trHTML;

                return

            } else {
                trHTML = '';
                document.getElementById("map-cards").innerHTML = trHTML;

            }

            for (let [i, object] of data["items"].entries()) {

                var udate = new Date(object["time_created"]);
                var timeAgo = timeSince(udate);

                trHTML += '<div class="card mb-3 text-white bg-dark">';
                trHTML += '<div class="row g-0">';
                trHTML += '<div class="col-md-4">';
                trHTML += '<a href="https://api.zgaf.io/api_v1/mapview?mapId=' + object['id'] + '"><img src="https://api.zgaf.io/static/maps/tb/' + object['id'] + '/0" class="card-img h-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
                trHTML += '</div>';
                trHTML += '<div class="col-md-8">';
                trHTML += '<div class="card-body">';
                trHTML += '<h3 class="card-title">' + object['mapName'] + '</h3>';
                trHTML += '<h5 class="card-title">Author: ' + object['mapAuthor'] + '</h5>';
                trHTML += '<h5 class="card-title">Type: ' + object['mapTags'] + '</h5>';
                trHTML += '<p class="card-text">' + object['mapDescription'] + '</p>';
                trHTML += '<p class="card-text"><small class="text-muted">Uploaded ' + timeAgo + ' ago</small></p>';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['id'] + '/file" class="btn btn-primary me-1">Map File</a>';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['id'] + '/variant/file" class="btn btn-primary me-1">Variant File</a>';
                trHTML += '<div class="card-footer"><small class="text-muted bi-person-down"> ' + object['map_downloads'] + '</small></div>';
                trHTML += '</div>';
                trHTML += '</div>';
                trHTML += '</div>';
                trHTML += '</div>';

            }

            trHTML += '<nav aria-label="Map Navigation">';
            trHTML += '<ul class="pagination">';

            //Calculate the number of pages
            pages = Math.ceil(data["total"] / data["size"]);
            current = data["page"];

            trHTML += generateQueryPagination(pages, current, "searchMapsQuery", queryParam);

            trHTML += '</ul>';
            trHTML += '</nav>';
        }
        document.getElementById("map-cards").innerHTML = trHTML;
    }
}

function searchMaps(page = 1) {
    scroll(0, 0);
    var trHTML = '';
    const xhttp = new XMLHttpRequest();
    var searchQuery = document.getElementById('search_bar').value;
    console.log(searchQuery);
    xhttp.open("GET", "https://api.zgaf.io/api_v1/maps/search/" + searchQuery + "?page=" + page + "&size=21");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(this.responseText);

            if (data == null || data == undefined) {
                trHTML += '<div class="alert alert-warning" role="alert">';
                trHTML += 'No results found';
                trHTML += '</div>'
                document.getElementById("map-cards").innerHTML = trHTML;

                return

            } else {
                trHTML = '';
                document.getElementById("map-cards").innerHTML = trHTML;

            }

            for (let [i, object] of data["items"].entries()) {

                var udate = new Date(object["time_created"]);
                var timeAgo = timeSince(udate);

                trHTML += '<div class="card mb-3 text-white bg-dark">';
                trHTML += '<div class="row g-0">';
                trHTML += '<div class="col-md-4">';
                trHTML += '<a href="https://api.zgaf.io/api_v1/mapview?mapId=' + object['id'] + '"><img src="https://api.zgaf.io/static/maps/tb/' + object['id'] + '/0" class="card-img h-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
                trHTML += '</div>';
                trHTML += '<div class="col-md-8">';
                trHTML += '<div class="card-body">';
                trHTML += '<h3 class="card-title">' + object['mapName'] + '</h3>';
                trHTML += '<h5 class="card-title">Author: ' + object['mapAuthor'] + '</h5>';
                trHTML += '<h5 class="card-title">Type: ' + object['mapTags'] + '</h5>';
                trHTML += '<p class="card-text">' + object['mapDescription'] + '</p>';
                trHTML += '<p class="card-text"><small class="text-muted">Uploaded ' + timeAgo + ' ago</small></p>';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['id'] + '/file" class="btn btn-primary me-1">Map File</a>';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['id'] + '/variant/file" class="btn btn-primary me-1">Variant File</a>';
                trHTML += '<div class="card-footer"><small class="text-muted bi-person-down"> ' + object['map_downloads'] + '</small></div>';
                trHTML += '</div>';
                trHTML += '</div>';
                trHTML += '</div>';
                trHTML += '</div>';

            }

            trHTML += '<nav aria-label="Map Navigation">';
            trHTML += '<ul class="pagination">';

            //Calculate the number of pages
            pages = Math.ceil(data["total"] / data["size"]);
            current = data["page"];

            trHTML += generatePagination(pages, current, "searchMaps");

            trHTML += '</ul>';
            trHTML += '</nav>';
        }
        document.getElementById("map-cards").innerHTML = trHTML;
    }
}

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

    xhr.open("POST", "https://api.zgaf.io/api_v1/upload/map");
    xhr.setRequestHeader("Authorization", bearer_token);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(data);
}

function uploadMods() {
    var data = new FormData();
    var trHTML = '';
    var tagData = '';
    var tpHTML = '';

    tpHTML += '<div class="spinner-border" role="status">';
    //tpHTML += '<span class="sr-only"></span>';
    tpHTML += '</div>';

    document.getElementById("spinnyboi").innerHTML = tpHTML;

    tagData = document.getElementById("modTags");
    tagData = tagData.value;
    modDesc = document.getElementById("modDescription")
    modDesc = modDesc.value;

    data.append("files", document.getElementById("modFile").files[0]);
    data.append("modTags", tagData);
    data.append("modDescription", modDesc);

    images = document.getElementById("modFileMultiple").files

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
                $('#mod-upload').modal('hide');

                delayRedirect();
                
            } else if (xhr.status != 200) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += '' + this.responseText + '';
                trHTML += '</div>'
                document.getElementById("map-container").innerHTML = trHTML;
                $('#mod-upload').modal('hide');
            }
        }
    });

    xhr.open("POST", "https://api.zgaf.io/api_v1/upload/mod");
    xhr.setRequestHeader("Authorization", bearer_token);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(data);
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

    xhr.open("POST", "https://api.zgaf.io/api_v1/upload/prefab");
    xhr.setRequestHeader("Authorization", bearer_token);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(data);
}


function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}


function userLogin() {
    var trHTML = ''
    if (token) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "https:////api.zgaf.io/api_v1/me", false);
        bearer_token = "Bearer " + token
        xmlHttp.setRequestHeader("Authorization", bearer_token);
        xmlHttp.send();
        const user = JSON.parse(xmlHttp.responseText);

        if (xmlHttp.status == 200) {
            trHTML += '<button type="button" data-bs-toggle="modal" data-bs-target="#mod-upload" class="btn btn-outline-info me-1"><i class="bi bi-code-square"></i></button>'
            trHTML += '<button type="button" data-bs-toggle="modal" data-bs-target="#prefab-upload" class="btn btn-outline-info me-1"><i class="bi bi-grid"></i></button>'
            trHTML += '<button type="button" data-bs-toggle="modal" data-bs-target="#map-upload" class="btn btn-outline-info me-1"><i class="bi bi-map"></i></button>'
            trHTML += '<a href="/profile" class="btn btn-outline-primary me-1">' + user["name"] + '</a>'
            trHTML += '<a href="/" onclick="logout();" class="btn btn-outline-danger me-1">Logout</a>'

        } else {
            trHTML += '<a href="/login" class="btn btn-outline-primary me-1">Login</a>'
            trHTML += '<a href="/register" class="btn btn-outline-primary me-1">Register</a>'
        }
        document.getElementById("user-prof").innerHTML = trHTML;
    } else {

        trHTML += '<a href="/login" class="btn btn-outline-primary me-1">Login</a>'
        trHTML += '<a href="/register" class="btn btn-outline-primary me-1">Register</a>'
        document.getElementById("user-prof").innerHTML = trHTML;
    }
}

function logout() {
    setCookie("Authorization", "", 1)
    window.location.href = "/";
}

function loadCards(page = 1) {
    scroll(0, 0);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/maps/?page=" + page + "&size=21");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            const data = JSON.parse(this.responseText);
            for (let [i, object] of data["items"].entries()) {

                if (i % 3 === 0) {
                    trHTML += '</div>';
                    trHTML += '<div class="row top-buffer">';
                }

                var udate = new Date(object["time_created"]);
                var timeAgo = timeSince(udate);

                trHTML += '<div class="col mb-3 mt-4">';
                trHTML += '<div class="card text-white bg-dark" >';
                trHTML += '<a href="https://api.zgaf.io/api_v1/mapview?mapId=' + object['id'] + '"><img src="https://api.zgaf.io/static/maps/tb/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
                trHTML += '<div class="card-body">';
                trHTML += '<h4 class="card-title">' + object['mapName'] + '</h4>';
                trHTML += '<h5 class="card-title">Author: ' + object['mapAuthor'] + '</h5>';
                trHTML += '<h5 class="card-title">Type: ' + object['mapTags'] + '</h5>';
                trHTML += '<h5 class="card-title">Uploaded ' + timeAgo + ' ago</h5>';
                trHTML += '</div>';
                trHTML += '<div>';
                trHTML += '<p class="card-text  p-3">' + object['mapDescription'] + '</p>';
                trHTML += '</div>'
                trHTML += '</ul>';
                trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['id'] + '/file" class="btn btn-primary me-1">Map File</a>';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['id'] + '/variant/file" class="btn btn-primary me-1">Variant File</a>';
                trHTML += '</div>';
                trHTML += '<div class="card-footer"><small class="text-muted bi-person-down"> ' + object['map_downloads'] + '</small></div>';
                trHTML += '</div>';
                trHTML += '</div>';
            }

            trHTML += '<nav aria-label="Map Navigation">';
            trHTML += '<ul class="pagination">';

            //Calculate the number of pages
            pages = Math.ceil(data["total"] / data["size"]);
            current = data["page"];

            trHTML += generatePagination(pages, current, "loadCards");
            
            trHTML += '</ul>';
            trHTML += '</nav>';
        }
        document.getElementById("map-cards").innerHTML = trHTML;
    }
}

function loadVCards(page = 1) {
    scroll(0, 0);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/variants/?page=" + page + "&size=21");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            const data = JSON.parse(this.responseText);
            for (let [i, object] of data["items"].entries()) {

                if (i % 3 === 0) {
                    trHTML += '</div>';
                    trHTML += '<div class="row top-buffer">';
                }


                var imageType = object["variantFileName"].split(".")
                var udate = new Date(object["time_created"]);
                var timeAgo = timeSince(udate);

                trHTML += '<div class="col mb-3 mt-4">';
                trHTML += '<div class="card text-white bg-dark" >';
                trHTML += '<a href="https://api.zgaf.io/api_v1/variantview?varId=' + object['id'] + '"><img src="https://api.zgaf.io/static/content/variants/' + imageType[1] + '.png" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
                trHTML += '<div class="card-body">';
                trHTML += '<h4 class="card-title">' + object['variantName'] + '</h4>';
                trHTML += '<h5 class="card-title">Author: ' + object['variantAuthor'] + '</h5>';
                trHTML += '<h5 class="card-title">Uploaded ' + timeAgo + ' ago</h5>';
                trHTML += '</div>';
                trHTML += '<p class="card-text p-3">' + object['variantDescription'] + '</p>';
                trHTML += '</ul>';
                trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
                trHTML += '<a href="https://api.zgaf.io/api_v1/variants/' + object['id'] + '/file" class="btn btn-primary me-1">Variant File</a>';
                trHTML += '</div>';
                trHTML += '<div class="card-footer"><small class="text-muted bi-person-down"> ' + object['downloads'] + '</small></div>';
                trHTML += '</div>';
                trHTML += '</div>';

            }
            trHTML += '<nav aria-label="Map Navigation">';
            trHTML += '<ul class="pagination">';

            //Calculate the number of pages
            pages = Math.ceil(data["total"] / data["size"]);
            current = data["page"];

            trHTML += generatePagination(pages, current, "loadVCards");

            trHTML += '</ul>';
            trHTML += '</nav>';
        }
        document.getElementById("map-cards").innerHTML = trHTML;
    }
}

function loadPCards(page = 1) {
    scroll(0, 0);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/prefabs?page=" + page + "&size=21");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            const data = JSON.parse(this.responseText);
            for (let [i, object] of data["items"].entries()) {

                if (i % 3 === 0) {
                    trHTML += '</div>';
                    trHTML += '<div class="row top-buffer">';
                }

                var udate = new Date(object["time_created"]);
                var timeAgo = timeSince(udate);

                trHTML += '<div class="col mb-3 mt-4">';
                trHTML += '<div class="card text-white bg-dark" >';
                trHTML += '<a href="https://api.zgaf.io/api_v1/prefabview?prefabId=' + object['id'] + '"><img src="https://api.zgaf.io/static/prefabs/tb/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
                trHTML += '<div class="card-body">';
                trHTML += '<h4 class="card-title">' + object['prefabName'] + '</h4>';
                trHTML += '<h5 class="card-title">Author: ' + object['prefabAuthor'] + '</h5>';
                trHTML += '<h5 class="card-title">Uploaded ' + timeAgo + ' ago</h5>';
                trHTML += '</div>';
                trHTML += '<p class="card-text p-3">' + object['prefabDescription'] + '</p>';
                trHTML += '</ul>';
                trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
                trHTML += '<a href="https://api.zgaf.io/api_v1/prefabs/' + object['id'] + '/file" class="btn btn-primary me-1">Prefab File</a>';
                trHTML += '</div>';
                trHTML += '<div class="card-footer"><small class="text-muted bi-person-down"> ' + object['downloads'] + '</small></div>';
                trHTML += '</div>';
                trHTML += '</div>';

            }

            trHTML += '<nav aria-label="Map Navigation">';
            trHTML += '<ul class="pagination">';

            //Calculate the number of pages
            pages = Math.ceil(data["total"] / data["size"]);
            current = data["page"];

            trHTML += generatePagination(pages, current, "loadPCards");

            trHTML += '</ul>';
            trHTML += '</nav>';
        }
        document.getElementById("map-cards").innerHTML = trHTML;
    }
}

function loadMCards(page = 1) {
    scroll(0, 0);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/mods?page=" + page + "&size=21");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            const data = JSON.parse(this.responseText);
            for (let [i, object] of data["items"].entries()) {

                if (i % 3 === 0) {
                    trHTML += '</div>';
                    trHTML += '<div class="row top-buffer">';
                }

                var udate = new Date(object["time_created"]);
                var timeAgo = timeSince(udate);
                user = getUser(object["owner_id"]);

                trHTML += '<div class="col mb-3 mt-4">';
                trHTML += '<div class="card text-white bg-dark" >';
                trHTML += '<a href="https://api.zgaf.io/api_v1/modview?modId=' + object['id'] + '"><img src="https://api.zgaf.io/static/mods/tb/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
                trHTML += '<div class="card-body">';
                trHTML += '<h4 class="card-title">' + object['modName'] + '</h4>';
                trHTML += '<h5 class="card-title">Uploaded By: ' + user["name"] + '</h5>';
                trHTML += '<h5 class="card-title">Author: ' + object["modAuthor"] + '</h5>';
                trHTML += '<h5 class="card-title">Uploaded ' + timeAgo + ' ago</h5>';
                trHTML += '</div>';
                trHTML += '<p class="card-text p-3">' + object['modDescription'] + '</p>';
                trHTML += '</ul>';
                trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
                trHTML += '<a href="https://api.zgaf.io/static/mods/pak/' + object['id'] + '/' + object['modFileName'] + '" class="btn btn-primary me-1">Mod File</a>';
                trHTML += '</div>';
                //trHTML += '<div class="card-footer"><small class="text-muted bi-person-down"> ' + object['mod_downloads'] + '</small></div>';
                trHTML += '</div>';
                trHTML += '</div>';

            }

            trHTML += '<nav aria-label="Mod Navigation">';
            trHTML += '<ul class="pagination">';

            //Calculate the number of pages
            pages = Math.ceil(data["total"] / data["size"]);
            current = data["page"];

            trHTML += generatePagination(pages, current, "loadPCards");

            trHTML += '</ul>';
            trHTML += '</nav>';
        }
        document.getElementById("map-cards").innerHTML = trHTML;
    }
}

function loadNewest(page = 1) {
    scroll(0, 0);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/maps/newest?page=" + page + "&size=21");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            const data = JSON.parse(this.responseText);
            for (let [i, object] of data["items"].entries()) {

                if (i % 3 === 0) {
                    trHTML += '</div>';
                    trHTML += '<div class="row top-buffer">';
                }

                var udate = new Date(object["time_created"]);
                var timeAgo = timeSince(udate);

                trHTML += '<div class="col mb-3 mt-4">';
                trHTML += '<div class="card text-white bg-dark" >';
                trHTML += '<a href="https://api.zgaf.io/api_v1/mapview?mapId=' + object['id'] + '"><img src="https://api.zgaf.io/static/maps/tb/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
                trHTML += '<div class="card-body">';
                trHTML += '<h4 class="card-title">' + object['mapName'] + '</h4>';
                trHTML += '<h5 class="card-title">Author: ' + object['mapAuthor'] + '</h5>';
                trHTML += '<h5 class="card-title">Type: ' + object['mapTags'] + '</h5>';
                trHTML += '<h5 class="card-title">Uploaded ' + timeAgo + ' ago</h5>';
                trHTML += '</div>';
                trHTML += '<p class="card-text p-3">' + object['mapDescription'] + '</p>';
                trHTML += '</ul>';
                trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['mapName'] + '/file" class="btn btn-primary me-1">Map File</a>';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['mapName'] + '/variant/file" class="btn btn-primary me-1">Variant File</a>';
                trHTML += '</div>';
                trHTML += '<div class="card-footer"><small class="text-muted bi-person-down"> ' + object['map_downloads'] + '</small></div>';
                trHTML += '</div>';
                trHTML += '</div>';
            }

            trHTML += '<nav aria-label="Map Navigation">';
            trHTML += '<ul class="pagination">';

            //Calculate the number of pages
            pages = Math.ceil(data["total"] / data["size"]);
            current = data["page"];

            trHTML += generatePagination(pages, current, "loadNewest");

            trHTML += '</ul>';
            trHTML += '</nav>';
        }
        document.getElementById("map-cards").innerHTML = trHTML;
    }
}

function loadOldest(page = 1) {
    scroll(0, 0);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/maps/oldest?page=" + page + "&size=21");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            const data = JSON.parse(this.responseText);
            for (let [i, object] of data["items"].entries()) {

                if (i % 3 === 0) {
                    trHTML += '</div>';
                    trHTML += '<div class="row top-buffer">';
                }

                var udate = new Date(object["time_created"]);
                var timeAgo = timeSince(udate);

                trHTML += '<div class="col mb-3 mt-4">';
                trHTML += '<div class="card text-white bg-dark" >';
                trHTML += '<a href="https://api.zgaf.io/api_v1/mapview?mapId=' + object['id'] + '"><img src="https://api.zgaf.io/static/maps/tb/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
                trHTML += '<div class="card-body">';
                trHTML += '<h4 class="card-title">' + object['mapName'] + '</h4>';
                trHTML += '<h5 class="card-title">Author: ' + object['mapAuthor'] + '</h5>';
                trHTML += '<h5 class="card-title">Type: ' + object['mapTags'] + '</h5>';
                trHTML += '<h5 class="card-title">Uploaded ' + timeAgo + ' ago</h5>';
                trHTML += '</div>';
                trHTML += '<p class="card-text p-3">' + object['mapDescription'] + '</p>';
                trHTML += '</ul>';
                trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['mapName'] + '/file" class="btn btn-primary me-1">Map File</a>';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['mapName'] + '/variant/file" class="btn btn-primary me-1">Variant File</a>';
                trHTML += '</div>';
                trHTML += '<div class="card-footer"><small class="text-muted bi-person-down"> ' + object['map_downloads'] + '</small></div>';
                trHTML += '</div>';
                trHTML += '</div>';

            }
            trHTML += '<nav aria-label="Map Navigation">';
            trHTML += '<ul class="pagination">';

            //Calculate the number of pages
            pages = Math.ceil(data["total"] / data["size"]);
            current = data["page"];

            trHTML += generatePagination(pages, current, "loadOldest");

            trHTML += '</ul>';
            trHTML += '</nav>';
        }
        document.getElementById("map-cards").innerHTML = trHTML;
    }
}

function loadDownloaded(page = 1) {
    scroll(0, 0);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/maps/downloaded?page=" + page + "&size=21");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            const data = JSON.parse(this.responseText);
            for (let [i, object] of data["items"].entries()) {

                if (i % 3 === 0) {
                    trHTML += '</div>';
                    trHTML += '<div class="row top-buffer">';
                }

                var udate = new Date(object["time_created"]);
                var timeAgo = timeSince(udate);

                trHTML += '<div class="col mb-3 mt-4">';
                trHTML += '<div class="card text-white bg-dark" >';
                trHTML += '<a href="https://api.zgaf.io/api_v1/mapview?mapId=' + object['id'] + '"><img src="https://api.zgaf.io/static/maps/tb/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
                trHTML += '<div class="card-body">';
                trHTML += '<h4 class="card-title">' + object['mapName'] + '</h4>';
                trHTML += '<h5 class="card-title">Author: ' + object['mapAuthor'] + '</h5>';
                trHTML += '<h5 class="card-title">Type: ' + object['mapTags'] + '</h5>';
                trHTML += '<h5 class="card-title">Uploaded ' + timeAgo + ' ago</h5>';
                trHTML += '</div>';
                trHTML += '<p class="card-text p-3">' + object['mapDescription'] + '</p>';
                trHTML += '</ul>';
                trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['mapName'] + '/file" class="btn btn-primary me-1">Map File</a>';
                trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['mapName'] + '/variant/file" class="btn btn-primary me-1">Variant File</a>';
                trHTML += '</div>';
                trHTML += '<div class="card-footer"><small class="text-muted bi-person-down"> ' + object['map_downloads'] + '</small></div>';
                trHTML += '</div>';
                trHTML += '</div>';

            }
            trHTML += '<nav aria-label="Map Navigation">';
            trHTML += '<ul class="pagination">';

            //Calculate the number of pages
            pages = Math.ceil(data["total"] / data["size"]);
            current = data["page"];

            trHTML += generatePagination(pages, current, "loadDownloaded");

            trHTML += '</ul>';
            trHTML += '</nav>';
        }
        document.getElementById("map-cards").innerHTML = trHTML;
    }
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + "; SameSite=None; " + "Secure;" + "path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function delayRedirect() {
    setTimeout(function () {
        window.location.href = "/";
    }, 2000);
}

function getUser(userId) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.zgaf.io/api_v1/users/" + userId, false);
    xmlHttp.send();
    const user = JSON.parse(xmlHttp.response);

    return user
}

userLogin();
loadCards();