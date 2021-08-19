const jwt_decode = require("jwt-decode");

exports.roles = {
    AD_MANAGER: "AD_MANAGER"
}

exports.containsRole = function (req, role) {
    if (req.cookies.jwt) {
        const roles = jwt_decode(req.cookies.jwt)["roles"];
        if (roles != null && roles.includes(role))
            return true;
    }

    return false;
}
