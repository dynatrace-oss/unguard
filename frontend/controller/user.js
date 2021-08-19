const jwt_decode = require("jwt-decode");

exports.getLoggedInUser = function (req) {
    if (req.cookies.jwt) {
        return jwt_decode(req.cookies.jwt)["username"];
    }

    return null;
}