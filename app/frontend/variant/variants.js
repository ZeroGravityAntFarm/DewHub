const thisUrl = new URL(window.location.toLocaleString()).searchParams;
const varId = thisUrl.get('varId');

console.log(varId);

function getUser(userId) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.zgaf.io/api_v1/users/" + userId, false);
    xmlHttp.send();
    const user = JSON.parse(xmlHttp.response);

    return user
}

function getVar(varId) {
    var trHTML = '';
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.zgaf.io/api_v1/variants/" + varId);
    xmlHttp.send();

    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const varData = JSON.parse(xmlHttp.responseText);
            var imageType = varData["variantFileName"].split(".")
            user = getUser(varData["owner_id"]);

            trHTML += '';
            trHTML += '<div class="card text-white bg-dark mb-3">';
            trHTML += '<img src="https://api.zgaf.io/static/content/variants/' + imageType[1] + '.png" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'https://api.zgaf.io/static/content/default/forge.jpg\';">';
            trHTML += '<div class="card-body">';
            trHTML += '<h3 class="card-title">' + varData["variantName"] + '</h3>';
            trHTML += '<p class="card-text">' + varData["variantType"] + '</p>';
            trHTML += '</div>';
            trHTML += '<ul class="list-group list-group-flush">';
            trHTML += '<li class="list-group-item bg-dark text-white">Uploaded By: ' + user["name"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">About: ' + varData["variantDescription"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Author: ' + varData["variantAuthor"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Downloads: ' + varData["downloads"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">Uploaded: ' + varData["time_created"] + '</li>';
            trHTML += '<li class="list-group-item bg-dark text-white">ID: ' + varData["id"] + '</li>';
            trHTML += '</ul>';
            trHTML += '<div class="card-body">';
            trHTML += '<a href="https://api.zgaf.io/api_v1/maps/' + varData['mapName'] + '/file" class="btn btn-primary me-1">Variant File</a>';
            trHTML += '</div>';
            trHTML += '</div>';
            console.log(varData)

        }
        document.getElementById("var-info").innerHTML = trHTML;
    }
}

getVar(varId);
