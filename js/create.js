$(document).ready(() => {

    SDK.User.loadNav();

    $("#create-button").click(() => {

        const username = $("#inputcreateusername").val();
        const password = $("#inputcreatePassword").val();

        SDK.User.create(username, password, (err) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");


            }
            else if (err) {
                console.log("Error occured");
            } else {
                alert("User created");
                window.location.href = "index.html";
            }
        });

    });

});