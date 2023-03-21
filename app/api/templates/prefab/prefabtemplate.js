const thisUrl = new URL(window.location.toLocaleString()).searchParams;
const prefabId = thisUrl.get('prefabId');

console.log(prefabId);

function getUser(userId) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.zgaf.io/api_v1/users/" + userId, false);
    xmlHttp.send();
    const user = JSON.parse(xmlHttp.response);

    return user
}

function getPrefab(prefabId) {
    var trHTML = '';
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.zgaf.io/api_v1/prefabs/" + prefabId);
    xmlHttp.send();

    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const prefabData = JSON.parse(xmlHttp.responseText);
            user = getUser(prefabData["owner_id"]);


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
            trHTML += '<img src="https://api.zgaf.io/static/prefabs/' + prefabId + '/0" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/prefabs/' + prefabId + '/1" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/prefabs/' + prefabId + '/2" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/prefabs/' + prefabId + '/3" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '</div>';
            trHTML += '<div class="carousel-item">';
            trHTML += '<img src="https://api.zgaf.io/static/prefabs/' + prefabId + '/4" class="d-block w-100" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
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
            trHTML += '<h3 class="card-title">' + prefabData["prefabName"] + '</h3>';
            trHTML += '</div>';
            trHTML += '<ul class="list-group list-group-flush">';
            trHTML += '<li class="list-group-item bg-dark text-white">Uploaded By: ' + user["name"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">About: ' + prefabData["prefabDescription"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Author: ' + prefabData["prefabAuthor"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Downloads: ' + prefabData["downloads"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Filename: \"' + prefabData["prefabFileName"] + '\"</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Tags: ' + prefabData["prefabTags"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Uploaded: ' + prefabData["time_created"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">ID: ' + prefabData["id"] + '</li>';
            trHTML += '</ul>';
            trHTML += '<div class="card-body">';
            trHTML += '<a href="https://api.zgaf.io/api_v1/prefabs/' + prefabData['id'] + '/file" class="btn btn-primary me-1">Prefab File</a>';
            trHTML += '</div>';
            trHTML += '</div>';
            console.log(prefabData)

        }
        document.getElementById("prefab-info").innerHTML = trHTML;
    }
}

getPrefab(prefabId);