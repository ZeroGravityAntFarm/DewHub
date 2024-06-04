token = getCookie("Authorization")

function deleteUser(userId) {
    if (token) {
        var xmlHttp = new XMLHttpRequest();
        var trHTML = '';

        xmlHttp.open('DELETE', '/api_v2/users/' + userId, false)
        bearer_token = "Bearer " + token
        xmlHttp.setRequestHeader("Authorization", bearer_token);
        xmlHttp.send();

        if (xmlHttp.status == 200) {
            trHTML += '<div class="alert alert-success" role="alert">';
            trHTML += 'Success!';
            trHTML += '</div>';

            document.getElementById("status-message").innerHTML = trHTML;
            delayRedirectMain();

        } else {
            trHTML += '<div class="alert alert-danger" role="alert">';
            trHTML += 'Failed to delete account!';
            trHTML += '</div>';

            document.getElementById("status-message").innerHTML = trHTML;
        }

    }
}


function loadUser() {
    var trHTML = ''
    if (token) {

        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == XMLHttpRequest.DONE) {
                var responseText = JSON.parse(xmlHttp.responseText);
                var trHTML = '';
                const user = JSON.parse(xmlHttp.responseText);

                console.log(responseText)
                if (xmlHttp.status == 200) {

                    trHTML += '<ol class="list-group bg-dark">';
                    trHTML += '<li class="list-group-item d-flex justify-content-between align-items-start">';
                    trHTML += '<div class="ms-2 me-auto">';
                    trHTML += '<div class="fw-bold">Username</div>';
                    trHTML += '' + user["name"] + '';
                    trHTML += '</div>';
                    trHTML += '</li>';
                    trHTML += '<li class="list-group-item d-flex justify-content-between align-items-start">';
                    trHTML += '<div class="ms-2 me-auto">';
                    trHTML += '<div class="fw-bold">Email</div>';
                    trHTML += '' + user["email"] + '';
                    trHTML += '</div>';
                    trHTML += '</li>';
                    trHTML += '<li class="list-group-item d-flex justify-content-between align-items-start">';
                    trHTML += '<div class="ms-2 me-auto">';
                    trHTML += '<div class="fw-bold">ID</div>';
                    trHTML += '' + user["id"] + '';
                    trHTML += '</div>';
                    trHTML += '</li>';
                    trHTML += '<li class="list-group-item d-flex justify-content-between align-items-start">';
                    trHTML += '<div class="ms-2 me-auto">';
                    trHTML += '<div class="fw-bold">Account Enabled</div>';
                    trHTML += '' + user["is_active"] + '';
                    trHTML += '</div>';
                    trHTML += '</li>';
                    trHTML += '<li class="list-group-item d-flex justify-content-between align-items-start">';
                    trHTML += '<div class="ms-2 me-auto">';
                    trHTML += '<div class="fw-bold">Account Controls</div>';
                    trHTML += '<button type="button" class="btn btn-secondary me-1" data-bs-toggle="modal" data-bs-username="' + user["name"] + '" data-bs-email="' + user["email"] + '" data-bs-target="#editprofile">Edit Profile</button>';
                    trHTML += '<button type="button" class="btn btn-secondary me-1" data-bs-toggle="modal" data-bs-target="#editpassword">Change Password</button>';
                    trHTML += '<button type="button" class="btn btn-danger me-1" data-bs-toggle="modal" data-bs-target="#deleteprofile" data-bs-userId="' + user['id'] +  '" >Delete Account</button>';
                    trHTML += '</div>';
                    trHTML += '</li>';
                    trHTML += '</ol>';

                    document.getElementById("user-profile").innerHTML = trHTML;

                } else {

                    trHTML += '<div class="alert alert-success" role="alert">';
                    trHTML += 'Success!';
                    trHTML += '</div>'
                    document.getElementById("status-message").innerHTML = trHTML;

                    setCookie("Authorization", responseText.access_token, 1)

                    delayRedirect();

                }

            }

        }

        xmlHttp.open("GET", "/api_v2/me", false);
        bearer_token = "Bearer " + token
        xmlHttp.setRequestHeader("Authorization", bearer_token);
        xmlHttp.send();

        const maps = loadUserMaps();
    }

}


function loadUserv2() {
    var trHTML = ''
    if (token) {

        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == XMLHttpRequest.DONE) {
                var responseText = JSON.parse(xmlHttp.responseText);
                var trHTML = '';
                const user = JSON.parse(xmlHttp.responseText);
                const user_stats = loadUserStats(user["id"]);

                console.log(responseText)
                if (xmlHttp.status == 200) {

                    //trHTML += '<section class="h-100 gradient-custom-2">';
                    trHTML += '<div class="container py-5 h-100">';
                    trHTML += '<div class="row d-flex justify-content-center align-items-center h-100">';
                    trHTML += '<div class="col col-lg-9 col-xl-7">';
                    trHTML += '<div class="card">';
                    trHTML += '<div class="rounded-top text-white d-flex flex-row" style="background-color: #525151; height:200px;">';
                    trHTML += '<div class="ms-4 mt-5 d-flex flex-column" style="width: 150px;">';
                    trHTML += '<img src="/content/default/forge.jpg" alt="Generic placeholder image" class="img-fluid img-thumbnail mt-4 mb-2" style="width: 150px; z-index: 1">';
                    trHTML += '<button type="button" class="btn btn-secondary" data-mdb-ripple-color="dark" data-bs-toggle="modal" data-bs-username="' + user["name"] + '" data-bs-email="' + user["email"] + '" data-bs-target="#editprofile" style="z-index: 1;">Edit profile</button>';
                    trHTML += '<button type="button" class="btn btn-danger mt-2" data-bs-toggle="modal" data-bs-target="#deleteprofile" data-bs-userId="' + user['id'] + '" style="z-index: 2;">Delete Account</button>';
                    trHTML += '</div>';
                    trHTML += '<div class="ms-3" style="margin-top: 130px;">';
                    trHTML += '<h5>' + user["name"] + '</h5>';
                    trHTML += '<p>' + user["rank"] + '</p>';
                    trHTML += '</div>';
                    trHTML += '</div>';
                    trHTML += '<div class="p-4 text-black bg-dark">';
                    trHTML += '<div class="d-flex justify-content-end text-center py-1">';
                    trHTML += '<div>';
                    trHTML += '<p class="mb-1 h5 text-muted">' + user_stats["maps"] +'</p>';
                    trHTML += '<p class="small text-muted mb-0">Maps</p>';
                    trHTML += '</div>';
                    trHTML += '<div class="px-3">';
                    trHTML += '<p class="mb-1 h5 text-muted">' + user_stats["prefabs"] +'</p>';
                    trHTML += '<p class="small text-muted mb-0">Prefabs</p>';
                    trHTML += '</div>';
                    trHTML += '<div>';
                    trHTML += '<p class="mb-1 h5 text-muted">' + user_stats["mods"] +'</p>';
                    trHTML += '<p class="small text-muted mb-0">Mods</p>';
                    trHTML += '</div>';
                    trHTML += '</div>';
                    trHTML += '</div>';
                    trHTML += '<div class="card-body p-4 text-black bg-dark">';
                    trHTML += '<div class="mb-5">';
                    trHTML += '<p class="lead fw-normal mb-1 text-muted">About:</p>';
                    trHTML += '<div class="p-4">';
                    trHTML += '<p class="font-italic mb-1 text-muted">' + user["about"] + '</p>';
                    trHTML += '</div>';
                    trHTML += '</div>';
                    trHTML += '<ul class="nav nav-tabs mb-3 bg-dark" id="contentTabs" role="tablist">';
                    trHTML += '<li class="nav-item" role="presentation">';
                    trHTML += '<button class="nav-link active" id="map-tab" data-bs-toggle="tab" data-bs-target="#map-cards" onclick="loadUserMaps()" type="button" role="tab" aria-controls="map-cards" aria-selected="true">Maps</button>';
                    trHTML += '</li>';
                    trHTML += '<li class="nav-item" role="presentation">';
                    trHTML += '<button class="nav-link" id="prefab-tab" data-bs-toggle="tab" data-bs-target="#prefab-cards" onclick="loadUserPrefabs()" type="button" role="tab" aria-controls="prefab-cards" aria-selected="false">Prefabs</button>';
                    trHTML += '</li>';
                    trHTML += '<li class="nav-item" role="presentation">';
                    trHTML += '<button class="nav-link" id="mod-tab" data-bs-toggle="tab" data-bs-target="#mod-cards" onclick="loadUserMods()" type="button" role="tab" aria-controls="mod-cards" aria-selected="false">Mods</button>';
                    trHTML += '</li>';
                    trHTML += '</ul>';
                    trHTML += '<div class="tab-content" id="myTabContent">';
                    trHTML += '<div class="tab-pane fade show active" id="map-cards" role="tabpanel" aria-labelledby="map-tab"></div>';
                    trHTML += '<div class="tab-pane fade" id="prefab-cards" role="tabpanel" aria-labelledby="prefab-tab"></div>';
                    trHTML += '<div class="tab-pane fade" id="mod-cards" role="tabpanel" aria-labelledby="mod-tab"></div>';
                    trHTML += '</div>';
                    //trHTML += '<div class="d-flex justify-content-between align-items-center mb-4">';
                    //trHTML += '<button type="button" class="btn btn-dark btn-lg" onclick="loadUserMaps()">Maps</button>';
                    //trHTML += '<button type="button" class="btn btn-dark btn-lg" onclick="loadUserPrefabs()">Prefabs</button>';
                    //trHTML += '<button type="button" class="btn btn-dark btn-lg" onclick="loadUserMods()">Mods</button>';
                    //trHTML += '</div>';
                    //trHTML += '<div id="map-cards"></div>';
                    trHTML += '</div>';
                    trHTML += '</div>';
                    trHTML += '</div>';
                    trHTML += '</div>';
                    //trHTML += '</section>';

                    document.getElementById("user-profile").innerHTML = trHTML;

                } else {

                    trHTML += '<div class="alert alert-success" role="alert">';
                    trHTML += 'Success!';
                    trHTML += '</div>'
                    document.getElementById("status-message").innerHTML = trHTML;

                    setCookie("Authorization", responseText.access_token, 1)

                    delayRedirect();

                }

            }

        }

        xmlHttp.open("GET", "/api_v2/me", false);
        bearer_token = "Bearer " + token
        xmlHttp.setRequestHeader("Authorization", bearer_token);
        xmlHttp.send();

        const maps = loadUserMaps();
    }

}


function loadUserStats(user_id){
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open('GET', '/api_v2/users/stats/' + user_id, false)
    bearer_token = "Bearer " + token
    xmlHttp.setRequestHeader("Authorization", bearer_token);
    xmlHttp.send();

    const user_stats = JSON.parse(xmlHttp.responseText);

    return user_stats
}


function loadUserMaps() {

    const xhttp = new XMLHttpRequest();
    token = getCookie("Authorization");
    trHTML= '';
    xhttp.open("GET", "/api_v2/usermaps/", async = false);
    xhttp.setRequestHeader("Authorization", bearer_token);
    xhttp.send();
    const maps = JSON.parse(xhttp.responseText);

    for (let [i, object] of maps.entries()) {

        if (i % 3 === 0) {
            trHTML += '</div>';
            trHTML += '<div class="row top-buffer">';
        }

        trHTML += '<div class="col mb-3 mt-4">';
        trHTML += '<div class="card text-white bg-secondary" >';
        trHTML += '<a href="/api_v2/mapview?mapId=' + object['id'] + '"><img src="/maps/tb/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'/content/default/forge.jpg\';"></a>';
        trHTML += '<div class="card-body">';
        trHTML += '<h4 class="card-title">' + object['mapName'] + '</h4>';
        trHTML += '<h5 class="card-title">Author: ' + object['mapAuthor'] + '</h5>';
        trHTML += '</div>';
        //trHTML += '<p class="card-text p-3">' + object['mapDescription'] + '</p>';
        trHTML += '</ul>';
        trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
        trHTML += '<button type="button" class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#editmap"   data-bs-mapName="' + object['mapName'] + '" data-bs-mapId="' + object['id'] +  '">Edit</button>';
        trHTML += '<button type="button" class="btn btn-danger me-1"  data-bs-toggle="modal" data-bs-target="#deletemap" data-bs-mapName="' + object['mapName'] + '" data-bs-mapId="' + object['id'] +  '">Delete</button>';
        trHTML += '</div>';
        //trHTML += '<div class="card-footer"><small class="text-muted">Downloads: ' + object['map_downloads'] + '</small></div>';
        trHTML += '</div>';
        trHTML += '<script>';
        trHTML += '';
        trHTML += '</script>';
        trHTML += '</div>';

    }
    document.getElementById("map-cards").innerHTML = trHTML;
}


function loadUserMods() {

    const xhttp = new XMLHttpRequest();
    token = getCookie("Authorization");
    trHTML= '';
    xhttp.open("GET", "/api_v2/usermods/", async = false);
    xhttp.setRequestHeader("Authorization", bearer_token);
    xhttp.send();
    const mods = JSON.parse(xhttp.responseText);

    for (let [i, object] of mods.entries()) {

        if (i % 3 === 0) {
            trHTML += '</div>';
            trHTML += '<div class="row top-buffer">';
        }

        trHTML += '<div class="col mb-3 mt-4">';
        trHTML += '<div class="card text-white bg-secondary" >';
        trHTML += '<a href="/api_v2/modview?modId=' + object['id'] + '"><img src="/mods/tb/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'/content/default/forge.jpg\';"></a>';
        trHTML += '<div class="card-body">';
        trHTML += '<h4 class="card-title">' + object['modName'] + '</h4>';
        trHTML += '<h5 class="card-title">Author: ' + object['modAuthor'] + '</h5>';
        trHTML += '</div>';
        //trHTML += '<p class="card-text p-3">' + object['modDescription'] + '</p>';
        trHTML += '</ul>';
        trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
        //trHTML += '<button type="button" class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#editmod"   data-bs-mapName="' + object['mapName'] + '" data-bs-mapId="' + object['id'] +  '">Edit</button>';
        trHTML += '<button type="button" class="btn btn-danger me-1"  data-bs-toggle="modal" data-bs-target="#deletemod" data-bs-modName="' + object['modName'] + '" data-bs-modId="' + object['id'] +  '">Delete</button>';
        trHTML += '</div>';
        trHTML += '</div>';
        trHTML += '<script>';
        trHTML += '';
        trHTML += '</script>';
        trHTML += '</div>';

    }
    document.getElementById("mod-cards").innerHTML = trHTML;
}


function loadUserPrefabs() {

    const xhttp = new XMLHttpRequest();
    token = getCookie("Authorization");
    trHTML= '';
    xhttp.open("GET", "/api_v2/userprefabs/", async = false);
    xhttp.setRequestHeader("Authorization", bearer_token);
    xhttp.send();
    const prefabs = JSON.parse(xhttp.responseText);

    for (let [i, object] of prefabs.entries()) {

        if (i % 3 === 0) {
            trHTML += '</div>';
            trHTML += '<div class="row top-buffer">';
        }

        trHTML += '<div class="col mb-3 mt-4">';
        trHTML += '<div class="card text-white bg-secondary" >';
        trHTML += '<a href="/api_v2/prefabview?prefabId=' + object['id'] + '"><img src="/prefabs/tb/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'/content/default/forge.jpg\';"></a>';
        trHTML += '<div class="card-body">';
        trHTML += '<h4 class="card-title">' + object['prefabName'] + '</h4>';
        trHTML += '<h5 class="card-title">Author: ' + object['prefabAuthor'] + '</h5>';
        trHTML += '</div>';
        //trHTML += '<p class="card-text p-3">' + object['prefabDescription'] + '</p>';
        trHTML += '</ul>';
        trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
        //trHTML += '<button type="button" class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#editmod"   data-bs-mapName="' + object['mapName'] + '" data-bs-mapId="' + object['id'] +  '">Edit</button>';
        trHTML += '<button type="button" class="btn btn-danger me-1"  data-bs-toggle="modal" data-bs-target="#deleteprefab" data-bs-prefabName="' + object['prefabName'] + '" data-bs-prefabId="' + object['id'] +  '">Delete</button>';
        trHTML += '</div>';
        trHTML += '</div>';
        trHTML += '<script>';
        trHTML += '';
        trHTML += '</script>';
        trHTML += '</div>';

    }
    document.getElementById("prefab-cards").innerHTML = trHTML;
}


function deleteMap(mapId) {
    console.log(mapId);
    const xhttp = new XMLHttpRequest();
    token = getCookie("Authorization");
    var trHTML = '';
    xhttp.open("DELETE", "/api_v2/maps/" + mapId, async = false);
    xhttp.setRequestHeader("Authorization", bearer_token);
    xhttp.send();

    if (xhttp.status == 200) {
        trHTML += '<div class="alert alert-success" role="alert">';
        trHTML += 'Success!';
        trHTML += '</div>'
        document.getElementById("status-message").innerHTML = trHTML;
        location.reload();

    } else if (xhttp.status != 200) {
        trHTML += '<div class="alert alert-danger" role="alert">';
        trHTML += 'Problem deleting map';
        trHTML += '</div>'
        document.getElementById("status-message").innerHTML = trHTML;

    }
}


function deleteMod(modId) {
    console.log(modId);
    const xhttp = new XMLHttpRequest();
    token = getCookie("Authorization");
    var trHTML = '';
    xhttp.open("DELETE", "/api_v2/mods/" + modId, async = false);
    xhttp.setRequestHeader("Authorization", bearer_token);
    xhttp.send();

    if (xhttp.status == 200) {
        trHTML += '<div class="alert alert-success" role="alert">';
        trHTML += 'Success!';
        trHTML += '</div>'
        document.getElementById("status-message").innerHTML = trHTML;
        location.reload();

    } else if (xhttp.status != 200) {
        trHTML += '<div class="alert alert-danger" role="alert">';
        trHTML += 'Problem deleting mod';
        trHTML += '</div>'
        document.getElementById("status-message").innerHTML = trHTML;

    }
}


function deletePrefab(prefabId) {
    console.log(prefabId);
    const xhttp = new XMLHttpRequest();
    token = getCookie("Authorization");
    var trHTML = '';
    xhttp.open("DELETE", "/api_v2/prefabs/" + prefabId, async = false);
    xhttp.setRequestHeader("Authorization", bearer_token);
    xhttp.send();

    if (xhttp.status == 200) {
        trHTML += '<div class="alert alert-success" role="alert">';
        trHTML += 'Success!';
        trHTML += '</div>'
        document.getElementById("status-message").innerHTML = trHTML;
        location.reload();

    } else if (xhttp.status != 200) {
        trHTML += '<div class="alert alert-danger" role="alert">';
        trHTML += 'Problem deleting prefab';
        trHTML += '</div>'
        document.getElementById("status-message").innerHTML = trHTML;

    }
}


function editMap(mapId) {
    var data = new FormData();
    var trHTML = '';
    var mapName = '';
    var mapTags = '';
    var mapDesc = '';

    mapName = document.getElementById("usermapname");
    mapName = mapName.value;
    mapTags = document.getElementById("mapTags");
    mapTags = mapTags.value;
    mapDesc = document.getElementById("usermapdescription");
    mapDesc = mapDesc.value;

    data.append("mapName", mapName);
    data.append("mapTags", mapTags);
    data.append("mapUserDesc", mapDesc)

    var xhr = new XMLHttpRequest();
    var bearer_token = "Bearer " + token;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (xhr.status == 200) {
                trHTML += '<div class="alert alert-success" role="alert">';
                trHTML += 'Success!';
                trHTML += '</div>'
                document.getElementById("map-container").innerHTML = trHTML;
                $('#editmap').modal('hide');
                delayRedirect();

            } else if (xhr.status != 200) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += '' + this.responseText + '';
                trHTML += '</div>'
                document.getElementById("map-container").innerHTML = trHTML;
                $('#editmap').modal('hide');
            }
        }
    });

    xhr.open("PATCH", "/api_v2/maps/" + mapId);
    xhr.setRequestHeader("Authorization", bearer_token);
    xhr.send(data);
}


function editProfile() {
    var data = new FormData();
    var trHTML = '';
    var userName = '';
    var userEmail = '';
    var userAbout = '';

    userName = document.getElementById("inputUserName");
    userName = userName.value;

    userEmail = document.getElementById("inputEmail");
    userEmail = userEmail.value;

    userAbout = document.getElementById("inputAbout");
    userAbout = userAbout.value;

    data.append("userName", userName);
    data.append("userEmail", userEmail);
    data.append("userAbout", userAbout);

    var xhr = new XMLHttpRequest();
    var bearer_token = "Bearer " + token;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (xhr.status == 200) {
                trHTML += '<div class="alert alert-success" role="alert">';
                trHTML += 'Success!';
                trHTML += '</div>'
                document.getElementById("status-message").innerHTML = trHTML;
                $('#editmap').modal('hide');
                delayRedirect();

            } else if (xhr.status != 200) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += '' + this.responseText + '';
                trHTML += '</div>'
                document.getElementById("status-message").innerHTML = trHTML;
                $('#editmap').modal('hide');

            }
        }
    });
    xhr.open("PATCH", "/api_v2/users");
    xhr.setRequestHeader("Authorization", bearer_token);
    xhr.send(data);

}

function editPassword() {
    var data = new FormData();
    var trHTML = '';
    var oldPassword = '';
    var newPassword1 = '';
    var newPassword2 = '';
    
    oldPassword = document.getElementById("oldPassword");
    oldPassword = oldPassword.value;

    newPassword1 = document.getElementById("newPassword1");
    newPassword1 = newPassword1.value;

    newPassword2 = document.getElementById("newPassword2");
    newPassword2 = newPassword2.value;

    if (newPassword1 === newPassword2) {
        data.append("userPassword", newPassword1);

    } else {
        trHTML += '<div class="alert alert-danger" role="alert">';
        trHTML += 'Passwords do not match';
        trHTML += '</div>';
        document.getElementById("status-container").innerHTML = trHTML;
        $('#editpassword').modal('hide');
        delayRedirect();
    }

    var xhr = new XMLHttpRequest();
    var bearer_token = "Bearer " + token;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (xhr.status == 200) {
                trHTML += '<div class="alert alert-success" role="alert">';
                trHTML += 'Success!';
                trHTML += '</div>'
                document.getElementById("status-container").innerHTML = trHTML;
                $('#editpassword').modal('hide');
                delayRedirectLogin();

            } else if (xhr.status != 200) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += '' + this.responseText + '';
                trHTML += '</div>'
                document.getElementById("status-container").innerHTML = trHTML;
                $('#editpassword').modal('hide');
                delayRedirect();
            }
        }
    });

    xhr.open("PATCH", "/api_v2/users/password");
    xhr.setRequestHeader("Authorization", bearer_token);
    xhr.send(data);
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

document.getElementById('search_bar').addEventListener('keypress', function () {
    searchMaps();
});

function searchMapsQuery(page = 1, queryParam) {
    scroll(0, 0);
    var trHTML = '';
    const xhttp = new XMLHttpRequest();
    var searchQuery = queryParam;
    console.log(searchQuery);
    xhttp.open("GET", "/api_v2/maps/search/" + searchQuery + "?page=" + page + "&size=21");
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
                trHTML += '<a href="/api_v2/mapview?mapId=' + object['id'] + '"><img src="/maps/tb/' + object['id'] + '/0" class="card-img h-100" alt="..." onerror="this.onerror=null;this.src=\'/content/default/forge.jpg\';"></a>';
                trHTML += '</div>';
                trHTML += '<div class="col-md-8">';
                trHTML += '<div class="card-body">';
                trHTML += '<h3 class="card-title">' + object['mapName'] + '</h3>';
                trHTML += '<h5 class="card-title">Author: ' + object['mapAuthor'] + '</h5>';
                trHTML += '<h5 class="card-title">Type: ' + object['mapTags'] + '</h5>';
                trHTML += '<p class="card-text">' + object['mapDescription'] + '</p>';
                trHTML += '<p class="card-text"><small class="text-muted">Uploaded ' + timeAgo + ' ago</small></p>';
                trHTML += '<a href="/api_v2/maps/' + object['id'] + '/file" class="btn btn-primary me-1">Map File</a>';
                trHTML += '<a href="/api_v2/maps/' + object['id'] + '/variant/file" class="btn btn-primary me-1">Variant File</a>';
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

    xhr.open("POST", "/api_v2/upload/mod");
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

    xhr.open("POST", "/api_v2/upload/prefab");
    xhr.setRequestHeader("Authorization", bearer_token);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(data);
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
    xmlHttp.open("GET", "/api_v2/users/" + userId, false);
    xmlHttp.send();
    const user = JSON.parse(xmlHttp.response);

    return user
}


function delayRedirect() {
    setTimeout(function () {
        window.location.href = "/profile/";
    }, 1000);
}


function delayRedirectMain() {
    setTimeout(function () {
        window.location.href = "/";
    }, 2000);
}


function delayRedirectLogin() {
    setTimeout(function () {
        window.location.href = "/login/";
    }, 1000);
}

loadUserv2()