token = getCookie("Authorization")

function deleteUser(userId) {
    if (token) {
        var xmlHttp = new XMLHttpRequest();
        var trHTML = '';

        xmlHttp.open('DELETE', 'https://api.zgaf.io/api_v1/users/' + userId, false)
        bearer_token = "Bearer " + token
        xmlHttp.setRequestHeader("Authorization", bearer_token);
        xmlHttp.send();

        if (xmlHttp.status == 200) {
            trHTML += '<div class="alert alert-success" role="alert">';
            trHTML += 'Success!';
            trHTML += '</div>';

            document.getElementById("status-message").innerHTML = trHTML;
            delayRedirect();
        } else {
            trHTML += '<div class="alert alert-danger" role="alert">';
            trHTML += 'Failed to delete account!';
            trHTML += '</div>';

            document.getElementById("status-message").innerHTML = trHTML;
        }

    }
}

function delayRedirect() {
    setTimeout(function () {
        window.location.href = "https://fileshare.zgaf.io";
    }, 2000);
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

        xmlHttp.open("GET", "https://api.zgaf.io/api_v1/me", false);
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
                    trHTML += '<img src="https://api.zgaf.io/static/content/default/forge.jpg" alt="Generic placeholder image" class="img-fluid img-thumbnail mt-4 mb-2" style="width: 150px; z-index: 1">';
                    trHTML += '<button type="button" class="btn btn-dark" data-mdb-ripple-color="dark" data-bs-toggle="modal" data-bs-username="' + user["name"] + '" data-bs-email="' + user["email"] + '" data-bs-target="#editprofile" style="z-index: 1;">Edit profile</button>';
                    trHTML += '</div>';
                    trHTML += '<div class="ms-3" style="margin-top: 130px;">';
                    trHTML += '<h5>' + user["name"] + '</h5>';
                    trHTML += '<p>{rank}</p>';
                    trHTML += '</div>';
                    trHTML += '</div>';
                    trHTML += '<div class="p-4 text-black" style="background-color: #f8f9fa;">';
                    trHTML += '<div class="d-flex justify-content-end text-center py-1">';
                    trHTML += '<div>';
                    trHTML += '<p class="mb-1 h5">' + user_stats["maps"] +'</p>';
                    trHTML += '<p class="small text-muted mb-0">Maps</p>';
                    trHTML += '</div>';
                    trHTML += '<div class="px-3">';
                    trHTML += '<p class="mb-1 h5">' + user_stats["prefabs"] +'</p>';
                    trHTML += '<p class="small text-muted mb-0">Prefabs</p>';
                    trHTML += '</div>';
                    trHTML += '<div>';
                    trHTML += '<p class="mb-1 h5">' + user_stats["mods"] +'</p>';
                    trHTML += '<p class="small text-muted mb-0">Mods</p>';
                    trHTML += '</div>';
                    trHTML += '</div>';
                    trHTML += '</div>';
                    trHTML += '<div class="card-body p-4 text-black">';
                    trHTML += '<div class="mb-5">';
                    trHTML += '<p class="lead fw-normal mb-1">About</p>';
                    trHTML += '<div class="p-4" style="background-color: #f8f9fa;">';
                    trHTML += '<p class="font-italic mb-1">' + user["about"] + '</p>';
                    trHTML += '</div>';
                    trHTML += '</div>';
                    trHTML += '<div class="d-flex justify-content-between align-items-center mb-4">';
                    trHTML += '<button type="button" class="btn btn-dark btn-lg" onclick="loadUserMaps()">Maps</button>';
                    trHTML += '<button type="button" class="btn btn-dark btn-lg" onclick="loadUserPrefabs()">Prefabs</button>';
                    trHTML += '<button type="button" class="btn btn-dark btn-lg" onclick="loadUserMods()">Mods</button>';
                    trHTML += '</div>';
                    trHTML += '<div id="map-cards">';
                    trHTML += '</div>';
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

        xmlHttp.open("GET", "https://api.zgaf.io/api_v1/me", false);
        bearer_token = "Bearer " + token
        xmlHttp.setRequestHeader("Authorization", bearer_token);
        xmlHttp.send();

        const maps = loadUserMaps();
    }

}


function loadUserStats(user_id){
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open('GET', 'https://api.zgaf.io/api_v1/users/stats/' + user_id, false)
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
    xhttp.open("GET", "https://api.zgaf.io/api_v1/usermaps/", async = false);
    xhttp.setRequestHeader("Authorization", bearer_token);
    xhttp.send();
    const maps = JSON.parse(xhttp.responseText);

    for (let [i, object] of maps.entries()) {

        if (i % 3 === 0) {
            trHTML += '</div>';
            trHTML += '<div class="row top-buffer">';
        }

        trHTML += '<div class="col mb-3 mt-4">';
        trHTML += '<div class="card text-white bg-dark" >';
        trHTML += '<a href="https://api.zgaf.io/api_v1/mapview?mapId=' + object['id'] + '"><img src="https://api.zgaf.io/static/maps/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
        trHTML += '<div class="card-body">';
        trHTML += '<h4 class="card-title">' + object['mapName'] + '</h4>';
        trHTML += '<h5 class="card-title">Author: ' + object['mapAuthor'] + '</h5>';
        trHTML += '</div>';
        trHTML += '<p class="card-text p-3">' + object['mapDescription'] + '</p>';
        trHTML += '</ul>';
        trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
        trHTML += '<button type="button" class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#editmap"   data-bs-mapName="' + object['mapName'] + '" data-bs-mapId="' + object['id'] +  '">Edit</button>';
        trHTML += '<button type="button" class="btn btn-danger me-1"  data-bs-toggle="modal" data-bs-target="#deletemap" data-bs-mapName="' + object['mapName'] + '" data-bs-mapId="' + object['id'] +  '">Delete</button>';
        trHTML += '</div>';
        trHTML += '<div class="card-footer"><small class="text-muted">Downloads: ' + object['map_downloads'] + '</small></div>';
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
    xhttp.open("GET", "https://api.zgaf.io/api_v1/usermods/", async = false);
    xhttp.setRequestHeader("Authorization", bearer_token);
    xhttp.send();
    const mods = JSON.parse(xhttp.responseText);

    for (let [i, object] of mods.entries()) {

        if (i % 3 === 0) {
            trHTML += '</div>';
            trHTML += '<div class="row top-buffer">';
        }

        trHTML += '<div class="col mb-3 mt-4">';
        trHTML += '<div class="card text-white bg-dark" >';
        trHTML += '<a href="https://api.zgaf.io/api_v1/modview?modId=' + object['id'] + '"><img src="https://api.zgaf.io/static/mods/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
        trHTML += '<div class="card-body">';
        trHTML += '<h4 class="card-title">' + object['modName'] + '</h4>';
        trHTML += '<h5 class="card-title">Author: ' + object['modAuthor'] + '</h5>';
        trHTML += '</div>';
        trHTML += '<p class="card-text p-3">' + object['modDescription'] + '</p>';
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
    document.getElementById("map-cards").innerHTML = trHTML;
}


function loadUserPrefabs() {

    const xhttp = new XMLHttpRequest();
    token = getCookie("Authorization");
    trHTML= '';
    xhttp.open("GET", "https://api.zgaf.io/api_v1/userprefabs/", async = false);
    xhttp.setRequestHeader("Authorization", bearer_token);
    xhttp.send();
    const prefabs = JSON.parse(xhttp.responseText);

    for (let [i, object] of prefabs.entries()) {

        if (i % 3 === 0) {
            trHTML += '</div>';
            trHTML += '<div class="row top-buffer">';
        }

        trHTML += '<div class="col mb-3 mt-4">';
        trHTML += '<div class="card text-white bg-dark" >';
        trHTML += '<a href="https://api.zgaf.io/api_v1/prefabview?prefabId=' + object['id'] + '"><img src="https://api.zgaf.io/static/prefabs/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
        trHTML += '<div class="card-body">';
        trHTML += '<h4 class="card-title">' + object['prefabName'] + '</h4>';
        trHTML += '<h5 class="card-title">Author: ' + object['prefabAuthor'] + '</h5>';
        trHTML += '</div>';
        trHTML += '<p class="card-text p-3">' + object['prefabDescription'] + '</p>';
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
    document.getElementById("map-cards").innerHTML = trHTML;
}


function deleteMap(mapId) {
    console.log(mapId);
    const xhttp = new XMLHttpRequest();
    token = getCookie("Authorization");
    var trHTML = '';
    xhttp.open("DELETE", "https://api.zgaf.io/api_v1/maps/" + mapId, async = false);
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
    xhttp.open("DELETE", "https://api.zgaf.io/api_v1/mods/" + modId, async = false);
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
    xhttp.open("DELETE", "https://api.zgaf.io/api_v1/prefabs/" + prefabId, async = false);
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

    xhr.open("PATCH", "https://api.zgaf.io/api_v1/maps/" + mapId);
    xhr.setRequestHeader("Authorization", bearer_token);
    xhr.send(data);
}


function editProfile() {
    var data = new FormData();
    var trHTML = '';
    var userName = '';
    var userEmail = '';

    userName = document.getElementById("inputUserName");
    userName = userName.value;
    userEmail = document.getElementById("inputEmail");
    userEmail = userEmail.value;

    data.append("userName", userName);
    data.append("userEmail", userEmail);

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
                delayRedirectLogin();

            } else if (xhr.status != 200) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += '' + this.responseText + '';
                trHTML += '</div>'
                document.getElementById("map-container").innerHTML = trHTML;
                $('#editmap').modal('hide');
                delayRedirect();
            }
        }
    });
    xhr.open("PATCH", "https://api.zgaf.io/api_v1/users");
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

    xhr.open("PATCH", "https://api.zgaf.io/api_v1/users/password");
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


function delayRedirect() {
    setTimeout(function () {
        window.location.href = "https://fileshare.zgaf.io/profile/";
    }, 1000);
}

function delayRedirectLogin() {
    setTimeout(function () {
        window.location.href = "https://fileshare.zgaf.io/login/";
    }, 1000);
}

loadUserv2()