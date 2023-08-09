const form = document.getElementById('login-form');

form.onsubmit = function (event) {
    var xhr = new XMLHttpRequest();
    var formData = new FormData(form);
    data = {}
    formData.forEach((value, key) => (data[key] = value));
    console.log(formData)
    //open the request
    xhr.open('POST', 'https://api.zgaf.io/api_v1/login')

    //send the form data
    xhr.send(formData);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var responseText = JSON.parse(xhr.responseText);
            var trHTML = '';

            console.log(responseText)
            if (xhr.status == 403) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += 'Wrong Username or Password';
                trHTML += '</div>'
                document.getElementById("status-message").innerHTML = trHTML;
            } else if (xhr.status == 200) {
                trHTML += '<div class="alert alert-success" role="alert">';
                trHTML += 'Success!';
                trHTML += '</div>'
                document.getElementById("status-message").innerHTML = trHTML;

                setCookie("Authorization", responseText.access_token, 1)
                delayRedirect();

            } else if (xhr.status == 401) {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += 'Wrong Username or Password';
                trHTML += '</div>'
                document.getElementById("status-message").innerHTML = trHTML;

            } else {
                trHTML += '<div class="alert alert-danger" role="alert">';
                trHTML += 'Could not access API ';
                trHTML += '</div>'
                document.getElementById("status-message").innerHTML = trHTML;
            }

            form.reset(); //reset form after AJAX success or do something else
        }
    }
    //Fail the onsubmit to avoid page refresh.
    return false;
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + "; SameSite=None; " + "Secure;" + "path=/";
    console.log(document.cookie)
}

function delayRedirect() {
    setTimeout(function () {
        window.location.href = "/";
    }, 2000);
}
