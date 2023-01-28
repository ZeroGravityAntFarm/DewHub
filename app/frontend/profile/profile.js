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

                    trHTML += '<ol class="list-group bg-dark">'
                    trHTML += '<li class="list-group-item d-flex justify-content-between align-items-start">'
                    trHTML += '<div class="ms-2 me-auto">'
                    trHTML += '<div class="fw-bold">Username</div>'
                    trHTML += '' + user["name"] + ''
                    trHTML += '</div>'
                    trHTML += '</li>'
                    trHTML += '<li class="list-group-item d-flex justify-content-between align-items-start">'
                    trHTML += '<div class="ms-2 me-auto">'
                    trHTML += '<div class="fw-bold">Email</div>'
                    trHTML += '' + user["email"] + ''
                    trHTML += '</div>'
                    trHTML += '</li>'
                    trHTML += '<li class="list-group-item d-flex justify-content-between align-items-start">'
                    trHTML += '<div class="ms-2 me-auto">'
                    trHTML += '<div class="fw-bold">ID</div>'
                    trHTML += '' + user["id"] + ''
                    trHTML += '</div>'
                    trHTML += '</li>'
                    trHTML += '<li class="list-group-item d-flex justify-content-between align-items-start">'
                    trHTML += '<div class="ms-2 me-auto">'
                    trHTML += '<div class="fw-bold">Profile Views</div>'
                    trHTML += '' + user["prof_views"] + ''
                    trHTML += '</div>'
                    trHTML += '<li class="list-group-item d-flex justify-content-between align-items-start">'
                    trHTML += '<div class="ms-2 me-auto">'
                    trHTML += '<div class="fw-bold">Account Enabled</div>'
                    trHTML += '' + user["is_active"] + ''
                    trHTML += '</div>'
                    trHTML += '</li>'
                    trHTML += '<li class="list-group-item d-flex justify-content-between align-items-start">'
                    trHTML += '<div class="ms-2 me-auto">'
                    trHTML += '<div class="fw-bold">Account Controls</div>'
                    trHTML += '<button type="button" class="btn btn-success me-1">Edit</button>'
                    trHTML += '<button type="button" class="btn btn-danger" onclick="deleteUser(' + user['id'] + ')">Delete</button>'
                    trHTML += '</div>'
                    trHTML += '</li>'
                    trHTML += '</ol>'

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
        user = JSON.parse(xmlHttp.responseText);
        console.log(user)

        const maps = loadUserMaps(user["name"]);
        for (let [i, object] of maps.entries()) {

            if (i % 3 === 0) {
                trHTML += '</div>';
                trHTML += '<div class="row top-buffer">';
            }

            trHTML += '<div class="col mb-3 mt-4">';
            trHTML += '<div class="card text-white bg-dark" >';
            trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + object['id'] + '"><img src="https://api.zgaf.io/static/maps/' + object['id'] + '/0" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';"></a>';
            trHTML += '<div class="card-body">';
            trHTML += '<h4 class="card-title">' + object['mapName'] + '</h4>';
            trHTML += '<h5 class="card-title">Author: ' + object['mapAuthor'] + '</h5>';
            trHTML += '</div>';
            trHTML += '<p class="card-text p-3">' + object['mapDescription'] + '</p>';
            trHTML += '</ul>';
            trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
            trHTML += '<a href="" class="btn btn-success me-1">Edit</a>';
            trHTML += '<button type="button" class="btn btn-danger" onclick="deleteMap(' + object['id'] + ')">Delete</button>';
            trHTML += '</div>';
            trHTML += '<div class="card-footer"><small class="text-muted">Downloads: ' + object['map_downloads'] + '</small></div>';
            trHTML += '</div>';
            trHTML += '</div>';

        }

        document.getElementById("map-cards").innerHTML = trHTML;
        //Fail the onsubmit to avoid page refresh.
        return false;

    } else {

        delayRedirect()

    }
}



function loadUserMaps(userName) {

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/usermaps/" + userName, async = false);
    xhttp.send();
    const objects = JSON.parse(xhttp.responseText);

    return objects

}


function deleteMap(mapId) {
    const xhttp = new XMLHttpRequest();
    token = getCookie("Authorization");
    var trHTML = '';
    xhttp.open("DELETE", "https://api.zgaf.io/api_v1/maps/" + mapId, async = false);
    xhttp.setRequestHeader("Authorization", bearer_token);
    xhttp.send();
    const objects = JSON.parse(xhttp.responseText);

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
        window.location.href = "https://fileshare.zgaf.io/index.html";
    }, 500);
}

loadUser()
