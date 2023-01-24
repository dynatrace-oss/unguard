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

const jwt_decode = require("jwt-decode");

exports.getJwtUser = function (cookies) {
    if (cookies.jwt) {
        return jwt_decode(cookies.jwt)["username"];
    }

    return null;
}

exports.getJwtUserId = function (cookies) {
    if (cookies.jwt) {
        return jwt_decode(cookies.jwt)["userid"];
    }

    return null;
}

exports.hasJwtRole = function (cookies, role) {
    if (cookies.jwt) {
        const roles = jwt_decode(cookies.jwt)["roles"];
        if (roles != null && roles.includes(role))
            return true;
    }

    return false;
}
