// generated using require('crypto').randomBytes(64).toString('hex')
const jwt = require("jsonwebtoken");

const JWT_SECRET = "0x220be4da80f8f7790e06daa05ec6dc870ce547042056644150d2a0293747d35ab38c06ddb00fc8cc80f702327078aa2792fce687c44f598d2ad51ad711df98c3"

function generateJwtAccessToken(username) {
    return jwt.sign({username: username}, JWT_SECRET, {expiresIn: '86400s'})
}

exports.generateJwtAccessToken = generateJwtAccessToken
exports.JwtSecret = JWT_SECRET