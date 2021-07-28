// generated using require('crypto').randomBytes(64).toString('hex')
const jwt = require("jwt-simple");
var fs = require('fs')
var path = require('path')

var JWT_PUB = fs.readFileSync(path.normalize(__dirname + '/../keys/jwtRS256.key.pub'));
var JWT_PRIV = fs.readFileSync(path.normalize(__dirname + '/../keys/jwtRS256.key'));

function generateJwtAccessToken(username, userid, roles) {
    var jwtToken = {
        username: username,
        userid: userid,
        roles: roles == null ? [] : roles
    }

    return jwt.encode(jwtToken, JWT_PRIV, 'RS256')
}

exports.generateJwtAccessToken = generateJwtAccessToken
exports.JwtPublic = JWT_PUB
exports.JwtPrivate = JWT_PRIV