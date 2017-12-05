$(document).ready(() => {

    SDK.User.loadNav();

    $("#login-button").click(() => {

        const username = $("#inputusername").val();
        const password = $("#inputPassword").val();

        SDK.User.login(username, password, (err) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");


            }
            else if (err) {
                console.log("Error occured");
            } else {
                window.location.href = "index.html";
            }
        });

    });

});