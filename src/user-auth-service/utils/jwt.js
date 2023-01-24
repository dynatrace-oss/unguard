/*
Copyright 2023 Dynatrace LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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