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
        xmlHttp.open("GET", "/api_v2/me", false);
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

function loadDownloaded(page = 1) {
    scroll(0, 0);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/api_v2/variants/?page=" + page + "&size=21");
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
                trHTML += '<a href="/api_v2/variantview?varId=' + object['id'] + '"><img src="/content/variants/' + imageType[1] + '.png" class="card-img-top" alt="..." onerror="this.onerror=null;this.src=\'/content/default/forge.jpg\';"></a>';
                trHTML += '<div class="card-body">';
                trHTML += '<h4 class="card-title">' + object['variantName'] + '</h4>';
                trHTML += '<h5 class="card-title">Author: ' + object['variantAuthor'] + '</h5>';
                trHTML += '<h5 class="card-title">Uploaded ' + timeAgo + ' ago</h5>';
                trHTML += '</div>';
                trHTML += '<p class="card-text p-3">' + object['variantDescription'] + '</p>';
                trHTML += '</ul>';
                trHTML += '<div class="d-grid gap-2 d-md-block p-3">';
                trHTML += '<a href="/api_v2/variants/' + object['id'] + '/file" class="btn btn-primary me-1">Variant File</a>';
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

userLogin();
loadDownloaded();
