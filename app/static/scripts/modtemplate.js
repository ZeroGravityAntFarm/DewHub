const thisUrl = new URL(window.location.toLocaleString()).searchParams;
const modId = thisUrl.get('modId');

console.log(modId);

function getUser(userId) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.zgaf.io/api_v1/users/" + userId, false);
    xmlHttp.send();
    const user = JSON.parse(xmlHttp.response);

    return user
}

function getMod(modId) {
    var trHTML = '';
    var tbHTML = '';
    var modUrl = '';
    var modImage = '';

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.zgaf.io/api_v1/mods/" + modId);
    xmlHttp.send();

    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const modData = JSON.parse(xmlHttp.responseText);
            user = getUser(modData["owner_id"]);

            var udate = new Date(modData["time_created"]);
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
            trHTML += '<img src="https://api.zgaf.io/static/mods/' + modId + '/0" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/mods/' + modId + '/1" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/mods/' + modId + '/2" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/mods/' + modId + '/3" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/mods/' + modId + '/4" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
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
            trHTML += '<h3 class="card-title">' + modData["modName"] + '</h3>';
            trHTML += '<p class="card-text">' + modData["modDescription"] + '</p>';
            trHTML += '</div>';
            trHTML += '<ul class="list-group list-group-flush">';
            trHTML += '<li class="list-group-item bg-dark text-white">Uploaded By: ' + user["name"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Author: ' + modData["modAuthor"] + '</li>';
            //trHTML += '<li class="list-group-item bg-dark text-white">About: ' + modData["modDescription"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">File Size: ' + humanFileSize(modData["modFileSize"]) + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Uploaded: ' + timeAgo + ' ago</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">ID: ' + modData["id"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Tags: ' + modData["modTags"] + '</li>';
            trHTML += '</ul>';
            trHTML += '<div class="card-body">';
            trHTML += '<a href="https://api.zgaf.io/static/mods/pak/' + modData['id'] + '/' + modData['modFileName'] + '" class="btn btn-primary me-1">Mod File</a>';
            trHTML += '</div>';
            trHTML += '</div>';

            modUrl += 'https://fileshare.zgaf.io/mod/?modId=' + modData["id"];
            modImage += 'https://api.zgaf.io/static/mods/' + modData["id"] + '/0';

        }
        document.getElementById("mod-info").innerHTML = trHTML;
    }
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

function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }


getMod(modId);