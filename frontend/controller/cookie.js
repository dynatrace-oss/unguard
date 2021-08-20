const jwt_decode = require("jwt-decode");

exports.cookieGetUser = function (cookies) {
    if (cookies.jwt) {
        return jwt_decode(cookies.jwt)["username"];
    }

    return null;
}

exports.cookieHasRole = function (cookies, role) {
    if (cookies.jwt) {
        const roles = jwt_decode(cookies.jwt)["roles"];
        if (roles != null && roles.includes(role))
            return true;
    }

    return false;
}