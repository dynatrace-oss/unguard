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

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const database = require('../utils/database');
const jwtUtil = require('../utils/jwt');
const jwt = require('jwt-simple');

const ALPHANUMERIC_REGEX = /^\w+$/;

router.post('/register', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!ALPHANUMERIC_REGEX.test(username)) {
        res.status(400).json({ message: "Only numbers, underscores, upper- and lowercase letters are allowed in the username." })
        return
    }

    // check if user already exists
    const result = await database.dbConnection.query(database.checkUserExistsQuery, [ username ]);
    if (result[0].length > 0) {
        res.status(409).json({ message: "User already exists." })
        return
    }

    bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
            res.status(500).json({ message: "Password can not be hashed." })
            return
        }
        // register in database
        const result = await database.dbConnection.query(database.insertUserQuery, [ username, hash ])

        if (result[0].insertId != null && result[0].insertId !== -1) {
            res.json({ result: 'successfully registered user' })
        } else {
            res.status(500).json({ message: 'Error while creating user.' })
        }
    });
});

router.post('/login', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // check if user exists
    const result = await database.dbConnection.query(database.checkUserExistsQuery, [ username ]);
    if (result[0].length < 1) {
        res.status(404).json({ message: "Given user does not exists!" })
        return
    }

    const user = result[0][0];
    const roles = await database.dbConnection.query(database.selectUserWithRole, [ user.id ]).then((response) => {
        const userWithRoles = response[0];
        if (userWithRoles.length === 0) {
            return [];
        }

        const userRoles = [];
        userWithRoles.forEach(user => {
            if (user.role_name !== null) {
                userRoles.push("" + user.role_name);
            }
        });

        return userRoles;
    });


    bcrypt.compare(password, user.password_hash, function (err, compareResult) {
        if (compareResult) {
            res.json({
                result: "successfully logged in!",
                jwt: jwtUtil.generateJwtAccessToken(username, user.id, roles)
            })
        } else {
            res.status(401).json({ message: 'Wrong password!' })
        }
    });
});

router.post('/username', async function (req, res) {
    if (!req.body)
        return res.sendStatus(400)

    const jwtToken = req.body.jwt;
    const userId = req.body.userid;

    try {
        // Vulnerable, because no algorithm is enforced for decoding
        // https://security.snyk.io/vuln/SNYK-JS-JWTSIMPLE-174523
        jwt.decode(jwtToken, jwtUtil.JwtPublic);

        // get userId for username
        const result = await database.dbConnection.query(database.selectUserNameQuery, [ userId ])

        if (result[0].length !== 0) {
            res.json({ username: result[0][0].username })
        } else {
            res.sendStatus(404)
        }

    } catch (ex) {
        return res.sendStatus(401);
    }

});

router.post('/useridForName', async function (req, res) {
    if (!req.body)
        return res.sendStatus(400)

    const jwtToken = req.body.jwt;
    const username = req.body.username;

    try {
        // Vulnerable, because no algorithm is enforced for decoding
        // https://security.snyk.io/vuln/SNYK-JS-JWTSIMPLE-174523
        jwt.decode(jwtToken, jwtUtil.JwtPublic);

        // get userId for username
        const result = await database.dbConnection.query(database.selectIdForName, [ username ])

        if (result[0].length !== 0) {
            res.json({ userId: result[0][0].id })
        } else {
            res.sendStatus(404)
        }
    } catch (ex) {
        return res.sendStatus(401);
    }
});

module.exports = router;
