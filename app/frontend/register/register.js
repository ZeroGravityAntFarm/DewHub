const form = document.getElementById('register-form');

form.onsubmit = function (event) {
    var xhr = new XMLHttpRequest();
    var formData = new FormData(form);
    data = {}
    formData.forEach((value, key) => (data[key] = value));
    console.log(data)
    //open the request
    xhr.open('POST', 'https://api.zgaf.io/api_v1/users/')

    //send the form data
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var responseText = JSON.parse(xhr.responseText);
            var trHTML = '';

            console.log(responseText)
            if (xhr.status == 403) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += responseText;
                trHTML += '</div>'
                document.getElementById("status-message").innerHTML = trHTML;

            } else if (xhr.status == 200) {
                trHTML += '<div class="alert alert-success" role="alert">';
                trHTML += 'Success!';
                trHTML += '</div>'
                document.getElementById("status-message").innerHTML = trHTML;

                delayRedirect();

            } else if (xhr.status == 401 || xhr.status == 400) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += responseText.detail;
                trHTML += '</div>'
                document.getElementById("status-message").innerHTML = trHTML;

            } else {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += 'Could not access API (Contact Buck)';
                trHTML += '</div>'
                document.getElementById("status-message").innerHTML = trHTML;

            }

            form.reset(); //reset form after AJAX success or do something else
        }
    }
    //Fail the onsubmit to avoid page refresh.
    return false;
}

function delayRedirect() {
    setTimeout(function () {
        window.location.href = "/login";
    }, 2000);
}