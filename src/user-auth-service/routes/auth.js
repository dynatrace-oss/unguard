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

var express = require('express');
var jwt = require('jwt-simple')
var jwtUtil = require('../utils/jwt')
const database = require("../utils/database");
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('auth-route');
});

router.post('/logout', async function (req, res) {
    if (!req.body)
        return res.sendStatus(400)

    var jwtToken = req.body.jwt;

    let decoded;
    try {
        // Vulnerable, because no algorithm is enforced for decoding
        // https://security.snyk.io/vuln/SNYK-JS-JWTSIMPLE-174523
        decoded = jwt.decode(jwtToken, jwtUtil.JwtPublic);
    } catch (ex) {
        return res.sendStatus(401);
    }

    // add token in database as invalidated tokens
    const result = await database.dbConnection.query(database.insertTokenQuery, [jwtToken])

    if (result[0].insertId != null && result[0].insertId != -1) {
        res.json({ result: 'successfully logged out!' })
    } else
        return res.sendStatus(404)
});

router.post('/isValid', async function (req, res) {
    if (!req.body)
        return res.sendStatus(400);

    const jwtToken = req.body.jwt;

    let decoded;
    try {
        // Vulnerable, because no algorithm is enforced for decoding
        // https://security.snyk.io/vuln/SNYK-JS-JWTSIMPLE-174523
        decoded = jwt.decode(jwtToken, jwtUtil.JwtPublic)
    } catch (ex) {
        return res.sendStatus(401);
    }

    const result = await database.dbConnection.query(database.checkTokenExistsQuery, [jwtToken]);
    if (result[0].length > 0) {
        return res.sendStatus(403) // Maybe 404 is not optimal, but found no better status-code, which fits this purpose
    }

    return res.json({ result: 'token is valid' })
});

module.exports = router;
