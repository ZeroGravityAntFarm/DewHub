const thisUrl = new URL(window.location.toLocaleString()).searchParams;
const mapId = thisUrl.get('mapId');
token = getCookie("Authorization");

console.log(mapId);

function getUser(userId) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.zgaf.io/api_v1/users/" + userId, false);
    xmlHttp.send();
    const user = JSON.parse(xmlHttp.response);

    return user
}

function getMap(mapId) {
    var trHTML = '';
    var tbHTML = '';
    var mapUrl = '';
    var mapImage = '';

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.zgaf.io/api_v1/maps/" + mapId);
    xmlHttp.send();

    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const mapData = JSON.parse(xmlHttp.responseText);
            user = getUser(mapData["owner_id"]);

            var udate = new Date(mapData["time_created"]);
            var timeAgo = timeSince(udate);

            trHTML += '<div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">';
            trHTML += '<div class="carousel-indicators">';
            trHTML += '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>';
            trHTML += '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>';
            trHTML += '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>';
            trHTML += '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>';
            trHTML += '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>';
            trHTML += '</div>';
            trHTML += '<div class="carousel-inner">';
            trHTML += '<div class="carousel-item active">';
            trHTML += '<img src="https://api.zgaf.io/static/maps/' + mapId + '/0" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/maps/' + mapId + '/1" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/maps/' + mapId + '/2" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/maps/' + mapId + '/3" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/maps/' + mapId + '/4" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '</div>';
            trHTML += '<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">';
            trHTML += '<span class="carousel-control-prev-icon" aria-hidden="true"></span>';
            trHTML += '<span class="visually-hidden">Previous</span>';
            trHTML += '</button>';
            trHTML += '<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">';
            trHTML += '<span class="carousel-control-next-icon" aria-hidden="true"></span>';
            trHTML += '<span class="visually-hidden">Next</span>';
            trHTML += '</button>';
            trHTML += '</div>';

            trHTML += '';
            trHTML += '<div class="card text-white bg-dark mb-3">';
            trHTML += '<div class="card-body">';
            trHTML += '<h3 class="card-title">' + mapData["mapName"] + '</h3>';
            trHTML += '<p class="card-text">' + mapData["mapDescription"] + '</p>';
            trHTML += '</div>';
            trHTML += '<ul class="list-group list-group-flush">';
            trHTML += '<li class="list-group-item bg-dark text-white">Uploaded By: ' + user["name"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Author: ' + mapData["mapAuthor"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">About: ' + mapData["mapUserDesc"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Total Objects: ' + mapData["mapTotalObject"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Scenario Objects: ' + mapData["mapScnrObjectCount"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Downloads: ' + mapData["map_downloads"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Uploaded: ' + timeAgo + ' ago</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">ID: ' + mapData["id"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Tags: ' + mapData["mapTags"] + '</li>';
            trHTML += '</ul>';
            trHTML += '<div class="card-body">';
            trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + mapData['id'] + '/file" class="btn btn-primary me-1">Map File</a>';
            trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + mapData['id'] + '/variant/file" class="btn btn-primary me-1">Variant File</a>';
            trHTML += '</div>';
            trHTML += '</div>';

            mapUrl += 'https://fileshare.zgaf.io/map/?mapId=' + mapData["id"];
            mapImage += 'https://api.zgaf.io/static/maps/' + mapData["id"] + '/0';

            document.querySelector('meta[name="description"]').setAttribute("content", mapData["mapDescription"]);
            document.querySelector('meta[name="title"]').setAttribute("content", mapData["mapName"]);
            document.querySelector('meta[name="url"]').setAttribute("content", mapUrl);
            document.querySelector('meta[name="image"]').setAttribute("content", mapImage);

        }
        document.getElementById("map-info").innerHTML = trHTML;
    }
}

function getMapAuth(mapId) {
    var trHTML = '';
    var tbHTML = '';
    var mapUrl = '';
    var mapImage = '';

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.zgaf.io/api_v1/maps/" + mapId);
    xmlHttp.send();

    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const mapData = JSON.parse(xmlHttp.responseText);
            user = getUser(mapData["owner_id"]);

            var udate = new Date(mapData["time_created"]);
            var timeAgo = timeSince(udate);

            trHTML += '<div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">';
            trHTML += '<div class="carousel-indicators">';
            trHTML += '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>';
            trHTML += '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>';
            trHTML += '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>';
            trHTML += '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>';
            trHTML += '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>';
            trHTML += '</div>';
            trHTML += '<div class="carousel-inner">';
            trHTML += '<div class="carousel-item active">';
            trHTML += '<img src="https://api.zgaf.io/static/maps/' + mapId + '/0" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/maps/' + mapId + '/1" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/maps/' + mapId + '/2" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/maps/' + mapId + '/3" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/maps/' + mapId + '/4" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '</div>';
            trHTML += '<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">';
            trHTML += '<span class="carousel-control-prev-icon" aria-hidden="true"></span>';
            trHTML += '<span class="visually-hidden">Previous</span>';
            trHTML += '</button>';
            trHTML += '<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">';
            trHTML += '<span class="carousel-control-next-icon" aria-hidden="true"></span>';
            trHTML += '<span class="visually-hidden">Next</span>';
            trHTML += '</button>';
            trHTML += '</div>';

            trHTML += '';
            trHTML += '<div class="card text-white bg-dark mb-3">';
            trHTML += '<div class="card-body">';
            trHTML += '<h3 class="card-title">' + mapData["mapName"] + '</h3>';
            trHTML += '<p class="card-text">' + mapData["mapDescription"] + '</p>';
            trHTML += '</div>';
            trHTML += '<ul class="list-group list-group-flush">';
            trHTML += '<li class="list-group-item bg-dark text-white">Uploaded By: ' + user["name"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Author: ' + mapData["mapAuthor"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">About: ' + mapData["mapUserDesc"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Total Objects: ' + mapData["mapTotalObject"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Scenario Objects: ' + mapData["mapScnrObjectCount"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Downloads: ' + mapData["map_downloads"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Uploaded: ' + timeAgo + ' ago</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">ID: ' + mapData["id"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Tags: ' + mapData["mapTags"] + '</li>';
            trHTML += '</ul>';
            trHTML += '<div class="card-body">';
            trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + mapData['id'] + '/file" class="btn btn-primary me-1">Map File</a>';
            trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + mapData['id'] + '/variant/file" class="btn btn-primary me-1">Variant File</a>';
            trHTML += '<div class="float-end">';
            trHTML += '<button type="button" class="btn btn-success me-1" onclick="sendVote(1, '+ mapData["id"] +')">Upvote</button>';
            trHTML += '<button type="button" class="btn btn-danger me-1" onclick="sendVote(0, '+ mapData["id"] +')">Downvote</button>';
            trHTML += '</div>';
            trHTML += '</div>';
            trHTML += '</div>';

            mapUrl += 'https://fileshare.zgaf.io/map/?mapId=' + mapData["id"];
            mapImage += 'https://api.zgaf.io/static/maps/' + mapData["id"] + '/0';

            document.querySelector('meta[name="description"]').setAttribute("content", mapData["mapDescription"]);
            document.querySelector('meta[name="title"]').setAttribute("content", mapData["mapName"]);
            document.querySelector('meta[name="url"]').setAttribute("content", mapUrl);
            document.querySelector('meta[name="image"]').setAttribute("content", mapImage);

        }
        document.getElementById("map-info").innerHTML = trHTML;
    }
}

function userLogin() {
    if (token) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "https:////api.zgaf.io/api_v1/me", false);
        bearer_token = "Bearer " + token
        xmlHttp.setRequestHeader("Authorization", bearer_token);
        xmlHttp.send();
        const user = JSON.parse(xmlHttp.responseText);

        if (xmlHttp.status == 200) {
            getMapAuth(mapId);
        } else {
            getMap(mapId);
        }
    } else {
        getMap(mapId);
    }
}


function sendVote(vote, mapId){
    var xhr = new XMLHttpRequest();
    var bearer_token = "Bearer" + token;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (xhr.status == 200) {
                trHTML += '<div class="alert alert-success" role="alert">';
                trHTML += 'Success!';
                trHTML += '</div>'
                document.getElementById("status-container").innerHTML = trHTML;

            } else if (xhr.status != 200) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += '' + this.responseText + '';
                trHTML += '</div>'
                document.getElementById("status-container").innerHTML = trHTML;
            }
        }
    });

    xhr.open("POST", "https://api.zgaf.io/api_v1/vote/" + mapId + "/" + vote);
    xhr.setRequestHeader("Authorization", bearer_token);
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

userLogin();