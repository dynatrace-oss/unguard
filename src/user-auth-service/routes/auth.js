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
        // https://www.cvedetails.com/cve/CVE-2016-10555/
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
        // https://www.cvedetails.com/cve/CVE-2016-10555/
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
