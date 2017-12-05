const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: headers,
            contentType: "application/json",
            dataType: "text",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                cb(null, JSON.parse(data), status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
            }
        });

    },
    Order: {
        create: (data, cb) => {
            SDK.request({
                method: "POST",
                url: "/users/order/16",
                data: data.id,
                headers: {authorization: SDK.Storage.load("tokenId")}
            }, cb, (err) => {
                if(err) return cb(err);

                cb(null);
            });
        },

        loadMad: (cb) => {
            SDK.request({
                method: "GET",
                url: "/food",
                headers: {authorization: SDK.Storage.load("token")}
            }, (err, data) => {

                let decryptedData = SDK.Crypter.encryptDecrypt(data);

                if(err) return cb(err);

                cb(null, decryptedData);
            })

        },

        loadDrikkevarer: (cb) => {
            SDK.request({
                method: "GET",
                url: "/drink",
                headers: {authorization: SDK.Storage.load("token")}
            }, (err, data) => {

                let decryptedData = SDK.Crypter.encryptDecrypt(data);

                if(err) return cb(err);

                cb(null, decryptedData);

            });

        }
    },

    User: {
        logOut: () => {
            SDK.Storage.remove("token");
            window.location.href = "index.html";
        },
        login: (username, password, cb) => {
            SDK.request({
                data: {
                    username: username,
                    password: password
                },
                url: "/users/login",
                method: "POST"
            }, (err, data) => {

                let decryptedData = SDK.Crypter.encryptDecrypt(data);

                //On login-error
                if (err) return cb(err);

                SDK.Storage.persist("token", decryptedData);

                cb(null, decryptedData);

            }, (err, data) => {

                if(err) return cb(err);

                cb(null, data);
            });
        },
        myOrder: (cb) => {
            SDK.request({
                url: "/history",
                method: "GET",
                headers: {
                    authorization: SDK.Storage.load("token")
                }
            }, (err, data) => {

                if(err) return cb(err);

                cb(null, data);
            })

        },
        create: (username, password, cb) => {

            SDK.request({
                data: {
                    username: username,
                    password: password
                },
                url: "/users/create",
                method: "POST"
            }, (err, data) => {

                if (err) return cb(err);

                cb(null, data);

            });



        },
        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                const currentToken = SDK.Storage.load("token");
                if (currentToken) {
                    $(".navbar-right").html(`
            <li><a href="drikkevarer.html">Drikkevarer</a></li>
            <li><a href="mad.html">Mad</a></li>
            <li><a href="history.html">Your orders</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
                } else {
                    $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
                }
                $("#logout-link").click(() => SDK.User.logOut());
                cb && cb();
            });
        }
    },

    Crypter: {

        encryptDecrypt(input)
{
    var key = ['L', 'O', 'L']; //Can be any chars, and any size array
    var output = [];

    for (var i = 0; i < input.length; i++) {
        var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
        output.push(String.fromCharCode(charCode));
    }
    return output.join("");
}
},

Storage: {
    prefix: "KantineLOLSDK",
        persist
:
    (key, value) => {
        window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
    },
        load
:
    (key) => {
        const val = window.localStorage.getItem(SDK.Storage.prefix + key);
        try {
            return JSON.parse(val);
        }
        catch (e) {
            return val;
        }
    },
        remove
:
    (key) => {
        window.localStorage.removeItem(SDK.Storage.prefix + key);
    }
}
}
;